const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // Import Server from socket.io for better clarity

// Set up Express and HTTP server
const app = express();
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your production frontend URL for better security
    methods: ["GET", "POST"]
  }
});

// Serve static files (e.g., index.html, CSS, JS)
app.use(express.static(__dirname + '/public')); // Ensure your frontend files are in a 'public' directory

// Store active users
const users = {};

// Function to emit the list of active users
const updateUsers = () => {
  io.emit('active-users', Object.values(users));
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // New user joins
  socket.on('new-user-joined', (name) => {
    users[socket.id] = name;
    console.log(`${name} joined the chat`);
    socket.broadcast.emit('user-joined', name); // Notify others
    updateUsers(); // Update active users list
  });

  // User sends a message
  socket.on('send', (message) => {
    socket.broadcast.emit('receive', {
      message: message,
      name: users[socket.id],
    });
  });

  // User disconnects
  socket.on('disconnect', () => {
    const name = users[socket.id];
    if (name) {
      console.log(`${name} left the chat`);
      delete users[socket.id]; // Remove from active users
      socket.broadcast.emit('user-left', name); // Notify others
      updateUsers(); // Update active users list
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
