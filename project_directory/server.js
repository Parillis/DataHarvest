const { express, http, socketIO, cors, fs, corsOptions } = require('./loadModules');

// Main app setup
const app = express();
console.log("\x1b[32m%s\x1b[0m", "express connected to app successfully");

const server = http.createServer(app);
console.log("\x1b[32m%s\x1b[0m", "app loaded successfully");

const io = socketIO(server);
console.log("\x1b[32m%s\x1b[0m", "io loaded successfully");

app.use(express.static("public"));
app.use(cors(corsOptions));

// Admin app setup
const adminApp = express();
console.log("\x1b[32m%s\x1b[0m", "express connected to adminApp successfully");

const adminServer = http.createServer(adminApp);
const adminIo = socketIO(adminServer);
console.log("\x1b[32m%s\x1b[0m", "admin io loaded successfully");

adminApp.use(express.static("admin_public"));
adminApp.use(cors(corsOptions));

// Start the main server on port 26001
const PORT = process.env.PORT || 26001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Start the admin server on port 26002
const ADMIN_PORT = process.env.ADMIN_PORT || 26002;
adminServer.listen(ADMIN_PORT, () => {
  console.log(`Admin server is running on port ${ADMIN_PORT}`);
});

let connected_users = [];
let connection = {};

// Socket.IO connection handling for the main app
io.on("connection", (socket) => {
  connection[socket.id] = {
    username: "",
    userId: "",
    key: "",
    status: "Connected",
    IsAdminSession: false,
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
    connection[socket.id].status = "disconnected";
  });
});

// Socket.IO connection handling for the admin app
adminIo.on("connection", (socket) => {
  connection[socket.id] = {
    username: "admin",
    userId: "admin",
    key: "",
    status: "Connected",
    IsAdminSession: true,
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
    `An admin connected with socket ID: ${
      socket.id
    } and their ip address is ${socket.handshake.address.replace(/^.*:/, "")}`
  );

  connected_users.push({ socketId: socket.id });
  console.log(formattedTime, "Connected users (including admin):", connected_users.length);

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
        `Admin with socket ID: ${socket.id} disconnected.`
      );
      console.log(formattedTime, "Connected users (including admins):", connected_users.length);
    }
    connection[socket.id].status = "disconnected";
  });
});
