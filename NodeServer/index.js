const { Socket } = require('socket.io');

// Dynamically set the port
const PORT = process.env.PORT || 8000; 

const io = require('socket.io')(PORT, {
  cors: {
    origin: "*", // Change this to your production frontend URL for security
  },
});

const users = {}; // Keep track of active users by their socket ID

// Function to emit the list of active users
const updateUsers = () => {
  io.emit('active-users', Object.values(users));
};

io.on('connection', (socket) => {
  // When a new user joins
  socket.on('new-user-joined', (name) => {
    users[socket.id] = name;
    console.log(`${name} joined the chat`);
    socket.broadcast.emit('user-joined', name);
    
    // Update active users list for all clients
    updateUsers();
  });

  // When a user sends a message
  socket.on('send', (message) => {
    socket.broadcast.emit('receive', {
      message: message,
      name: users[socket.id],
    });
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    const name = users[socket.id];
    if (name) {
      console.log(`${name} left the chat`);
      delete users[socket.id]; // Remove the user from the users list
      socket.broadcast.emit('user-left', name);
      
      // Update active users list for all clients
      updateUsers();
    }
  });
});

console.log(`Server running on port ${PORT}`);
