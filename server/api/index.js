const router = require("express").Router();

router.get("/health", (req, res) => res.sendStatus(200));
router.use("/timers", require("./timers"));

module.exports = router;
