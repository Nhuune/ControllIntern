const express = require("express");
const { inRoles, Roles } = require("../middleware/authorizationRole");
const {
    deleteOneTrainingPlan,
    deleteTrainingPlan,
    editOneTrainingPlan,
    editElementTrainingPlan,
    getAllTrainingPlan,
    getByIdTrainingPlan,
    postOneTrainingPlan,
    postByIdTrainingPlan,
} = require("../controllers/trainingPlanController");
const { checkInvalidData } = require("../middleware/validate/form_validator");
const router = express.Router()

router.get("/", getAllTrainingPlan)
router.get("/:_id", getByIdTrainingPlan)
router.post("/",
    inRoles(Roles.Project_MANAGER, Roles.Direct_Mentor),
    postOneTrainingPlan
)
router.post("/:trainingPlanID",
    inRoles(Roles.Project_MANAGER, Roles.Direct_Mentor),
    checkInvalidData,
    postByIdTrainingPlan
)
router.patch("/:_id",
    inRoles(Roles.Project_MANAGER, Roles.Direct_Mentor),
    checkInvalidData,
    editElementTrainingPlan
)
router.put("/:_id",
    inRoles(Roles.Project_MANAGER, Roles.Direct_Mentor),
    editOneTrainingPlan
)
router.delete("/:trainingPlanID/:projectPlanID",
    inRoles(Roles.Project_MANAGER, Roles.Direct_Mentor),
    deleteOneTrainingPlan
)
router.delete("/:_id",
    inRoles(Roles.Project_MANAGER, Roles.Direct_Mentor),
    deleteTrainingPlan
)

module.exports = router;