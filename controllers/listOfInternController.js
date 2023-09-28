const batchManagementModel = require("../models/batchManagementModel");
const candidateModel = require("../models/candidateModel");
const listOfInternModel = require("../models/listOfInternModel");
const listUserModel = require("../models/listUserModel");
const internResourceNeed = require("../models/internResourceNeedModel");
const SenderHelper = require("../utils/sendingMail");
const moment = require("moment");
const {
  regexEmail,
  regexPhone,
  dateRegex,
} = require("../middleware/validate/form_validator");
const { filterData } = require("../utils/filterData");
const userModel = require("../models/userModel");

//Getting all with query filtering
const getAllListOfIntern = async (req, res) => {
  try {
    const filters = req.query;
    const data = await listOfInternModel.find(filters).populate("trainingPlanId");
    const filtered = filterData(data, filters);
    return res.status(200).send(filtered);
  } catch (error) {
    return res.status(500).json({ msg: "Unable to get data", error: error });
  }
};

// Getting one record by ID
const getByIdListOfIntern = async (req, res) => {
  try {
    const internId = req.params._id;
    if (!internId) {
      return res.status(400).json({ msg: "Candidate ID is required" });
    }

    const intern = await listOfInternModel
      .findOne({ _id: internId })
      .populate("trainingPlanId");
    const formattedIntern = {
      id: intern._id,
      address: intern.address,
      batch: intern.batch,
      dateOfBirth: moment(intern.dateOfBirth).format("YYYY-MM-DD"),
      DC: intern.DC,
      domain: intern.domain,
      email: intern.email,
      emailDirectMentor: intern.emailDirectMentor,
      emailProjectLeader: intern.emailProjectLeader,
      endDate: moment(intern.endDate).format("YYYY-MM-DD"),
      fullName: intern.fullName,
      GPA: intern.GPA,
      internshipProjectName: intern.internshipProjectName,
      interviewManager: intern.interviewManager,
      linkCV: intern.linkCV,
      nameDirectMentor: intern.nameDirectMentor,
      nameProjectLeader: intern.nameProjectLeader,
      phone: intern.phone,
      position: intern.position,
      startDate: moment(intern.startDate).format("YYYY-MM-DD"),
      status: intern.status,
      statusDevice: intern.statusDevice,
      statusIntern: intern.statusIntern,
      team: intern.team,
      trainingPlanId: intern.trainingPlanId,
      typeOfInternship: intern.typeOfInternship,
      workLocation: intern.workLocation,
    };
    return res.status(200).json(formattedIntern);
  } catch (error) {
    return res.status(500).json({ error: "Unable to get data" });
  }
};

// Create one record by ID Candidate
const postByIdListOfIntern = async (req, res) => {
  try {
    // error here can you fix now or later
    const dataCandidate = await candidateModel.findById(req.params._id);
    if (!dataCandidate) {
      return res.status(404).json({ msg: "Candidate not found" });
    }
    if (dataCandidate.approveStatus === "Approved") {
      return res.status(400).json({
        msg: "The request was canceled. The candidate have approved status",
      });
    }
    const { emailProjectLeader, interviewManager } = req.body;
    const checkDC = await listUserModel.findOne({ email: emailProjectLeader });
    if (!checkDC) {
      return res.status(404).json({ msg: "Project leader not found" });
    }
    const checkIRN = await internResourceNeed.findOne({
      email: emailProjectLeader,
      skills: dataCandidate.firstPriority,
    });
    const data = {
      address: dataCandidate.address,
      batch: dataCandidate.batch,
      certificateEnglish: dataCandidate.certificateEnglish,
      dateOfBirth: dataCandidate.dateOfBirth,
      DC: checkDC.DC,
      domain: "",
      email: dataCandidate.email,
      emailDirectMentor: "",
      emailProjectLeader: emailProjectLeader,
      endDate: "",
      fullName: dataCandidate.fullName,
      GPA: dataCandidate.GPA,
      internshipProjectName: "",
      linkCV: dataCandidate.linkCV,
      nameProjectLeader: interviewManager,
      phone: dataCandidate.phone,
      pointEnglish: dataCandidate.pointEnglish,
      position: dataCandidate.firstPriority,
      priority: "",
      startDate: "",
      team: "",
      typeOfInternship: dataCandidate.typeOfInternship,
      workLocation: dataCandidate.workLocation,
    };
    if (!checkIRN) {
      data.nameDirectMentor = "";
    }
    data.nameDirectMentor = checkIRN.directMentor;
    // Update candidate's status when becoming an intern
    const listOfIntern = new listOfInternModel(data);
    await listOfIntern.save();
    await dataCandidate.update({
      $set: {
        status: "Passed",
        approveStatus: "Approved",
      },
    });
    return res.status(201).json("Create the intern successfully");
  } catch (error) {
    return res.status(500).json({ msg: "Unable to save data", error: error });
  }
};

//Create one
const postOneListOfIntern = async (req, res) => {
  try {
    const data = req.body;
    const newListOfInternResult = await listOfInternModel(data);
    await newListOfInternResult.save();
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ msg: "Unable to save data", error: error });
  }
};

