import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const STATIONS = [
  "Brigadier Hoshiar Singh",
  "Bahdurgarh City",
  "Pandit Shree Ram Sharma",
  "Tikri Border",
  "Tikri Kalan",
  "Ghevra Metro station",
  "Mundka Industrial Area (MIA)",
  "Mundka",
  "Rajdhani Park",
  "Nangloi Railway Station",
  "Nangloi",
  "Maharaja Surajmal Stadium",
  "Udyog Nagar",
  "Peera Garhi",
  "Paschim Vihar (West)",
  "Paschim Vihar (East)",
  "Madipur",
  "Shivaji Park",
  "Punjabi Bagh",
  "Ashok Park Main",
  "Inderlok",
  "Kanhaiya Nagar",
  "Keshav Puram",
  "Netaji Subash Place",
  "Kohat Enclave",
  "Pitam Pura",
  "Rohini East",
  "Rohini West",
  "Rithala(last station)",
  "Rohini West",
  "Rohini East",
  "Pitam Pura",
  "Kohat Enclave",
  "Netaji Subash Place",
  "Keshav Puram",
  "Kanhaiya Nagar",
  "Inderlok",
  "Shastri Nagar",
  "Pratap Nagar",
  "Pul Bangash",
  "Tis Hazari",
  "Kashmere Gate",
  "Shastri Park",
  "Seelampur",
  "Welcome",
  "Shahdara",
  "Mansarovar Park",
  "Jhil Mil",
  "Dilshad Garden",
  "Shaheed Nagar",
  "Raj Bagh",
  "Major Mohit Sharma",
  "Shyam park",
  "Mohan Nagar",
  "Arthala",
  "Hindon River",
  "Shaheed Sthal",
  "Hindon River",
  "Arthala",
  "Mohan Nagar",
  "Shyam park",
  "Major Mohit Sharma",
  "Raj Bagh",
  "Shaheed Nagar",
  "Dilshad Garden",
  "Jhil Mil",
  "Mansarovar Park",
  "Shahdara",
  "Welcome",
  "Seelampur",
  "Shastri Park",
  "Kashmere Gate",
  "Chandni Chowk",
  "Chawri Bazar",
  "New Delhi",
  "Rajiv Chowk",
  "Patel Chowk",
  "Central Secretariat",
  "Udyog Bhawan",
  "Lok Kalyan Marg",
  "Jor Bagh",
  "Dilli Haat INA",
  "AIIMS",
  "Green Park",
  "Hauz Khas",
  "IIT Delhi",
  "RK Puram",
  "Munirka",
  "Vasant Vihar",
  "Shankar Vihar",
  "Terminal 1 IGI Airport",
  "Sadar Bazaar Cantonment",
  "Palam",
  "Dashrath Puri",
  "Dabri Mor - Janakpuri South",
  "Janak Puri West",
  "Uttam Nagar East",
  "Janak Puri West",
  "Janak Puri East",
  "Tilak Nagar",
];

function generateStationList(length) {
  const list = [];
  for (let i = 0; i < length; i++) {
    // Ensuring consecutive stations are somewhat randomised
    list.push(STATIONS[Math.floor(Math.random() * STATIONS.length)]);
  }
  return list;
}

