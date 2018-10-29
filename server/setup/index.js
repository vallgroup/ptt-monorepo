const express = require("express");

async function setupServer() {
  await require("../db")();

  const next = await require("./next")();
  const app = express();

  require("./express")(app, next);

  return app;
}

module.exports = setupServer;
