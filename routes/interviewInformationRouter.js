const express = require("express");
const { interviewInformationValidateMiddleWare } = require("../middleware/validate/interviewInformationValidate");
const {
    deleteOneInterviewInfo,
    editOneInterviewInfo,
    getAllInterviewInfo,
    getByIdInterviewInfo,
    postOneInterviewInfo,
} = require("../controllers/interviewInformationController");
const router = express.Router()

router.get("/", getAllInterviewInfo)
router.get("/:_id", getByIdInterviewInfo)
router.post("/", interviewInformationValidateMiddleWare, postOneInterviewInfo)
router.patch("/:_id", editOneInterviewInfo)
router.delete("/:_id", deleteOneInterviewInfo)

module.exports = router;