const router = require("express").Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  res.json({ userId });
});

module.exports = router;
