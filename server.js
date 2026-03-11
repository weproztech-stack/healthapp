require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { initSocket } = require("./src/sockets/socket");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Socket.io attach karo server se
initSocket(server);

connectDB();

server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Socket.io ready`);
});