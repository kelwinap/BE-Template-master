const express = require("express");
const router = express.Router();

const { getProfile } = require("../middleware/getProfile");
const { getBestProfession } = require("../controllers/admin");

router.get("/best-profession", getBestProfession);

module.exports = router;
