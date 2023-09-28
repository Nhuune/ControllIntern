const express = require("express");
const {
    createUser,
    deleteOneUser,
    editOneUser,
    getAllUser,
    getListUserByRole,
    validateInputUser
} = require("../controllers/listUserController");
const { inRoles, Roles } = require("../middleware/authorizationRole");
const { checkInvalidData } = require("../middleware/validate/form_validator");
const router = express.Router()

router.get("/", inRoles(Roles.Training_Coordinator, Roles.SDC_MANAGER), getAllUser)
router.get("/:role", inRoles(Roles.Training_Coordinator, Roles.SDC_MANAGER), getListUserByRole)
router.post("/",
    inRoles(Roles.Training_Coordinator, Roles.SDC_MANAGER),
    checkInvalidData,
    validateInputUser,
    createUser
)
router.patch("/:_id",
    inRoles(Roles.Training_Coordinator, Roles.SDC_MANAGER),
    checkInvalidData, validateInputUser,
    editOneUser
)
router.delete("/:_id", inRoles(Roles.Training_Coordinator, Roles.SDC_MANAGER), deleteOneUser)

module.exports = router;