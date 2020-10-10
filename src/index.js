const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const startSever = require("./server");

startSever({ port: process.env.PORT });
