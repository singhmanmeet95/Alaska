import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { io } from 'socket.io-client';
import inquirer from 'inquirer';
import jwt from 'jsonwebtoken';
import { performance } from 'perf_hooks';
import { execSync } from 'child_process';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_for_local_dev';
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:4001';

async function generateDummyUsers(count) {
  console.log(`Generating ${count} dummy users...`);
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      name: `User ${i}`,
      username: `user_${Date.now()}_${i}`,
      email: `user_${Date.now()}_${i}@test.com`,
      password: 'password'
    });
  }

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true
  });

  const createdUsers = await prisma.user.findMany({
    where: { username: { startsWith: 'user_' } },
    take: count,
    orderBy: { id: 'desc' }
  });

  return createdUsers;
}

async function runTest() {
  let usersCount = parseInt(process.argv[2], 10);
  let messagesPerUser = parseInt(process.argv[3], 10);
  
  if (!usersCount || !messagesPerUser) {
    const answers = await inquirer.prompt([
      {
        type: 'number',
        name: 'uCount',
        message: 'Enter number of users (x):',
        default: 10,
        validate: (val) => val > 1 ? true : 'Please enter a number > 1'
      },
      {
        type: 'number',
        name: 'mCount',
        message: 'Enter messages per user (m):',
        default: 50,
        validate: (val) => val > 0 ? true : 'Please enter a number > 0'
      }
    ]);
    usersCount = answers.uCount;
    messagesPerUser = answers.mCount;
  }
  const totalMessages = usersCount * messagesPerUser;

  const users = await generateDummyUsers(usersCount);
  if (users.length < usersCount) {
    console.error("Failed to generate enough users.");
    process.exit(1);
  }

  console.log(`Successfully prepared ${users.length} users.`);
  console.log(`Starting load test. Total messages to send: ${totalMessages}`);

  const sockets = [];
  const metrics = {
    connected: 0,
    connectionErrors: 0,
    messagesSent: 0,
    messagesAcked: 0,
    startTime: 0,
    endTime: 0
  };

  const connectPromise = new Promise(async (resolve) => {
    let connectedCount = 0;
    
    for (let i = 0; i < usersCount; i++) {
      const user = users[i];
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      
      const gatewayUrl = GATEWAY_URL;
      
      const socket = io(gatewayUrl, {
        auth: { token },
        transports: ['websocket'],
        reconnection: false
      });

      socket.on('connect', () => {
        metrics.connected++;
        connectedCount++;
        if (connectedCount === usersCount) {
          resolve();
        }
      });

      socket.on('connect_error', (err) => {
        metrics.connectionErrors++;
        connectedCount++;
        if (connectedCount === usersCount) {
          resolve();
        }
      });

      socket.on('message_sent_ack', () => {
        metrics.messagesAcked++;
      });

      socket.userId = user.id;
      sockets.push(socket);
      
      // Throttle connection creation
      if (i % 20 === 0) {
        await new Promise(r => setTimeout(r, 10));
      }
    }
  });

  console.log("Connecting sockets...");
  await connectPromise;

  if (metrics.connected < usersCount) {
    console.log(`Warning: Only ${metrics.connected}/${usersCount} sockets connected. Errors: ${metrics.connectionErrors}`);
  }

  const activeSockets = sockets.filter(s => s.connected);
  if (activeSockets.length < 2) {
    console.error("Not enough active sockets to send messages.");
    process.exit(1);
  }

  const initialSaved = await prisma.chatMessage.count();
  console.log(`Initial DB count: ${initialSaved}`);
  console.log("Starting message flood...");
  metrics.startTime = performance.now();

  const sendPromises = activeSockets.map(socket => {
    return new Promise(async (resolve) => {
      let sentCount = 0;
      for (let j = 0; j < messagesPerUser; j++) {
        // Pick random receiver (not self)
        let receiverSocket;
        do {
          receiverSocket = activeSockets[Math.floor(Math.random() * activeSockets.length)];
        } while (receiverSocket.userId === socket.userId);

        socket.emit('send_message', {
          senderId: socket.userId,
          receiverId: receiverSocket.userId,
          message: `Load test message ${j} from ${socket.userId}`,
          clientTimestamp: Date.now()
        });

        sentCount++;
        metrics.messagesSent++;
        
        // Small delay to prevent immediate buffer overflow on client side if m is huge
        if (j % 50 === 0) {
          await new Promise(r => setTimeout(r, 1));
        }
      }
      resolve(sentCount);
    });
  });

  await Promise.all(sendPromises);
  metrics.endTime = performance.now();
  const durationMs = metrics.endTime - metrics.startTime;

  console.log("All messages dispatched from clients.");
  console.log("Waiting for backend to process queues and save to DB (up to 180 seconds)...");
  
  let currentSaved = 0;
  let elapsed = 0;
  while ((currentSaved < metrics.messagesSent || metrics.messagesAcked < metrics.messagesSent) && elapsed < 180) {
    await new Promise(r => setTimeout(r, 1000));
    elapsed += 1;
    try {
      const totalCount = await prisma.chatMessage.count();
      currentSaved = totalCount - initialSaved;
      process.stdout.write(`\r[Elapsed: ${elapsed}s] Sent: ${metrics.messagesSent} | ACKed by Gateway: ${metrics.messagesAcked} | Saved to DB: ${currentSaved}`);
    } catch (e) {
      // ignore
    }
  }
  console.log(""); // newline


  console.log("\n--- LOAD TEST REPORT ---");
  console.log(`Total Target Users (x): ${usersCount}`);
  console.log(`Messages Per User (m): ${messagesPerUser}`);
  console.log(`Total Target Messages: ${totalMessages}`);
  console.log(`Sockets Connected: ${metrics.connected}`);
  console.log(`Socket Connection Refused/Errors: ${metrics.connectionErrors}`);
  console.log(`Messages Dispatched: ${metrics.messagesSent}`);
  console.log(`Test Duration (Dispatching): ${(durationMs / 1000).toFixed(2)} seconds`);
  console.log(`Dispatch Rate: ${(metrics.messagesSent / (durationMs / 1000)).toFixed(2)} msgs/sec`);

  // Verify in Database
  try {
    const dbMessagesCount = currentSaved;
    console.log(`Messages actually saved in DB: ${dbMessagesCount}`);
    
    const gatewayDropRate = ((metrics.messagesSent - metrics.messagesAcked) / metrics.messagesSent * 100).toFixed(2);
    console.log(`Gateway Drop Rate (Client to Redis): ${gatewayDropRate > 0 ? gatewayDropRate : 0}%`);

    const dbDropRate = ((metrics.messagesAcked - dbMessagesCount) / metrics.messagesAcked * 100).toFixed(2);
    console.log(`DB Drop Rate (Redis to DB): ${dbDropRate > 0 ? dbDropRate : 0}%`);

    const dbMessages = await prisma.chatMessage.findMany({
      where: {
        message: { startsWith: 'Load test message' },
        createdAt: { gte: new Date(metrics.startTime) }
      },
      select: {
        clientTimestamp: true,
        createdAt: true
      },
      take: 10000 // Sample 10k messages to avoid OOM
    });

    if (dbMessagesCount > 0) {
      let totalLatency = 0;
      let minLatency = Infinity;
      let maxLatency = 0;
      const latencies = [];

      for (const msg of dbMessages) {
        if (msg.clientTimestamp) {
          const latency = new Date(msg.createdAt).getTime() - Number(msg.clientTimestamp);
          latencies.push(latency);
          totalLatency += latency;
          if (latency < minLatency) minLatency = latency;
          if (latency > maxLatency) maxLatency = latency;
        }
      }

      if (latencies.length > 0) {
        latencies.sort((a, b) => a - b);
        const avgLatency = (totalLatency / latencies.length).toFixed(2);
        const p95Latency = latencies[Math.floor(latencies.length * 0.95)];
        const p99Latency = latencies[Math.floor(latencies.length * 0.99)];

        console.log(`\n--- LATENCY METRICS (End-to-End Client to DB) ---`);
        console.log(`Average Latency: ${avgLatency} ms`);
        console.log(`Min Latency: ${minLatency} ms`);
        console.log(`Max Latency: ${maxLatency} ms`);
        console.log(`p95 Latency: ${p95Latency} ms`);
        console.log(`p99 Latency: ${p99Latency} ms`);
      } else {
        console.log(`Could not compute latency: clientTimestamp not found on messages.`);
      }
    }
  } catch (err) {
    console.log("Could not query DB for validation.", err.message);
  }

  // Cleanup sockets
  for (const s of sockets) {
    s.disconnect();
  }
  
  await prisma.$disconnect();
  console.log("--- TEST COMPLETE ---");
  process.exit(0);
}

runTest();
