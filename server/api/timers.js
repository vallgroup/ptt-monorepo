const router = require("express").Router();
const { Timers } = require("../db/models/Timers");

router.post("/:userId", async (req, res) => {
  const { userId } = req.params;

  const timer = await Timers.insertOne({ user: userId });

  if (timer) {
    res.json({ user: userId, timer });
  } else {
    res.status(500);
  }
});

module.exports = router;
