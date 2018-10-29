const bodyParser = require("body-parser");
const helmet = require("helmet");
const express = require("express");
const { appConfig } = require("../config");
const setupRoutes = require("../routes");

function setupExpress(app, next) {
  const { publicDir } = appConfig;
  const { handler, nextApp } = next;

  // setting up express app level middleware
  app.use(helmet());
  app.use(express.static(publicDir));
  app.use(bodyParser.json());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // here we can keep the api routes (handled by express)
  // seperate from the app routes we want to be SSRed (handled by next.js)
  //
  // any routes not starting with '/api'
  // will be handled by next.js's request handler
  app.use("/api", require("../api"));
  app.use("/", setupRoutes(handler, nextApp));
}

module.exports = setupExpress;
