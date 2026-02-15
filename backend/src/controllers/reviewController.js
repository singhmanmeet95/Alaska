import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        reviewer: {
          select: { id: true, name: true, username: true, images: true },
        },
        reviewee: {
          select: { id: true, name: true, username: true, images: true },
        },
      },
    });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get review by ID
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        reviewer: {
          select: { id: true, name: true, username: true, images: true },
        },
        reviewee: {
          select: { id: true, name: true, username: true, images: true },
        },
      },
    });

    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get reviews for a specific user (as reviewee - received reviews)
export const getReceivedReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: {
          select: { id: true, name: true, username: true, images: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get reviews written by a specific user (as reviewer)
export const getWrittenReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { reviewerId: userId },
      include: {
        reviewee: {
          select: { id: true, name: true, username: true, images: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a review
export const createReview = async (req, res) => {
  try {
    const { revieweeId, rating, comment } = req.body;
    const reviewerId = req.user.id; // From auth middleware

    if (!revieweeId || !rating) {
      return res.status(400).json({
        success: false,
        error: "revieweeId and rating are required",
      });
    }

    if (reviewerId === revieweeId) {
      return res.status(400).json({
        success: false,
        error: "You cannot review yourself",
      });
    }

    // Check if user already reviewed this person? (Optional rule, maybe allowed multiple times)
    // For now, allow multiple reviews.

    const review = await prisma.review.create({
      data: {
        reviewerId,
        revieweeId,
        rating: Number(rating),
        comment,
      },
      include: {
        reviewer: {
          select: { id: true, name: true, username: true },
        },
        reviewee: {
          select: { id: true, name: true, username: true },
        },
      },
    });

    // Update aggregated rating for reviewee
    const aggregations = await prisma.review.aggregate({
      where: { revieweeId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.user.update({
      where: { id: revieweeId },
      data: {
        ratings: Math.round(aggregations._avg.rating || 0), // Assuming ratings is int, or float? Schema says Int.
        ratingCount: aggregations._count.rating,
      },
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // From auth middleware

    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    // Ensure only the reviewer can update
    if (existingReview.reviewerId !== userId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this review",
      });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: rating ? Number(rating) : undefined,
        comment,
      },
    });

    // Update aggregated rating for reviewee
    if (rating) {
      const revieweeId = existingReview.revieweeId;
      const aggregations = await prisma.review.aggregate({
        where: { revieweeId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await prisma.user.update({
        where: { id: revieweeId },
        data: {
          ratings: Math.round(aggregations._avg.rating || 0),
          ratingCount: aggregations._count.rating,
        },
      });
    }

    res.json({ success: true, data: updatedReview });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    // Ensure only the reviewer can delete (or admin if we had roles)
    if (existingReview.reviewerId !== userId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this review",
      });
    }

    await prisma.review.delete({
      where: { id },
    });

    // Update aggregated rating for reviewee
    const revieweeId = existingReview.revieweeId;
    const aggregations = await prisma.review.aggregate({
      where: { revieweeId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.user.update({
      where: { id: revieweeId },
      data: {
        ratings: Math.round(aggregations._avg.rating || 0),
        ratingCount: aggregations._count.rating,
      },
    });

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
