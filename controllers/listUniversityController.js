const listUniversity = require("../models/listUniversityModel");

// Getting all 
const getAllUniversity = (req, res) => {
    listUniversity.find({})
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch((error) => {
            return res.status(500).json({ msg: "Unable to get data", error: error })
        });
};

const getByIdUniversity = (req, res) => {
    listUniversity.findOne({ _id: req.params._id, })
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch((error) => {
            return res.status(500).json({ msg: "Unable to get data", error: error })
        });
};

//Creating one
const postOneUniversity = (req, res) => {
    const data = req.body;
    const newUniversity = new listUniversity(data);
    newUniversity.save((error) => {
        if (error) {
            return res.status(500).json({ msg: "Unable to save data", error: error });
        }
        return res.status(201).json({
            msg: " Your data has been saved!!!",
        });
    });
};

//Delete one
const deleteOneUniversity = async (req, res) => {
    try {
        const removedUniversity = await listUniversity.findByIdAndRemove({ _id: req.params._id });
        return res.status(200).json({
            msg: "Delete successfully",
            removedUniversity: removedUniversity
        })
    } catch (error) {
        return res.status(500).json({ msg: "Unable to delete data", error: error });
    }
};

// Editing one
const editOneUniversity = async (req, res) => {
    try {
        const data = req.body
        const updateUniversity = await listUniversity.updateOne(
            { _id: req.params._id },
            {
                $set: data
            }
        );
        return res.status(200).json(updateUniversity);
    } catch (error) {
        return res.status(500).json({ msg: "Unable to update data", error: error });
    }
};

const validateInputUniversity = async (req, res, next) => {
    const data = req.body;
    const dataUniversity = await listUniversity.findOne({ abbreviations: data.abbreviations })
    if (data?.abbreviations === dataUniversity.abbreviations) {
        return res.status(400).json({ msg:"Save failed. Data has already existed" });
    }
    next()
}

module.exports = {
    deleteOneUniversity,
    editOneUniversity,
    getAllUniversity,
    getByIdUniversity,
    postOneUniversity,
    validateInputUniversity
};