const interviewSchedule = require("../models/interviewScheduleModel");

const getAllInterviewResult = async (req, res) => {
    try {
        const filters = req.query;
        const data = await interviewSchedule.find({ status: "passed", ...filters }).populate('candidateData');
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ msg: "Unable to get data", error: error });
    }
};

module.exports = { getAllInterviewResult };