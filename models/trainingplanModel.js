const mongoose = require("mongoose");

const trainingPlanSchema = new mongoose.Schema({
    listOfInternId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "listOfIntern"
        }
    ],
    schedules: [{
        actual: String,
        createdAt: { type: Date, default: Date.now },
        phaseName: { type: Number, required: true },
        plan: { type: String, required: true },
        remark: String,
        startDate: { type: String, required: true },
        status: {
            type: String,
            enum: [
                'Complete',
                'Not Start',
                'On-going',
                'On-hold',
            ],
            default: 'Not Start'
        },
        taskName: { type: String, required: true },
        targetDate: { type: String, required: true },
        updatedAt: { type: Date, default: null }
    }],
});

module.exports = trainingPlan = mongoose.model("trainingPlan", trainingPlanSchema);