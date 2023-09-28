const express = require("express");
const {
    deleteOneReporting,
    editOneReporting,
    getAllReporting,
    postOneReporting,
    postReportingByBatch
} = require("../controllers/reportingBatchManagementController");
const {
    reportingBatchManagementValidateMiddleWare,
    reportingBatchManagementPostNowValidateMiddleWare,
} = require("../middleware/validate/reportingBatchManagementValidate");
const router = express.Router()

router.get("/", getAllReporting)
router.post("/", reportingBatchManagementValidateMiddleWare, postOneReporting)
router.post("/now", reportingBatchManagementPostNowValidateMiddleWare, postReportingByBatch)
router.delete("/:_id", deleteOneReporting)
router.patch("/:_id", editOneReporting)

module.exports = router;