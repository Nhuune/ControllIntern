const express = require("express");
const { inRoles, Roles } = require("../middleware/authorizationRole");
const {
    handleCreateSES,
    getSES,
    editSES,
} = require("../controllers/sentEmailScheduleController");

const router = express.Router();
router.get("/", getSES);
router.post("/",
    inRoles(Roles.Training_Coordinator, Roles.SDC_MANAGER),
    handleCreateSES
);
router.patch("/:_id",
    inRoles(Roles.Training_Coordinator, Roles.SDC_MANAGER),
    editSES
);
module.exports = router;
