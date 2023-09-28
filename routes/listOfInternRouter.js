const express = require("express");
const { inRoles, Roles } = require("../middleware/authorizationRole");
const {
  deleteOneListOfIntern,
  editOneListOfIntern,
  getAllListOfIntern,
  getByIdListOfIntern,
  postByIdListOfIntern,
  postOneListOfIntern,
  validateInputListOfIntern,
  changeStatusInternship,
  handelUpdateStatusFinish,
} = require("../controllers/listOfInternController");
const { checkInvalidData } = require("../middleware/validate/form_validator");
const router = express.Router();

router.get("/", getAllListOfIntern);
router.get("/:_id", getByIdListOfIntern);
router.post("/", postOneListOfIntern);
router.post("/:_id", inRoles(Roles.SDC_MANAGER), postByIdListOfIntern);
router.delete(
  "/:_id",
  inRoles(Roles.Training_Coordinator, Roles.SDC_MANAGER),
  deleteOneListOfIntern
);
router.patch(
  "/:_id",
  inRoles(
    Roles.Training_Coordinator,
    Roles.SDC_MANAGER,
    Roles.Project_MANAGER,
    Roles.Direct_Mentor
  ),
  checkInvalidData,
  validateInputListOfIntern,
  editOneListOfIntern
);

router.patch(
  "/changeStatus/:_id",
  inRoles(Roles.Training_Coordinator, Roles.SDC_MANAGER),
  checkInvalidData,
  changeStatusInternship
);

router.patch("/change-status-finish/:_id", handelUpdateStatusFinish)

module.exports = router;
