const { regexEmail } = require("../middleware/validate/form_validator");
const batchManagementModel = require("../models/batchManagementModel");
const internResourceNeed = require("../models/internResourceNeedModel");
const {filterData} = require("../utils/filterData");

//Getting all with query filtering
const getAllInternResourceNeed = async (req, res) => {
  try {
    const filters = req.query;
    const data = await internResourceNeed.find(filters)
    const filtered = filterData(data, filters);
    return res.status(200).json(filtered);
  } catch (error) {
    return res.status(500).json({ msg: "Unable to get data", error: error });
  }
};

//Filter by batch key
const getBatchKey = async (req, res) => {
  try {
    let data = await internResourceNeed.find(
      {
        "$or": [
          { batch: { $in: req.params.key } }
        ]
      }
    )
    return res.send(data);
  } catch (error) {
    return res.status(500).json({ msg: "Unable to get data", error: error })
  }
};

// Getting one record by ID
const getByIdInternResourceNeed = (req, res) => {
  if (!req.params._id) {
    return res.status(400).json({ msg: "Invalid resource ID" });
  }
  internResourceNeed.findOne({
    _id: req.params._id,
  })
    .then((data) => {
      if (!data) {
        return res.status(404).json({ msg: "Resource not found" });
      }
      return res.status(200).json(data);
    })
    .catch((error) => {
      return res.status(500).json({ msg: "Unable to get data", error: error })
    });
};

//Creating one
const postOneInternResourceNeed = async (req, res) => {
  const dataBatch = await batchManagementModel.findOne({}).sort([["batch", -1]]);
  if (!dataBatch || dataBatch.status !== "Recruitment") {
    const message = "The request to create new human resources has been canceled due to the absence of a valid batch value."
    return res.status(400).json({ msg: message });
  }
  const data = req.body;
  const checkDuplicateData = await internResourceNeed.findOne({
    requester: data.requester,
    batch: data.batch,
    skills: data.skills,
    whatSkills: data.whatSkills
  });
  if (checkDuplicateData != null) {
    return res.status(400).json({ msg: "Save failed. Data has already existed" });
  }
  try {
    const newInternResourceNeed = new internResourceNeed(data);
    await newInternResourceNeed.save();
    return res.status(201).json({ msg: " Your data has been saved!!!", });
  } catch (error) {
    return res.status(500).json({ msg: "Unable to save data", error: error });
  }

};

//Delete one
const deleteOneInternResourceNeed = async (req, res) => {
  try {
    const resourceId = req.params._id;

    const result = await internResourceNeed.deleteOne({ _id: resourceId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Resource not found" });
    }

    return res.status(200).json('Delete successfully');
  } catch (error) {
    return res.status(500).json({ msg: "Unable to delete data", error: error });
  }
};

//Editing one
const editOneInternResourceNeed = async (req, res) => {
  try {
    const resourceId = req.params._id;
    const data = req.body;

    const result = await internResourceNeed.updateOne(
      { _id: resourceId },
      { $set: data }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ msg: "Resource not found" });
    }

    return res.status(200).json('Update successfully');
  } catch (error) {
    return res.status(500).json({ msg: "Unable to update data", error: error });
  }
};

const validateInputInternResourceNeed = async (req, res, next) => {
  const data = req.body;
  if (data.internResourceNeed <= 0) {
    return res.status(400).json({ msg: "The resource count must be greater than 0" });
  }
  if (!regexEmail.test(data.email)) {
    return res.status(400).json({ msg: "Invalid email format. Please enter a valid email address." });
  }
  next()
}

module.exports = {
  deleteOneInternResourceNeed,
  editOneInternResourceNeed,
  getAllInternResourceNeed,
  getBatchKey,
  getByIdInternResourceNeed,
  postOneInternResourceNeed,
  validateInputInternResourceNeed
};