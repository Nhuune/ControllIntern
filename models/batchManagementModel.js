const mongoose = require("mongoose");

const batchManagementSchema = new mongoose.Schema({
    batch: { type: Number, required: true },
    endDate: { type: Date, required: true },
    skill: { type: Array, required: true },
    startDate: { type: Date, required: true },
    status: {
        type: String,
        enum: [
            'Closed',
            'On-Going',
            'Recruitment',
        ],
        default: 'Recruitment'
    },
    report: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "reportingBatchManagement"
        },
    ],
});

module.exports = batchManagement = mongoose.model("batchManagement", batchManagementSchema);