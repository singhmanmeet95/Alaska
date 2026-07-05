const { io } = require("socket.io-client");
const socket = io("http://localhost:4001");

socket.on("connect", () => {
  console.log("Connected to Gateway!");
  
  // Join room as sender 123
  socket.emit("join_user", 123);
  
  // Send a message to receiver 456
  setTimeout(() => {
    socket.emit("send_message", {
      senderId: 123,
      receiverId: 456,
      message: "Hello from test client!"
    });
  }, 500);

  // Listen for the confirmation message
  socket.on("message_sent", (data) => {
    console.log("Received 'message_sent' event:", data);
    process.exit(0);
  });

  socket.on("receive_message", (data) => {
    console.log("Received 'receive_message' event:", data);
  });
  
  socket.on("error", (err) => {
    console.error("Received error:", err);
    process.exit(1);
  });
  
  setTimeout(() => {
    console.error("Timeout waiting for message response");
    process.exit(1);
  }, 5000);
});
