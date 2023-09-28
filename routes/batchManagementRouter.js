const express = require("express");
const { inRoles, Roles } = require("../middleware/authorizationRole");
const { batchManagementValidateMiddleWare } = require("../middleware/validate/batchManagementValidate");
const {
    deleteOneBatchManagement,
    editOneBatchManagement,
    getAllBatchManagement,
    getByIdBatchManagement,
    postOneBatchManagement
} = require("../controllers/batchManagementController");
const router = express.Router()

const batchManagementValidateInputFormat = (req, res, next) => {
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    const dateRegex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/;

    if (!dateRegex.test(startDate) || !dateRegex.test(endDate))
        return res.json({ error: "Input Format Date is not correct" });;
    if (req.body.batch <= 0) {
        return res.json({ error: "Input Batch is not correct" });;
    }
    next()
}

router.get("/", getAllBatchManagement)
router.get("/:_id", getByIdBatchManagement)
router.post("/",
    inRoles(Roles.SDC_MANAGER, Roles.Training_Coordinator),
    batchManagementValidateInputFormat,
    batchManagementValidateMiddleWare,
    postOneBatchManagement
)
router.patch("/:_id", inRoles(Roles.SDC_MANAGER, Roles.Training_Coordinator), editOneBatchManagement)
router.delete("/:_id", inRoles(Roles.SDC_MANAGER, Roles.Training_Coordinator), deleteOneBatchManagement)

module.exports = router;