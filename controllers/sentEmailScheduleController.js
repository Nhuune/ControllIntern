const sentEmailSchedule = require("../models/sentEmailScheduleModel");

//Getting all with query filtering
const getSES = (req, res) => {
    sentEmailSchedule.find({})
        .then((data) => {
            return res.status(200).send(data);
        })
        .catch((error) => {
            return res.status(500).json({ msg: "Unable to get data", error: error })
        });
};

//Editing one SentEmailSchedule
const handleCreateSES = async (req, res) => {
    const data = req.body
    if (data.time.trim() == '') {
        return res.status(400).json({ msg: "Invalid data" });
    }
    const newDataSES = new sentEmailSchedule(data)
    try {
        await newDataSES.save()
        return res.status(200).json({ msg: "Create successfully", newDataSES });
    } catch (error) {
        return res.status(500).json({ msg: "Unable to create data", error: error });
    }
};

const editSES = async (req, res) => {
    try {
        const data = req.body
        if (data.time && data.time.trim() == '') {
            return res.status(400).json({ msg: "Invalid data" });
        }
        const updateSES = await sentEmailSchedule.updateOne(
            { _id: req.params._id },
            {
                $set: data
            }
        );
        return res.status(200).json({ msg: "Update successfully", updateSES });
    } catch (error) {
        return res.status(500).json({ msg: "Unable to update data", error: error });
    }
};

module.exports = {
    editSES,
    handleCreateSES,
    getSES,
};