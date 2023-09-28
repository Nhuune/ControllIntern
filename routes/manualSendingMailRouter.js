const express = require("express");
const {
    getSendingMail,
    postSendRejecCompanyil,
    postSendingMail
} = require("../controllers/manualSendingMainController");
const router = express.Router()

router.get("/", getSendingMail)
router.post("/sendRejecCompanyil/:_id", postSendRejecCompanyil)
router.post("/send-mail", postSendingMail)

module.exports = router;