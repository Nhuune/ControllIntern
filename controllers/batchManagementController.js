const batchManagement = require("../models/batchManagementModel");
const candidateModel = require("../models/candidateModel");
const listOfInternModel = require("../models/listOfInternModel");
const moment = require("moment");
const { filterData } = require("../utils/filterData");

//Getting all with query filtering
const getAllBatchManagement = async (req, res) => {
    try {
        const filters = req.query;
        const data = await batchManagement.find(filters).sort({ batch: -1 }).populate('report');
        const filtered = filterData(data, filters);
        return res.status(200).json(filtered);
    } catch (error) {
        return res.status(500).json({ msg: "Unable to get data", error: error });
    }
};

// Getting one record by ID
const getByIdBatchManagement = (req, res) => {
    const batchManagementId = req.params._id;

    if (!batchManagementId) {
        return res.status(400).json({ msg: "Invalid batch management ID" });
    }

    batchManagement.findOne({
        _id: batchManagementId,
    })
        .then((data) => {
            if (!data) {
                return res.status(404).json({ msg: "Batch management not found" });
            }
            return res.status(200).json(data);
        })
        .catch((error) => {
            return res.status(500).json({ msg: "Unable to get data", error: error });
        });
};

//Creating one
const postOneBatchManagement = async (req, res) => {
    const data = req.body;
    if (data.skill && data.skill.length === 0) {
        return res.status(400).json({ msg: "Batch must have at least 1 skill" });
    }
    const checkBatch = await batchManagement.findOne({
        batch: data.batch
    });
    const checkStartDate = await batchManagement.findOne({
        startDate: data.startDate
    });
    const checkEndDate = await batchManagement.findOne({
        endDate: data.endDate
    });
    const endDate = new Date(data.endDate).getTime();
    const format = "YYYY-MM-DD";
    const nowDate = new Date(moment().format(format)).getTime();
    const startDate = new Date(data.startDate).getTime();
    if (startDate < nowDate) {
        return res.status(400).json({ msg: "Start Date is not greater than Now Date" });
    }
    if (startDate >= endDate) {
        return res.status(400).json({ msg: "End Date is not greater than Start Date" });
    }
    if ((endDate - startDate) / 86400000 >= (365)) {  // 1 years
        return res.status(400).json({ msg: "End Date is greater than 1 year with Start Date" });
    }
    if (checkBatch != null && checkBatch.batch == data.batch) {
        return res.status(400).json({ msg: "Sorry, Batch " + data.batch + " already exist" });
    }
    else if (checkStartDate != null && checkStartDate.startDate.toString() == new Date(data.startDate).toString()) {
        return res.status(400).json({ msg: "Sorry, Start day " + data.startDate + " already exist" });
    }
    else if (checkEndDate != null && checkEndDate.endDate.toString() == new Date(data.endDate).toString()) {
        return res.status(400).json({ msg: "Sorry, End day " + data.endDate + " already exist" });
    }
    else {
        const newBatchManagement = new batchManagement(data);
        newBatchManagement.save((error) => {
            if (error) {
                return res.status(500).json({ msg: "Unable to save data", error: error });
            }
            return res.status(201).json({ msg: "Your data has been saved!!!", newBatchManagement });
        });
    }
};

//Delete one
const deleteOneBatchManagement = async (req, res) => {
    try {
        const batchManagementId = req.params._id;

        const result = await batchManagement.deleteOne({ _id: batchManagementId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: "Batch management not found" });
        }

        return res.status(200).json({ msg: "Delete successfully" });
    } catch (error) {
        return res.status(500).json({ msg: "Unable to delete data", error: error });
    }
};

//Editing one
const editOneBatchManagement = async (req, res) => {
    const { status, batch } = req.body;
    const validStatus = ['Closed', 'On-Going', 'Recruitment'];

    if (!status || !validStatus.includes(status)) {
        return res.status(400).json({ msg: "Status is not valid" });
    }

    if (status === "Closed") {
        const listOfIntern = await listOfInternModel.find({
            batch,
            $or: [
                { "statusIntern": "Practicing" },
                { "statusIntern": "Have not joined yet" },
            ],
        });

        if (listOfIntern.length >= 1) {
            return res.status(400).json({ msg: "Unable to close the lot. Please check the trainee status in the Trigger List page" });
        }
    } else if (status === 'On-Going') {
        await candidateModel.updateMany(
            {
                batch,
                status: { $in: ['Finding project', 'Waiting for admission test', 'Waiting for result'] },
            },
            { $set: { status: 'Transferred' } }
        );
    }

    try {
        const updateBatchManagement = await batchManagement.updateOne(
            { _id: req.params._id },
            { $set: req.body }
        );

        return res.status(200).json({ msg: "Update successfully", updateBatchManagement });
    } catch (error) {
        return res.status(500).json({ msg: "Unable to update data", error: error });
    }
};

module.exports = {
    deleteOneBatchManagement,
    editOneBatchManagement,
    getAllBatchManagement,
    getByIdBatchManagement,
    postOneBatchManagement
};