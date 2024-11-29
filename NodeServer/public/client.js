// Connect to Socket.IO
const socket = io(); // Will automatically connect to the server at the same host

// Selecting DOM elements
const messageInp = document.getElementById("messageInp");
const sendBtn = document.querySelector(".btn");
const messagesContainer = document.getElementById("messages");
const onlineUsersList = document.getElementById("online-users");

// When a new user joins
const username = prompt("Enter your name:");
socket.emit("new-user-joined", username);

// Sending message
sendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const message = messageInp.value.trim();
  if (message !== "") {
    socket.emit("send", message); // Send the message to the server
    messageInp.value = ""; // Clear input
    addMessage("You", message); // Add to the chat UI
  }
});

// Receiving messages from others
socket.on("receive", (data) => {
  addMessage(data.name, data.message);
});

// User joins
socket.on("user-joined", (name) => {
  addMessage("System", `${name} joined the chat.`);
});

// User leaves
socket.on("user-left", (name) => {
  addMessage("System", `${name} left the chat.`);
});

// Update online users list
socket.on("active-users", (users) => {
  onlineUsersList.innerHTML = ""; // Clear the list first
  users.forEach((user) => {
    const userItem = document.createElement("li");
    userItem.textContent = user;
    onlineUsersList.appendChild(userItem);
  });
});

// Function to display messages
function addMessage(sender, message) {
  const messageElem = document.createElement("div");
  messageElem.classList.add("message");
  messageElem.innerHTML = `<strong>${sender}:</strong> ${message}`;
  messagesContainer.appendChild(messageElem);
  messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
}

// JavaScript to toggle the visibility of the online users section
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-users-btn");
  const onlineSection = document.getElementById("online-section");

  toggleBtn.addEventListener("click", () => {
    if (onlineSection.style.display === "none" || onlineSection.style.display === "") {
      onlineSection.style.display = "block";
      toggleBtn.textContent = "Hide Online Users";
    } else {
      onlineSection.style.display = "none";
      toggleBtn.textContent = "Show Online Users";
    }
  });
});
