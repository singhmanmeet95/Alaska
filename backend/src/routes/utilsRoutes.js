import express from "express";
import pathRoutes from "../controllers/pathController.js";

const router = express.Router();

router.use("/path", pathRoutes);

export default router;
