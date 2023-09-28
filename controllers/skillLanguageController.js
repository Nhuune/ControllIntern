const SkillLanguage = require("../models/skillLanguageModel");

// Getting all 
const getAllSkillLanguage = (req, res) => {
    SkillLanguage.find({})
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch((error) => {
            return res.status(500).json({ msg: "Unable to get data", error: error })
        });
};

const getByIdSkillLanguage = (req, res) => {
    const skillLanguageId = req.params._id;
    if (!skillLanguageId) {
        return res.status(400).json({ msg: "Skill Language ID is required" });
    }

    SkillLanguage.findOne({ _id: skillLanguageId })
        .then((data) => {
            if (!data) {
                return res.status(404).json({ msg: "Skill Language not found" });
            }
            return res.status(200).json(data);
        })
        .catch((error) => {
            return res.status(500).json({ msg: "Unable to get data", error: error });
        });
};

//Creating one
const postOneSkillLanguage = (req, res) => {
    const data = req.body;
    const newSkillLanguage = new SkillLanguage(data);
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
const deleteOneSkillLanguage = async (req, res) => {
    const skillLanguageId = req.params._id;
    if (!skillLanguageId) {
        return res.status(400).json({ msg: "Skill Language ID is required" });
    }

    try {
        const removedSkillLanguage = await SkillLanguage.deleteOne({ _id: skillLanguageId });
        if (removedSkillLanguage.deletedCount === 0) {
            return res.status(404).json({ msg: "Skill Language not found" });
        }
        return res.status(200).json({
            msg: "Delete successfully",
            removedSkillLanguage: removedSkillLanguage
        });
    } catch (error) {
        return res.status(500).json({ msg: "Unable to delete data", error: error });
    }
};

// Editing one
const editOneSkillLanguage = async (req, res) => {
    try {
        const skillLanguageId = req.params._id;
        if (!skillLanguageId) {
            return res.status(400).json({ msg: "Skill Language ID is required" });
        }

        const { name } = req.body.skill;
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ msg: "Invalid Name field" });
        }
        const updateSkillLanguage = await SkillLanguage.updateOne(
            { _id: req.params._id },
            {
                $push: req.body
            }
        );
        return res.status(200).json(updateSkillLanguage);
    } catch (error) {
        return res.status(500).json({ msg: "Unable to update data", error: error });
    }
};

// Editing element in array
const editElementSkillLanguage = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ msg: `Invalid name field` });
        }

        const updateSkillLanguage = await SkillLanguage.findOneAndUpdate(
            { _id: req.body.id },
            { $set: { "skill.$[element].name": name } },
            { arrayFilters: [{ "element._id": req.params._id }], new: true }
        );

        if (!updateSkillLanguage) {
            return res.status(404).json({ msg: "Skill Language not found" });
        }

        return res.status(200).json({ msg: "Your data has been saved!!!" });
    } catch (error) {
        return res.status(500).json({ msg: "Unable to update data", error: error });
    }
};


module.exports = {
    deleteOneSkillLanguage,
    editOneSkillLanguage,
    editElementSkillLanguage,
    getAllSkillLanguage,
    getByIdSkillLanguage,
    postOneSkillLanguage,
};