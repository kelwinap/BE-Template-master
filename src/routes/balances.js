const express = require("express");
const { deposit } = require("../controllers/balances");
const router = express.Router();

router.post("/deposit/:userId", deposit);

module.exports = router;
