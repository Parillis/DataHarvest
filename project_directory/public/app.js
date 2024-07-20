// -------------------------App.js---------------------------------------
const socket = io("localhost:26001", { transports: ["websocket"] });
// Handling connection errors
socket.on("connect_error", (error) => {
  console.error("Error connecting to the server:", error.message);
});
// Connection event
socket.on("connect", () => {
  console.log("Connected to the server");
});
// Disconnection event
socket.on("disconnect", () => {
  console.error("Disconnected from the server");
  console.log("Disconnected from the server");
});