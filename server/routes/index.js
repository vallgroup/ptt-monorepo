const router = require("express").Router();
const url = require("url");
const { appConfig } = require("../config");

function setupRouter(handle, nextApp) {
  router.get("/health", (req, res) => res.sendStatus(200));

  router.get("/", (req, res) => {
    const page = "/";
    const query = { ...req.query, ...req.params };
    return nextApp.render(req, res, page, query);
  });

  router.get("*", (req, res) => handle(req, res));

  return router;
}

module.exports = setupRouter;
