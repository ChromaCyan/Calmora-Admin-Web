// socket.js
import { io } from "socket.io-client";

// Replace with your own api or use my own and add the local url here (For notification)
const SOCKET_URL = "";

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
