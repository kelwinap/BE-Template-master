const express = require("express");
const router = express.Router();

const { getProfile } = require("../middleware/getProfile");
const { getUnpaidJobs } = require("../controllers/jobs");

router.get("/unpaid", getProfile, getUnpaidJobs);

module.exports = router;
