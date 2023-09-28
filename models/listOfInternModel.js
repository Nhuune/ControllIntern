const mongoose = require("mongoose");

const listOfInternSchema = new mongoose.Schema({
    address: { type: String, required: true },
    batch: { type: String, required: true },
    certificateEnglish: { type: String },
    dateOfBirth: { type: String, required: true },
    group: { type: String, required: true },
    domain: { type: String, },
    email: { type: String, },
    emailDirectMentor: { type: String },
    emailProjectLeader: { type: String, required: true },
    endDate: { type: String, },
    fullName: { type: String, required: true },
    GPA: { type: String, },
    internshipProjectName: { type: String, },
    linkCV: { type: String },
    nameDirectMentor: { type: String, },
    nameProjectLeader: { type: String, required: true },
    phone: { type: String, },
    position: { type: String },
    pointEnglish: { type: Number },
    workLocation: { type: String, },
    typeOfInternship: { type: String, required: true },
    startDate: { type: String, },
    statusDevice: {
        type: String,
        enum: [
            'Borrowed',
            'Not Yet',
            'Returned'
        ],
        default: 'Not Yet'
    },
    statusIntern: {
        type: String,
        enum: [
            'Finished',
            'Have not joined yet',
            'Offered job',
            'Practicing',
            'Terminated',
            'Withdrew',
        ],
        default: 'Practicing'
    },
    statusFinish: {
        type: String,
        enum: [
            "Finished",
            "Joined Company"
        ]
    },
    team: { type: String, },
    trainingPlanId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "trainingPlan"
        }
    ],
});

module.exports = listOfIntern = mongoose.model("listOfIntern", listOfInternSchema);