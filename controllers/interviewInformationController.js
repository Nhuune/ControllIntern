const InterviewInformation = require("../models/interviewInformationModel");
const {filterData} = require("../utils/filterData");

//Getting all with query filtering
const getAllInterviewInfo = async (req, res) => {
    try {
        const filters = req.query;
        const data = await InterviewInformation.find(filters)
        const filtered = filterData(data, filters);
        return res.status(200).json(filtered);
    } catch (error) {
        return res.status(500).json({ msg: "Unable to get data", error: error });
    }
};

// Getting one record by ID
const getByIdInterviewInfo = (req, res) => {
    const interviewInfoId = req.params._id;
    if (!interviewInfoId) {
        return res.status(400).json({ msg: "Interview Information ID is required" });
    }

    InterviewInformation.findOne({ _id: interviewInfoId })
        .then((data) => {
            if (!data) {
                return res.status(404).json({ msg: "Interview Information not found" });
            }
            return res.status(200).json(data);
        })
        .catch((error) => {
            return res.status(500).json({ msg: "Unable to get data", error: error });
        });
};

//Creating one
const postOneInterviewInfo = async (req, res) => {
    const data = req.body;
    const newInterviewInformation = new InterviewInformation(data);
    newInterviewInformation.save((error) => {
        if (error) {
            return res.status(500).json({ msg: "Unable to save data", error: error });
        }
        return res.status(201).json({
            msg: " Your data has been saved!!!",
        });
    });
};

//Delete one
const deleteOneInterviewInfo = async (req, res) => {
    try {
        const removedInterviewInfo = await InterviewInformation.findByIdAndRemove({ _id: req.params._id });
        return res.status(200).json({ msg: "Delete successfully", removedInterviewInfo });
    } catch (error) {
        return res.status(500).json({ msg: "Unable to delete data", error: error });
    }
};

//Editing one
const editOneInterviewInfo = async (req, res) => {
    try {
        const updateInterviewInfo = await InterviewInformation.updateOne(
            { _id: req.params._id },
            {
                $set: {
                    organizer: req.body.organizer,
                    subject: req.body.subject,
                    location: req.body.location,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    date: req.body.date,
                    candidate: req.body.candidate,
                    skypeId: req.body.skypeId,
                    position: req.body.position,
                    interviewer: req.body.interviewer,
                    interviewerSkypeId: req.body.interviewerSkypeId,
                    fromSource: req.body.fromSource,
                    linkCv: req.body.linkCv,
                },
            }
        );
        return res.status(200).json({ msg: "Update successfully", updateInterviewInfo });
    } catch (error) {
        return res.status(500).json({ msg: "Unable to update data", error: error });
    }
};

module.exports = {
    deleteOneInterviewInfo,
    editOneInterviewInfo,
    getAllInterviewInfo,
    getByIdInterviewInfo,
    postOneInterviewInfo,
};