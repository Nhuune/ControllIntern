const express = require("express");
const { inRoles, Roles } = require("../middleware/authorizationRole");
const {
    deleteOneSkillLanguage,
    editOneSkillLanguage,
    editElementSkillLanguage,
    getAllSkillLanguage,
    getByIdSkillLanguage,
    postOneSkillLanguage,
} = require("../controllers/skillLanguageController");
const router = express.Router()

router.get("/", getAllSkillLanguage)
router.get("/:_id", getByIdSkillLanguage)
router.post("/", postOneSkillLanguage)
router.patch("/:_id", inRoles(Roles.SDC_MANAGER, Roles.Training_Coordinator), editOneSkillLanguage)
router.put("/:_id", inRoles(Roles.SDC_MANAGER, Roles.Training_Coordinator), editElementSkillLanguage)
router.delete("/:_id", inRoles(Roles.SDC_MANAGER, Roles.Training_Coordinator), deleteOneSkillLanguage)

module.exports = router