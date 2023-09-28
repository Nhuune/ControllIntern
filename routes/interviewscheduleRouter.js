const express = require("express");
const { inRoles, Roles } = require("../middleware/authorizationRole");
const { interviewScheduleValidateMiddleWare } = require("../middleware/validate/interviewScheduleValidate");
const {
    confirmBookingTime,
    deleteOneInterviewSchedule,
    editOneInterviewSchedule,
    getAllInterviewSchedule,
    getByIdInterviewSchedule,
    postOneInterviewSchedule,
} = require("../controllers/interviewscheduleController");
const { checkInvalidData } = require("../middleware/validate/form_validator");
const router = express.Router()

router.get("/", getAllInterviewSchedule)
router.get("/:_id", getByIdInterviewSchedule)
router.post("/",
    inRoles(Roles.Project_MANAGER),
    checkInvalidData,
    interviewScheduleValidateMiddleWare,
    postOneInterviewSchedule
)
router.patch("/:_id", editOneInterviewSchedule)
router.patch("/confirm/:_id", inRoles(Roles.SDC_MANAGER, Roles.Training_Coordinator), confirmBookingTime)
router.delete("/:_id", deleteOneInterviewSchedule)

module.exports = router;