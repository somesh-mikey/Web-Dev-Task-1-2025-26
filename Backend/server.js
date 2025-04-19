// filepath: c:\Users\Somesh Das\Documents\Frontend Batch\Projects\Uber Video\Backend\server.js
const http = require("http");
const app = require("./app");
const port = parseInt(process.env.PORT, 10) || 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use.`);
  } else {
    console.error("Server error:", err);
  }
});