async function main() {
  console.log("Cleaning up existing database records...");

  // It's important to delete in the correct order to avoid Foreign Key violations
  await prisma.review.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating 10 mock users...");
  const users = [];
  const hashedPassword = await bcrypt.hash("12345678", 10);

  for (let i = 1; i <= 10; i++) {
    const jsonHandles = {
      instagram: `user${i}._.official`,
      github: `devuser${i}`,
      linkedin: `in/mockuser${i}`,
      website: `https://mockuser${i}.dev`,
    };

    const user = await prisma.user.create({
      data: {
        name: `Traveler ${i}`,
        username: `traveler_${i}_mock`,
        email: `${String.fromCharCode(97 + i)}@gmail.com`,
        password: hashedPassword,
        profile_image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF7mQbYBfulskZhBJd-eBKcp3aHt1W2Q6JNw&s",
        about:
          "lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        bio: `Full time commuter | #${i}`,
        images: [
          "https://res.cloudinary.com/dhkrqheyc/image/upload/v1749222547/my_uploads/gbh3phv2an7yc8uf8vde.jpg",
          "https://res.cloudinary.com/dhkrqheyc/image/upload/v1749221270/my_uploads/rjcyeraj5mdiokoqlfw9.jpg",
          "https://res.cloudinary.com/dhkrqheyc/image/upload/v1749222447/my_uploads/chztx5rxok7qzxypkqln.jpg",
          "https://res.cloudinary.com/dhkrqheyc/image/upload/v1749222547/my_uploads/gbh3phv2an7yc8uf8vde.jpg",
          "https://res.cloudinary.com/dhkrqheyc/image/upload/v1749221270/my_uploads/rjcyeraj5mdiokoqlfw9.jpg",
          "https://res.cloudinary.com/dhkrqheyc/image/upload/v1749222447/my_uploads/chztx5rxok7qzxypkqln.jpg",
          "https://res.cloudinary.com/dhkrqheyc/image/upload/v1749222547/my_uploads/gbh3phv2an7yc8uf8vde.jpg",
          "https://res.cloudinary.com/dhkrqheyc/image/upload/v1749221270/my_uploads/rjcyeraj5mdiokoqlfw9.jpg",
          "https://res.cloudinary.com/dhkrqheyc/image/upload/v1749222447/my_uploads/chztx5rxok7qzxypkqln.jpg",
        ],
        ratings: parseFloat((Math.random() * 2 + 3).toFixed(1)), // Ratings between 3.0 and 5.0
        ratingCount: Math.floor(Math.random() * 50) + 10,
        json: jsonHandles,
      },
    });
    users.push(user);
    console.log(`Created user: ${user.name}`);
  }

  console.log("Creating 50 long mock trips (40-50 stations each)...");
  for (let i = 0; i < 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const listLength = Math.floor(Math.random() * 11) + 40; // 40 to 50 length
    const stations = generateStationList(listLength);

    // Past dates ranging back to a few months
    const randomPastTime = new Date(
      Date.now() - Math.random() * (1000 * 60 * 60 * 24 * 60),
    );

    await prisma.trip.create({
      data: {
        userId: randomUser.id,
        startTime: randomPastTime,
        stationList: stations,
        length: listLength,
        startStation: stations[0],
        endStation: stations[stations.length - 1],
      },
    });
  }
  console.log("Successfully created 50 trips!");

  console.log("Creating friendships...");
  // Connect adjacent users as friends
  for (let i = 0; i < 5; i++) {
    await prisma.friendship.create({
      data: {
        requesterId: users[i].id,
        receiverId: users[i + 5].id,
        status: "ACCEPTED",
      },
    });
  }

  console.log("Creating reviews...");
  const reviewsData = [
    { rating: 5 },
    { rating: 5 },
    { rating: 4 },
    { rating: 4 },
    { rating: 3 },
    { rating: 2 },
    { rating: 1 },
    { rating: 5 },
    { rating: 3 },
    { rating: 2 },
  ];

  const comments = [
    "I really enjoyed traveling with them, very friendly!",
    "Great company on a long commute.",
    "Quiet and peaceful trip.",
    "Had some interesting conversations.",
    "A bit late but otherwise fine.",
    "Pleasant journey overall.",
    "Highly recommended travel buddy!",
    "Polite and respectful.",
  ];

  for (let i = 0; i < 30; i++) {
    const reviewer = users[Math.floor(Math.random() * users.length)];
    let reviewee = users[Math.floor(Math.random() * users.length)];
    while (reviewer.id === reviewee.id) {
      reviewee = users[Math.floor(Math.random() * users.length)];
    }

    const reviewTemplate =
      reviewsData[Math.floor(Math.random() * reviewsData.length)];

    await prisma.review.create({
      data: {
        rating: reviewTemplate.rating,
        reviewerId: reviewer.id,
        revieweeId: reviewee.id,
        comment: comments[Math.floor(Math.random() * comments.length)],
        
      },
    });
  }

  console.log("Creating mock chats...");
  for (let i = 0; i < 30; i++) {
    const sender = users[Math.floor(Math.random() * users.length)];
    let receiver = users[Math.floor(Math.random() * users.length)];
    while (sender.id === receiver.id) {
      receiver = users[Math.floor(Math.random() * users.length)];
    }

    await prisma.chat.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        message: [
          "Hey! Are we meeting at Rajiv Chowk?",
          "I'm running a bit late, wait at the gate.",
          "Let's travel together tomorrow.",
          "Have you reached?",
        ][Math.floor(Math.random() * 4)],
        createdAt: new Date(Date.now() - Math.random() * 10000000),
      },
    });
  }

  console.log("✅ Database seeded thoroughly with test data!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
