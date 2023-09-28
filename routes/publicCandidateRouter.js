const express = require("express");
const { candidateValidateMiddleWare } = require("../middleware/validate/candidateValidate");
const { createCandidate } = require("../controllers/publicCandidateController");
const router = express.Router()

router.post("/public-candidates",
    candidateValidateMiddleWare,
    createCandidate
)

module.exports = router;