const router = require("express").Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  const r = require("rethinkdb");
  const connection = await require("../db/connection");

  res.json({ userId });
});

module.exports = router;
