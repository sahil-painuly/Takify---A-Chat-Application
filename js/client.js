const socket = io("http://localhost:8000"); // Adjust protocol if server uses HTTPS

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

const sound = new Audio("../ting.mp3"); // Corrected path for sound file

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message", position);
  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll to the latest message
};

// Sending messages
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim(); // Trim to prevent empty spaces
  if (message) {
    append(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
    messageInput.focus(); // Keep focus on the input
  }
});

// Prompt user for name and handle errors
const name = prompt("Enter Your Name:");
if (!name) {
  alert("You must enter a name to join the chat.");
  throw new Error("Name is required to join the chat.");
}
socket.emit("new-user-joined", name);

socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "left");
  sound.play(); // Play sound on new user join
});

// Handle receiving messages
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
  sound.play(); // Play sound on receiving a message
});

// Show online users list with profile images
socket.on("active-users", (users) => {
  const onlineList = document.getElementById("online-users");
  onlineList.innerHTML = ""; // Clear the previous list
  users.forEach((user) => {
    const userElement = document.createElement("li");
    userElement.classList.add("online-user");

    // Create profile image element
    const img = document.createElement("img");
    img.src = "../Dp.jpg"; // Path to the default user profile image
    img.alt = "User DP";

    // Create user name element
    const userInfo = document.createElement("div");
    userInfo.classList.add("user-info");
    userInfo.textContent = user;

    // Append image and user name to the list item
    userElement.appendChild(img);
    userElement.appendChild(userInfo);

    // Append the user element to the online users list
    onlineList.appendChild(userElement);
  });
});

// Display when a user leaves the chat
socket.on("user-left", (name) => {
  append(`${name} left the chat`, "left");
  sound.play(); // Optionally, play sound when someone leaves
});