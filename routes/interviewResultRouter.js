const express = require("express");
const { getAllInterviewResult } = require("../controllers/interviewResultController");
const router = express.Router()

router.get("/", getAllInterviewResult)

module.exports = router;