const { regexEmail } = require("../middleware/validate/form_validator");
const listUser = require("../models/listUserModel");
const {filterData} = require("../utils/filterData");

// Getting all 
const getAllUser = async (req, res) => {
    try {
        const filters = req.query;
        const data = await listUser.find(filters);
        const filtered = filterData(data, filters);
        return res.status(200).send(filtered);
    } catch (error) {
        return res.status(500).json({ msg: "Unable to get data", error: error });
    }
};

const getListUserByRole = (req, res) => {
    listUser.find({ role: req.params.role })
        .then((data) => {
            const filters = req.query;
            const filtered = data.filter(user => {
                let isValid = true;
                for (key in filters) {
                    isValid = isValid && user[key] == filters[key];
                }
                return isValid;
            });
            return res.status(200).send(filtered);
        })
        .catch((error) => {
            res.status(500).json({ msg: "Unable to get data" })
        });
};

const createUser = async (req, res) => {
    const data = req.body;
    const check = await listUser.findOne({ email: data.email })
    if (check?.email === data.email) {
        return res.status(400).json({ msg: "Save failed. Data has already existed" });
    }
    const newRoleUser = new listUser(data);
    try {
        await newRoleUser.save();
        return res.status(201).json("Create successfully");
    } catch (error) {
        return res.status(500).json({ msg: "Unable to save data", error: error })
    }
}

//Delete one
const deleteOneUser = async (req, res) => {
    try {
        const removedUser = await listUser.findByIdAndRemove({ _id: req.params._id });
        return res.status(200).json({
            msg: "Delete successfully",
            removedUser: removedUser
        })
    } catch (error) {
        return res.status(500).json({ msg: "Unable to delete data", error: error });
    }
};

// Editing one
const editOneUser = async (req, res) => {
    try {
        const data = req.body;
        data.updatedDate = new Date()
        const updateUser = await listUser.updateOne(
            { _id: req.params._id },
            {
                $set: data
            }
        );
        return res.status(200).json(updateUser);
    } catch (error) {
        return res.status(500).json({ msg: "Unable to update data", error: error });
    }
};

const validateInputUser = async (req, res, next) => {
    const data = req.body;
    if (!regexEmail.test(data.email)) {
        return res.status(400).json({ msg: "Invalid email format. Please enter a valid email address." })
    }
    next()
}

module.exports = {
    createUser,
    deleteOneUser,
    editOneUser,
    getAllUser,
    getListUserByRole,
    validateInputUser
};