const express = require("express");
const { inRoles, Roles } = require("../middleware/authorizationRole")
const {
    deleteOneCandidate,
    downLoadCV,
    editOneCandidate,
    editStatus,
    getAllCandidate,
    getByIdCandidate,
    postOneCandidate,
    validateInputCandidate
} = require("../controllers/candidateController");
const { checkInvalidData } = require("../middleware/validate/form_validator");
const router = express.Router()

router.get("/", getAllCandidate)
router.get("/:_id", getByIdCandidate)
router.get("/download/:fileName", downLoadCV)
router.post("/",
    inRoles(Roles.SDC_MANAGER, Roles.Training_Coordinator),
    postOneCandidate
)
router.patch("/:_id",
    inRoles(Roles.SDC_MANAGER, Roles.Training_Coordinator, Roles.Project_MANAGER),
    checkInvalidData,
    validateInputCandidate,
    editOneCandidate
)

router.patch("/editStatus/:_id",
    inRoles(Roles.SDC_MANAGER, Roles.Training_Coordinator, Roles.Project_MANAGER),
    editStatus
)

router.delete("/:_id",
    inRoles(Roles.SDC_MANAGER, Roles.Training_Coordinator),
    deleteOneCandidate)

module.exports = router;