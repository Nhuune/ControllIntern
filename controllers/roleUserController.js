const roleUser = require("../models/roleOfUserModel");

// Getting all 
const getAllRoleUser = (req, res) => {
    roleUser.find({})
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch((error) => {
            return res.status(500).json({ msg: "Unable to get data", error: error })
        });
};

const getByIdRoleUser = (req, res) => {
    roleUser.findOne({ _id: req.params._id, })
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch((error) => {
            return res.status(500).json({ msg: "Unable to get data", error: error })
        });
};

//Creating one
const postOneRoleUser = (req, res) => {
    const data = req.body;
    const newSkillLanguage = new roleUser(data);
    newSkillLanguage.save((error) => {
        if (error) {
            return res.status(500).json({ msg: "Unable to save data", error: error });
        }
        return res.status(201).json({
            msg: " Your data has been saved!!!",
        });
    });
};

//Delete one
const deleteOneRoleUser = async (req, res) => {
    try {
        const removedRoleUser = await roleUser.findByIdAndRemove({ _id: req.params._id });
        return res.status(200).json({
            msg: "Delete successfully",
            removedRoleUser: removedRoleUser
        });
    } catch (error) {
        return res.status(500).json({ msg: "Unable to delete data", error: error });
    }
};

// Editing one
const editOneRoleUser = async (req, res) => {
    try {
        const updateRoleUser = await roleUser.updateOne(
            { _id: req.params._id },
            {
                $set: req.body
            }
        );
        return res.status(200).json(updateRoleUser);
    } catch (error) {
        return res.status(500).json({ msg: "Unable to update data", error: error });
    }
};

module.exports = {
    deleteOneRoleUser,
    editOneRoleUser,
    getAllRoleUser,
    getByIdRoleUser,
    postOneRoleUser,
};