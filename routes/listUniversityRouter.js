const express = require("express");
const {
    deleteOneUniversity,
    editOneUniversity,
    getAllUniversity,
    getByIdUniversity,
    postOneUniversity,
    validateInputUniversity
} = require("../controllers/listUniversityController");
const { inRoles, Roles } = require("../middleware/authorizationRole");
const { checkInvalidData } = require("../middleware/validate/form_validator");
const router = express.Router()

router.get("/", getAllUniversity)
router.get("/:_id", getByIdUniversity)
router.post("/",
    inRoles(Roles.Training_Coordinator, Roles.SDC_MANAGER),
    checkInvalidData,
    validateInputUniversity,
    postOneUniversity
)
router.patch("/:_id",
    inRoles(Roles.Training_Coordinator, Roles.SDC_MANAGER),
    checkInvalidData,
    validateInputUniversity,
    editOneUniversity
)
router.delete("/:_id", inRoles(Roles.Training_Coordinator, Roles.SDC_MANAGER), deleteOneUniversity)

module.exports = router;