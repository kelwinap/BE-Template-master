const express = require("express");
const router = express.Router();
const { getProfile } = require("../middleware/getProfile");
const { getContract } = require("../controllers/contracts");

router.get("/:id", getProfile, getContract);

module.exports = router;
