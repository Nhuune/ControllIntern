const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    address: { type: String, required: true },
    applicantSignature: { type: String, required: true },
    approveStatus: {
        type: String,
        enum: [
            'Approved',
            'Not Approve'
        ],
        default: 'Not Approve'
    },
    batch: { type: String, required: true },
    booking: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "interviewschedule"
        }
    ],
    certificateEnglish: { type: String },
    dateEnglish: { type: Date },
    dateOfBirth: { type: String, required: true },
    email: { type: String, required: true },
    everJoinedCompany: { type: String },
    faculty: { type: String, required: true },
    firstPriority: { type: String, required: true },
    fullName: { type: String, required: true },
    GPA: { type: String, required: true },
    graduationYear: { type: String, required: true },
    IQ: { type: Number },
    linkCV: { type: String },
    numberOfInterviews: {
        type: Number,
        default: 0
    },
    numberShotCovid: { type: String, required: true },
    otherSkills: { type: String },
    phone: { type: String, required: true },
    pointEnglish: { type: Number },
    programming: { type: String },
    remark: { type: String },
    secondPriority: { type: String },
    signatureDate: { type: String, required: true },
    source: String,
    startDate: { type: String, required: true },
    status: {
        type: String,
        enum: [
            'Canceled application',
            'Denied offer',
            'Failed 1st interview',
            'Failed admission test',
            'Failed interview',
            'Finding project',
            'Transferred',
            'Waiting for admission test',
            'Waiting for result',
            'Passed',
            'Rejected'
        ],
        default: 'Finding project'
    },
    studentId: { type: String, required: true },
    testing: { type: String },
    typeOfInternship: { type: String, required: true },
    university: { type: String, required: true },
    universityCompulsoryRequirement: { type: String, required: true },
    workLocation: { type: String, required: true },
    year: { type: String, required: true },
});

module.exports = Candidate = mongoose.model("candidate", candidateSchema);