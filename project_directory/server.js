const { app, server, io } = require("./loadModules");

const PORT = process.env.PORT || 26001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on("connection", (socket) => {
  connection[socket.id] = {
    username: "",
    userId: "",
    key: "",
  };

  const originalTime = socket.handshake.time;
  const originalDate = new Date(originalTime);

  const formattedTime = originalDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  console.log(
    formattedTime,
    `A user connected with socket ID: ${
      socket.id
    } and their ip address is ${socket.handshake.address.replace(/^.*:/, "")}`
  );

  connected_users.push({ socketId: socket.id });
  console.log(formattedTime, "Connected users:", connected_users.length);

  // Disconnect event
  socket.on("disconnect", () => {
    const disconnectedUser = connected_users.find(
      (user) => user.socketId === socket.id
    );
    if (disconnectedUser) {
      connected_users = connected_users.filter(
        (user) => user.socketId !== socket.id
      );
      console.log(
        formattedTime,
        `User with socket ID: ${socket.id} disconnected.`
      );
      console.log(formattedTime, "Connected users:", connected_users.length);
    }
    connection[socket.id].key = "disconnected";
  });
});
