const mongoose = require("mongoose");

const reportingBatchManagementSchema = new mongoose.Schema({
    acceptedForInternship: { type: Number, default: 0 },
    batch: { type: Number, required: true },
    canceledApplication: { type: Number, default: 0 },
    deniedOffer: { type: Number, default: 0 },
    duringInternship: { type: Number, default: 0 },
    failedInterview: { type: Number, default: 0 },
    findingProject: { type: Number, default: 0 },
    finished: { type: Number, default: 0 },
    haveNotJoinedYet: { type: Number, default: 0 },
    offerJobs: { type: Number, default: 0 },
    practicing: { type: Number, default: 0 },
    recruitment: { type: Number, default: 0 },
    rejectedByIndustryInternship: { type: Number, default: 0 },
    reporting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "batchManagement"
    },
    transferred: { type: Number, default: 0 },
    terminated: { type: Number, default: 0 },
    waitingForResult: { type: Number, default: 0 },
    waitingForSubmission: { type: Number, default: 0 },
    week: { type: Number, default: 0, required: true },
    withdrew: { type: Number, default: 0 },
});

module.exports = reportingBatchManagement = mongoose.model("reportingBatchManagement", reportingBatchManagementSchema);