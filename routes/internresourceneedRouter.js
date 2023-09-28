const express = require("express");
const { inRoles, Roles } = require("../middleware/authorizationRole");
const { internResourceNeedValidateMiddleWare } = require("../middleware/validate/internResourceNeedValidate");
const {
    deleteOneInternResourceNeed,
    editOneInternResourceNeed,
    getAllInternResourceNeed,
    getByIdInternResourceNeed,
    getBatchKey,
    postOneInternResourceNeed,
    validateInputInternResourceNeed
} = require("../controllers/internresourceneedController");
const { checkInvalidData } = require("../middleware/validate/form_validator");
const router = express.Router()

router.get("/", getAllInternResourceNeed)
router.get("/:_id", getByIdInternResourceNeed)
router.get("/batch/:key", getBatchKey)
router.post("/",
    inRoles(Roles.Project_MANAGER),
    internResourceNeedValidateMiddleWare,
    checkInvalidData,
    validateInputInternResourceNeed,
    postOneInternResourceNeed
)
router.patch("/:_id",
    checkInvalidData,
    validateInputInternResourceNeed,
    editOneInternResourceNeed
)
router.delete("/:_id", deleteOneInternResourceNeed)

module.exports = router;