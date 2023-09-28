const mongoose = require("mongoose");

const sentEmailScheduleSchema = new mongoose.Schema({
    time: { type: String, required: true },
    dayOfMonth: { type: String, },
    dayOfWeek: [{
        type: String,
        enum: ['1', '2', '3', '4', '5']
    }],
    weekInterval: { type: Number, },
    status: {
        type: Boolean,
    },
    updatedDate: { type: Date, default: Date.now }
});

module.exports = sentEmailSchedule = mongoose.model("sentEmailSchedule", sentEmailScheduleSchema);