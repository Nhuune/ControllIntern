const mongoose = require("mongoose");

const internResourceNeedSchema = new mongoose.Schema({
    batch: { type: String, required:true },
    group: { type: String, required: true },
    directMentor: { type: String },
    email: { type: String, required: true },
    internResourceNeed: { type: Number, required: true },
    internshipProjectName: { type: String },
    jobTitle: { type: String },
    location: { type: String, required: true },
    projectDescription: { type: String },
    projectLeader: { type: String, required: true },
    remark: { type: String },
    requester: { type: String, required: true },
    skills: { type: String, required: true },
    team: { type: String },
    whatSkills: { type: String },
});

module.exports = internResourceNeed = mongoose.model("internresourceneed", internResourceNeedSchema);