// socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "https://calmora-chat-real-time.onrender.com";

let socket = io(SOCKET_URL, {
  autoConnect: false, // connect only after login
  transports: ["websocket"],
});

// ✅ Helper to register user room (like Flutter’s registerUserRoom)
export const registerUser = (userId) => {
  if (socket && socket.connected) {
    socket.emit("registerUser", userId);
    console.log("✅ Registered to personal room", userId);
  }
};

export default socket;
