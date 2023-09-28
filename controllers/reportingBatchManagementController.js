const reportingBatchManagement = require("../models/reportingBatchManagementModel");
const batchManagement = require("../models/batchManagementModel");
const Candidate = require("../models/candidateModel");
const listOfInternModel = require("../models/listOfInternModel");
const _ = require("lodash");
// Reporting
//Creating one
const getAllReporting = async (req, res) => {
    try {
        const weekReporting = await reportingBatchManagement.find().populate('reporting')
        return res.status(200).json(weekReporting);
    } catch (error) {
        return res.status(500).json({ msg: "Unable to get data", error: error })
    }
};

const postReportingByBatch = async (req, res) => {
    const recruitment = [
        'Canceled application',
        'Denied offer',
        'Failed 1st interview',
        'Failed application',
        'Failed interview',
        'Finding project',
        'Passed',
        'Rejected',
        'Transferred',
        'Waiting for admission test',
        'Waiting for result'];
    const duringInternship = [
        'Finished',
        'Have not joined yet',
        'Offered job',
        'Practicing',
        'Terminated',
        'Withdrew'
    ];
    const batch = req.body.batch || req.batch;
    try {
        const candidateData = await Candidate.find({ batch });
        const listOfInternData = await listOfInternModel.find({ batch });
        const dataInternship = {};
        _.forEach(duringInternship, function (filterInternship) {
            dataInternship[filterInternship] = _.filter(listOfInternData, function (listOfInternData) {
                return listOfInternData.statusIntern == filterInternship;
            }).length;
        })
        const dataCandidate = {};
        _.forEach(recruitment, function (filterCandidate) {
            dataCandidate[filterCandidate] = _.filter(candidateData, function (candidateData) {
                return candidateData.status == filterCandidate;
            }).length;
        })
        let candidateTotal = 0;
        let internshipTotal = 0;
        for (const key in dataInternship) {
            internshipTotal += (typeof (dataInternship[key])) == "number" ? dataInternship[key] : Number(dataInternship[key]);
        }
        for (const key in dataCandidate) {
            candidateTotal += (typeof (dataCandidate[key])) == "number" ? dataCandidate[key] : Number(dataCandidate[key]);
        }
        const sentDataInternship = {
            "Recruitment": candidateTotal,
            ...dataCandidate,
            "DuringInternship": internshipTotal,
            ...dataInternship
        }
        return res.status(200).json(sentDataInternship);
    } catch (error) {
        return res.status(500).json({ error: error })
    }
};

const postOneReporting = async (req, res) => {
    try {
        const data = req.body;
        const newBatchManagement = new reportingBatchManagement(data);
        const newBM = await newBatchManagement.save();
        if (req.body.reporting) {
            const checkReporting = batchManagement.findById(req.body.reporting)
            await checkReporting.updateOne({ $push: { report: newBM._id } })
        }
        return res.status(201).json(newBM)
    }
    catch (error) {
        return res.status(500).json({ msg: "Unable to save data", error: error })
    }
};

//Delete one
const deleteOneReporting = async (req, res) => {
    try {
        const removedReporting = await reportingBatchManagement.findByIdAndRemove({ _id: req.params._id });
        return res.status(200).json({
            msg: "Delete successfully",
            removedReporting: removedReporting
        });
    } catch (error) {
        return res.status(500).json({ msg: "Unable to delete data", error: error });
    }
};

//Editing one
const editOneReporting = async (req, res) => {
    try {
        const updateReporting = await reportingBatchManagement.updateOne(
            { _id: req.params._id },
            {
                $set: req.body,
            }
        );
        return res.status(200).json({ msg: "Update successfully", updateReporting });
    } catch (error) {
        return res.status(500).json({ msg: "Unable to update data", error: error });
    }
};

module.exports = {
    deleteOneReporting,
    editOneReporting,
    getAllReporting,
    postOneReporting,
    postReportingByBatch
};