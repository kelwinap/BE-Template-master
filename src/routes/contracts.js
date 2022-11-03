const express = require("express");
const router = express.Router();
const { getProfile } = require("../middleware/getProfile");
const { getContract, getContracts } = require("../controllers/contracts");

router.get("/:id", getProfile, getContract);
router.get("/", getProfile, getContracts);

module.exports = router;
