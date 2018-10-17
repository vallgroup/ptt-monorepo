const path = require("path");

const appConfig = {
  env: process.env.NODE_ENV || "dev",
  isDev: process.env.NODE_ENV === "dev",
  domain: process.env.HOST_DOMAIN || "http://localhost:3100",
  port: process.env.PORT || 3100,
  clientDir: path.join(__dirname, "..", "..", "client"),
  publicDir: path.join(__dirname, "..", "public")
};

module.exports = appConfig;