//Delete one
const deleteOneListOfIntern = async (req, res) => {
  try {
    const internId = req.params._id;
    if (!internId) {
      return res.status(400).json({ msg: "Candidate ID is required" });
    }
    const removedListOfIntern = await listOfInternModel.findByIdAndRemove({
      _id: internId,
    });
    return res.status(200).json({
      msg: "Delete successfully",
      removedListOfIntern: removedListOfIntern,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Unable to delete data", error: error });
  }
};

//Editing one
const editOneListOfIntern = async (req, res) => {
  let data;
  let allowedRoles = [
    "SDC Manager",
    "Training Coordinator",
    "Project Manager",
    "Direct Mentor",
  ];
  if (allowedRoles.includes(req.user.role)) {
    const { statusIntern, ...updatedData } = req.body;
    data = updatedData;
  } else {
    return res.status(401).json({ msg: "Access Denied" });
  }
  try {
    const internId = req.params._id;
    if (!internId) {
      return res.status(400).json({ msg: "Candidate ID is required" });
    }
    const updateListOfIntern = await listOfInternModel.updateOne(
      { _id: internId },
      { $set: data }
    );
    if (updateListOfIntern.nModified === 0) {
      return res.status(400).json({
        message: "Failed to update. Please check your input data",
      });
    }
    return res.status(200).json(updateListOfIntern);
  } catch (error) {
    return res.status(500).json({ msg: "Unable to update data", error: error });
  }
};

// Validate Input List Of Intern
const validateInputListOfIntern = async (req, res, next) => {
  const data = req.body;
  if (
    !regexEmail.test(data.emailProjectLeader) ||
    !regexEmail.test(data.emailDirectMentor) ||
    !regexEmail.test(data.email)
  ) {
    return res.status(400).json({
      msg: "Invalid email format. Please enter a valid email address.",
    });
  }
  if (!regexPhone.test(data.phone)) {
    return res
      .status(400)
      .json({ msg: "Invalid phone format. Please enter a valid phone number" });
  }
  if (
    !dateRegex.test(data.startDate) ||
    !dateRegex.test(data.dateOfBirth) ||
    !dateRegex.test(data.endDate)
  ) {
    return res.status(400).json({
      msg: "Invalid date format. Please use a valid date format (e.g. MM/DD/YYYY).",
    });
  }
  next();
};

// Change status Batch to Closed if there is no intern with the status Internship
const changeStatusInternship = async (req, res) => {
  // Find info of internship
  const findInfoInternship = await listOfInternModel.findOne({
    _id: req.params._id,
  });

  // check the number of trainees in that batch is Practicing status
  const countInternship = await listOfInternModel.find({
    statusIntern: "Practicing",
    batch: findInfoInternship.batch,
  });

  // get ID of Batch
  const findInfoBatch = await batchManagementModel.find({
    batch: findInfoInternship.batch,
  });

  const data = {
    statusIntern: req.body.statusIntern,
  };

  await listOfInternModel.updateOne({ _id: req.params._id }, { $set: data });
  res.status(200).json({ msg: "Update successfully" });
  if (countInternship.length < 1 && findInfoBatch[0].status == "On-Going") {
    await batchManagementModel.updateOne(
      { _id: findInfoBatch[0]._id },
      {
        $set: {
          status: "Closed",
        },
      }
    );
    return;
  } else {
    if (countInternship.length > 0 && findInfoBatch[0].status == "Closed") {
      await batchManagementModel.updateOne(
        { _id: findInfoBatch[0]._id },
        {
          $set: {
            status: "On-Going",
          },
        }
      );
      return;
    }
  }
  return;
};

const handelUpdateStatusFinish = async (req, res) => {
  try {
    const id = req.params._id
    const { statusFinish, fullName, certificateEnglish, pointEnglish } = req.body
    const validStatus = [
      "Finished",
      "Joined Company"
    ]
    if (!statusFinish || !validStatus.indexOf(statusFinish)) {
      return res.status(400).json({ msg: "The request canceled. Invalid finish status " })
    }
    const dataUser = await userModel.find({})
    if (dataUser === null) {
      return res.status(400).json({ msg: "Account not found" });
    }
    if (statusFinish === "Joined Company") {
      dataUser.forEach(element => {
        const sendingData = {
          content: `Trainee ${fullName} was nominated as an official employee by project manager with a ${certificateEnglish} score of ${pointEnglish} `,
          email: element.email,
          id: id,
          password: element.password,
          subject: `${fullName} was promoted to an official employee`,
        };
        SenderHelper.sendingPromoteEmail(sendingData);
      })
    }
    await listOfInternModel.findByIdAndUpdate(id, { $set: { statusFinish } });
    return res.status(200).json({ msg: "Update data successfully" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Unable to update data", error })
  }

}

module.exports = {
  deleteOneListOfIntern,
  editOneListOfIntern,
  handelUpdateStatusFinish,
  getAllListOfIntern,
  getByIdListOfIntern,
  postByIdListOfIntern,
  postOneListOfIntern,
  validateInputListOfIntern,
  changeStatusInternship,
};
