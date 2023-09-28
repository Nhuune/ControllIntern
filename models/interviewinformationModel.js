const mongoose = require("mongoose");

const interviewInformationSchema = new mongoose.Schema({
    batch: { type: Number,required: true},
    candidate: { type: String, required: true},
    date: { type: Date, required: true },
    endTime: { type: String, required: true },
    fromSource: { type: String, required: true},
    interviewer: { type: Array, required: true },
    interviewerSkypeId: { type: Array, required: true },
    location: { type: String, required: true },
    linkCV: { type: String},
    organizer: { type: Array, required: true},
    position: { type: Array, required: true },
    skypeId: { type: String, required: true},
    subject: { type: String, required: true},
    startTime: { type: String, required: true },
});

module.exports = Interviewinformation = mongoose.model("interviewinformation", interviewInformationSchema);