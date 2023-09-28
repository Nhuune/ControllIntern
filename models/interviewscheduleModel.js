const mongoose = require("mongoose");

const interviewScheduleSchema = new mongoose.Schema({
    batch: { type: Number, required: true },
    bookingTime: { type: String },
    candidateData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "candidate"
    },
    commentSchedule: { type: String },
    emailManager: { type: String, required: true },
    interviewManager: { type: String, required: true },
    interviewName: { type: String, required: true },
    group: { type: String, required: true },
    status: {
        type: String,
        enum: [
            'failed',
            'not show up',
            'passed',
            'tbu',
        ],
        default: 'tbu'
    },
    timeSlot: [{ type: String }],
});

module.exports = interviewSchedule = mongoose.model("interviewschedule", interviewScheduleSchema);