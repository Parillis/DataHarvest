function loadModule(moduleName) {
  try {
    const module = require(moduleName);
    console.log("\x1b[32m%s\x1b[0m", `${moduleName} loaded successfully`);
    return module;
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", `failed to load ${moduleName}`, error);
    return null;
  }
}

const express = loadModule("express");
const http = loadModule("http");
const socketIO = loadModule("socket.io");
const cors = loadModule("cors");
const fs = loadModule("fs");

const app = express ? express() : null;
if (app) {
  console.log("\x1b[32m%s\x1b[0m", "express connected to app successfully");
} else {
  console.error("\x1b[31m%s\x1b[0m", "failed to create express app");
}

const server = app && http ? http.createServer(app) : null;
if (server) {
  console.log("\x1b[32m%s\x1b[0m", "app loaded successfully");
} else {
  console.error("\x1b[31m%s\x1b[0m", "failed to create server");
}

const io = server && socketIO ? socketIO(server) : null;
if (io) {
  console.log("\x1b[32m%s\x1b[0m", "io loaded successfully");
} else {
  console.error("\x1b[31m%s\x1b[0m", "failed to create io");
}

const corsOptions = { origin: "" };
console.log("\x1b[32m%s\x1b[0m", "corsOptions origin set successfully");

import("node-fetch")
  .then(({ default: fetch }) => {})
  .catch((error) => {
    console.error("Failed to import node-fetch:", error);
  });

if (app && cors) {
  app.use(express.static("public"));
  app.use(cors(corsOptions));
}

module.exports = { app, server, io, express, cors, fs };
