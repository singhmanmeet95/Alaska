import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const STATIONS = [
  "Brigadier Hoshiar Singh",
  "Bahadurgarh City",
  "Pandit Shree Ram Sharma",
  "Tikri Border",
  "Tikri Kalan",
  "Ghevra Metro Station",
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
  "Netaji Subhash Place",
  "Kohat Enclave",
  "Pitam Pura",
  "Rohini East",
  "Rohini West",
  "Rithala (Last Station)",
  "Shastri Nagar",
  "Pratap Nagar",
  "Pul Bangash",
  "Tis Hazari",
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
  "Terminal 1 IGI Airport",
  "Janak Puri West",
  "Janak Puri East",
  "Tilak Nagar",
];

function generateStationList(length) {
  const list = [];
  for (let i = 0; i < length; i++) {
    list.push(STATIONS[Math.floor(Math.random() * STATIONS.length)]);
  }
  return list;
}

async function main() {
  console.log("Cleaning existing database records...");

  await prisma.review.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating 10 detailed mock users...");
  const users = [];
  const hashedPassword = await bcrypt.hash("12345678", 10);

  for (let i = 0; i < 10; i++) {
    const jsonHandles = {
      instagram: `traveler_${i + 1}_journeys`,
      github: `commuterdev${i + 1}`,
      linkedin: `in/urban-traveler-${i + 1}`,
      website: `https://urbantraveler${i + 1}.com`,
    };

    const user = await prisma.user.create({
      data: {
        name: `Urban Traveler ${i + 1}`,
        username: `urban_traveler_${i + 1}`,
        email: `${String.fromCharCode(97 + i)}@gmail.com`,
        password: hashedPassword,
        profile_image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF7mQbYBfulskZhBJd-eBKcp3aHt1W2Q6JNw&s",
        about:
          "I am a daily metro commuter who enjoys exploring different routes across the city. Traveling gives me time to think, observe people, and sometimes have meaningful conversations. I believe shared journeys can turn strangers into acquaintances and sometimes even friends. Whether it’s a short office commute or a long cross-city ride, I value punctuality, respect, and positive energy during travel.",
        bio: `Daily commuter | Tech enthusiast | Travel log #${i + 1}`,
        images: [
          "https://res.cloudinary.com/dhkrqheyc/image/upload/v1749222547/my_uploads/gbh3phv2an7yc8uf8vde.jpg",
          "https://res.cloudinary.com/dhkrqheyc/image/upload/v1749221270/my_uploads/rjcyeraj5mdiokoqlfw9.jpg",
          "https://res.cloudinary.com/dhkrqheyc/image/upload/v1749222447/my_uploads/chztx5rxok7qzxypkqln.jpg",
        ],
        ratings: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        ratingCount: Math.floor(Math.random() * 50) + 10,
        json: jsonHandles,
      },
    });

    users.push(user);
    console.log(`Created user: ${user.name}`);
  }

  console.log("Creating 50 realistic long metro trips...");

  for (let i = 0; i < 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const listLength = Math.floor(Math.random() * 11) + 40;
    const stations = generateStationList(listLength);

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

  console.log("Trips created successfully.");

  console.log("Creating friendships...");

  for (let i = 0; i < 5; i++) {
    await prisma.friendship.create({
      data: {
        requesterId: users[i].id,
        receiverId: users[i + 5].id,
        status: "ACCEPTED",
      },
    });
  }

  // Create some PENDING connection requests for the first user (User 1)
  console.log("Creating pending connection requests for User 1...");
  for (let i = 1; i <= 3; i++) {
    await prisma.friendship.create({
      data: {
        requesterId: users[i].id,
        receiverId: users[0].id, // Send to User 1
        status: "PENDING",
      },
    });
  }

  // Create an extra ACCEPTED friend for User 1
  await prisma.friendship.create({
    data: {
      requesterId: users[0].id,
      receiverId: users[4].id,
      status: "ACCEPTED",
    },
  });

  console.log("Creating meaningful reviews...");

  const reviewsData = [5, 5, 4, 4, 3, 2, 1, 5, 3, 2];

  const comments = [
    "I had an excellent experience traveling together. From the very beginning, the coordination was smooth and well managed. They arrived on time, communicated clearly about the meeting point, and were respectful throughout the journey. We even had a thoughtful discussion about work-life balance and daily commuting challenges. The entire trip felt comfortable and safe. I truly appreciate their punctuality and positive attitude during the commute.",

    "This was one of the most pleasant metro rides I have had in a long time. Despite it being a long route with multiple station stops, the journey felt easy and stress-free. They were considerate about seating, aware of crowd movement, and ensured smooth communication throughout. I especially liked how they kept updating about the next interchange. Highly recommended for future shared commutes.",

    "Very responsible and mature fellow traveler. The coordination before the trip was handled professionally, and even during peak rush hours they maintained patience and calmness. We shared some interesting conversations about technology and city life, which made the long commute feel much shorter. I would definitely be comfortable traveling together again.",

    "Although the journey was long and slightly crowded, the overall experience was positive. They informed me in advance about a slight delay and apologized sincerely. Throughout the trip they remained polite, respectful, and mindful of personal space. I appreciate their honesty and transparency. It made the commute smoother and more comfortable.",

    "A very well-organized and dependable travel companion. From planning the route to choosing the right coach for less crowd, everything was handled thoughtfully. They were communicative without being intrusive and ensured the entire journey was coordinated properly. The experience felt safe, structured, and friendly at the same time.",

    "The journey felt calm and comfortable. They respected boundaries, maintained proper communication, and showed great awareness of surroundings during crowded station interchanges. It’s rare to find someone so punctual and easy to coordinate with during daily metro rush hours. I genuinely enjoyed the ride.",

    "I appreciate how understanding and flexible they were during a minor schedule change. Instead of getting frustrated, they adjusted smoothly and kept communication clear. We had a good conversation about city infrastructure and daily travel routines. Overall, it was a smooth and pleasant experience.",

    "The entire commute felt well-coordinated and safe. They were proactive about confirming arrival time and location. Even during peak hours, they remained composed and respectful. It felt like traveling with someone experienced in daily commuting. Would absolutely recommend as a reliable travel companion.",

    "Very polite, well-mannered, and respectful throughout the journey. They ensured proper communication before boarding and during station interchanges. The long ride felt shorter because of engaging discussions and positive energy. A genuinely comfortable and safe commuting experience.",

    "Even though it was a multi-stop route across the city, everything went smoothly. They were attentive, patient, and communicated clearly at every step. The experience felt structured and safe, especially during crowded segments. I would not hesitate to plan another commute together in the future.",
  ];
  for (let i = 0; i < 30; i++) {
    const reviewer = users[Math.floor(Math.random() * users.length)];
    let reviewee = users[Math.floor(Math.random() * users.length)];

    while (reviewer.id === reviewee.id) {
      reviewee = users[Math.floor(Math.random() * users.length)];
    }

    await prisma.review.create({
      data: {
        rating: reviewsData[Math.floor(Math.random() * reviewsData.length)],
        reviewerId: reviewer.id,
        revieweeId: reviewee.id,
        comment: comments[Math.floor(Math.random() * comments.length)],
      },
    });
  }

  console.log("Creating realistic chat messages...");
  const chatMessages = [
    "Hey! I’ve just reached the station entrance near Gate 3. It’s slightly crowded right now because of office hours, but I’m standing near the ticket counter. Let me know exactly where you are so we can coordinate properly and board together without confusion.",

    "I’m inside the metro now, second coach from the front. It’s moderately crowded but manageable. If you haven’t boarded yet, try coming towards the middle section because it usually has slightly less rush during this time. Let me know once you’re inside.",

    "I might be running about 5 to 7 minutes late due to unexpected traffic near the station road. Really sorry about that. If you reach earlier, please wait near the main security check area so we can enter together. I appreciate your patience.",

    "Are you planning to get down at Rajiv Chowk or continuing till Central Secretariat? I just want to confirm so that we can stand near the correct exit gate and avoid unnecessary walking during the interchange.",

    "It was really nice meeting you today. The conversation made the long journey much more enjoyable. Let’s plan tomorrow’s commute as well if our schedules match. Safe travels and message me once you reach your destination.",

    "The train seems slightly delayed due to congestion ahead. Don’t worry though, we still have enough buffer time before reaching our stop. Let’s stay near the door when our station approaches to avoid last-minute rush.",

    "If you’re already inside the station, try coming near the escalator on the left side of the concourse area. I’m standing there wearing a blue shirt. That might be easier than trying to locate each other inside the moving crowd.",

    "Tomorrow I’ll be leaving slightly earlier than usual, around 8:15 AM instead of 8:30. If that works for you, we can board the earlier train and avoid peak crowd pressure. Let me know your availability.",
  ];

  // Fetch only ALL ACCEPTED friendships to ensure chats exist exclusively between friends
  const acceptedFriendships = await prisma.friendship.findMany({
    where: { status: "ACCEPTED" },
  });

  if (acceptedFriendships.length > 0) {
    for (let i = 0; i < 30; i++) {
      // Pick a random friendship
      const friendship =
        acceptedFriendships[
          Math.floor(Math.random() * acceptedFriendships.length)
        ];

      // Randomly assign sender/receiver between the two friends
      const isRequesterSender = Math.random() > 0.5;
      const senderId = isRequesterSender
        ? friendship.requesterId
        : friendship.receiverId;
      const receiverId = isRequesterSender
        ? friendship.receiverId
        : friendship.requesterId;

      await prisma.chat.create({
        data: {
          senderId: senderId,
          receiverId: receiverId,
          message:
            chatMessages[Math.floor(Math.random() * chatMessages.length)],
          createdAt: new Date(Date.now() - Math.random() * 10000000),
        },
      });
    }
  } else {
    console.warn(
      "No accepted friendships found. Skipping chat seeding to maintain data integrity.",
    );
  }

  console.log(
    "Database seeded thoroughly with realistic and meaningful test data!",
  );
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
