const listOfInternModel = require("../models/listOfInternModel");
const trainingPlan = require("../models/trainingPlanModel");
const { filterData } = require("../utils/filterData");

//Getting all with query filtering
const getAllTrainingPlan = async (req, res) => {
  try {
    const filters = req.query;
    const data = await trainingPlan.find(filters).populate("listOfInternId")
    const filtered = filterData(data, filters);
    return res.status(200).send(filtered);
  } catch (error) {
    return res.status(500).json({ msg: "Unable to get data", error: error });
  }
};

// Getting one record by ID
const getByIdTrainingPlan = (req, res) => {
  trainingPlan.findOne({
    _id: req.params._id,
  })
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      return res.status(500).json({ msg: "Unable to get data", error: error })
    });
};

//Creating one
const postOneTrainingPlan = async (req, res) => {
  try {
    const data = req.body;
    if (data.schedules.phaseName <= 0) {
      return res.status(400).json({ msg: "Invalid phase name" })
    }
    const newTrainingPlan = new trainingPlan(data);
    const saveJoin = await newTrainingPlan.save();
    if (req.body.listOfInternId) {
      const trainingPlan = listOfInternModel.findById(req.body.listOfInternId);
      await trainingPlan.updateOne({ $push: { trainingPlanId: saveJoin._id } });
    }
    return res.status(201).json(saveJoin["_id"]);
  } catch (error) {
    return res.status(500).json({ msg: "Unable to save data", error: error });
  }
};

//Add new schedule
const postByIdTrainingPlan = async (req, res) => {
  try {
    const addSchedule = await trainingPlan.findByIdAndUpdate(
      {
        _id: req.params.trainingPlanID,
      },
      {
        $push: {
          schedules: req.body,
        },
      },
      { useFindAndModify: false }
    );
    return res.status(200).json(addSchedule);
  } catch (error) {
    return res.status(500).json({ msg: "Unable to save data", error: error });
  }
};

//Delete one
const deleteOneTrainingPlan = async (req, res) => {
  const { trainingPlanID, projectPlanID } = req.params;
  const plan = await trainingPlan.findById({
    _id: trainingPlanID,
  });
  try {
    if (plan && plan.schedules.length > 1) {
      const removedTrainingPlan = await trainingPlan.findByIdAndUpdate(
        {
          _id: trainingPlanID,
        },
        {
          $pull: {
            schedules: {
              _id: projectPlanID,
            },
          },
        },
        { useFindAndModify: false }
      );
      return res.status(200).json({ msg: "Delete successfully", removedTrainingPlan });
    } else {
      const removedTrainingPlan = await trainingPlan.findByIdAndDelete({
        _id: trainingPlanID,
      });
      return res.status(200).json({ msg: "Delete successfully", removedTrainingPlan });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Unable to delete data", error: error });
  }
};

//Editing one
const editElementTrainingPlan = async (req, res) => {
  try {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(400).json({ msg: "Unable to update data on weekends." });
    }

    const updateTrainingPlan = await trainingPlan.updateOne(
      {
        "schedules._id": req.body._id,
      },
      {
        $set: {
          "schedules.$.updatedAt": currentDate,
          "schedules.$.status": req.body.status,
          "schedules.$.taskName": req.body.taskName,
          "schedules.$.plan": req.body.plan,
          "schedules.$.actual": req.body.actual,
          "schedules.$.startDate": req.body.startDate,
          "schedules.$.targetDate": req.body.targetDate,
        },
      }
    );

    if (updateTrainingPlan.nModified > 0) {
      return res.status(200).json({ msg: "Update successfully", updateTrainingPlan });
    } else {
      return res.status(400).json({ msg: "Unable to update data. Schedule not found." });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Unable to update data", error: error });
  }
};


const editOneTrainingPlan = async (req, res) => {
  try {
    const updateTrainingPlan = await trainingPlan.updateOne(
      { _id: req.params._id },
      {
        $set: req.body,
      }
    );
    return res.status(200).json({ msg: "Update successfully", updateTrainingPlan });
  } catch (error) {
    return res.status(500).json({ msg: "Unable to update data", error: error });
  }
};

//Delete one
const deleteTrainingPlan = async (req, res) => {
  try {
    await listOfInternModel.updateMany(
      {
        trainingPlanID: req.params._id
      },
      {
        "$pull": { trainingPlanID: req.params._id }
      })
    await trainingPlan.findByIdAndRemove({ _id: req.params._id });
    return res.status(200).json("Delete successfully");
  } catch (error) {
    return res.status(500).json({ msg: "Unable to delete data" });
  }
};

module.exports = {
  deleteOneTrainingPlan,
  deleteTrainingPlan,
  editOneTrainingPlan,
  editElementTrainingPlan,
  getAllTrainingPlan,
  getByIdTrainingPlan,
  postOneTrainingPlan,
  postByIdTrainingPlan,
};