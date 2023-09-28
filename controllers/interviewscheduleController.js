const CandidateModel = require("../models/candidateModel");
const InterviewSchedule = require("../models/interviewScheduleModel");
const listOfIntern = require("../models/listOfInternModel");
const internResourceNeed = require("../models/internResourceNeedModel");
const moment = require("moment");
const _ = require("lodash");
const { verifyAccessToken } = require("../middleware/token");
const SenderHelper = require("../utils/sendingMail");
const userModel = require("../models/userModel");

//Getting all with query filtering
const getAllInterviewSchedule = async (req, res) => {
  try {
    const token = req.headers.jwt;
    const tokenDetails = await verifyAccessToken(token);
    let query = {};
    if (tokenDetails.role === "Project Manager") {
      query = { emailManager: tokenDetails.email };
    }
    const filters = req.query;
    const data = await InterviewSchedule.find({ ...query, ...filters }).populate("candidateData");
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ msg: "Unable to get data", error: error });
  }
};

// Getting one record by ID
const getByIdInterviewSchedule = (req, res) => {
  const interviewScheduleId = req.params._id;
  if (!interviewScheduleId) {
    return res.status(400).json({ msg: "Interview Schedule ID is required" });
  }

  InterviewSchedule.findOne({ _id: interviewScheduleId })
    .populate("candidateData")
    .then((data) => {
      if (!data) {
        return res.status(404).json({ msg: "Interview Schedule not found" });
      }

      const { _id, DC, status, timeSlot, candidateData, interviewManager, bookingTime } = data;
      const formattedBookingTime = moment(bookingTime).format("hh-mm DD-MM-YYYY");

      return res.status(200).json({
        data: {
          id: _id,
          timeSlot,
          status,
          DC,
          interviewManager,
          candidateData,
          bookingTime: formattedBookingTime,
        },
      });
    })
    .catch((error) => {
      return res.status(500).json({ msg: "Unable to get data", error: error });
    });
};

// // Creating one  //join data candidate and interview schedule
const postOneInterviewSchedule = async (req, res) => {
  try {
    const data = req.body;

    const checkCandidate = await CandidateModel.findOne({ _id: req.body.candidateData });

    if (checkCandidate.status !== "Finding project") {
      return res.status(400).json({ mgs: "The request has been canceled as the candidate is currently not in the 'Finding project' " })
    }

    const currentDate = new Date();
    const timeSlotsInCurrentDay = data.timeSlot.filter((time) => {
      const timeSlotDate = new Date(time.split(' ')[1]);
      return (
        (timeSlotDate.getDate() === currentDate.getDate() &&
          timeSlotDate.getMonth() === currentDate.getMonth() &&
          timeSlotDate.getFullYear() === currentDate.getFullYear()) ||
        timeSlotDate < currentDate
      );
    });
    if (!timeSlotsInCurrentDay || timeSlotsInCurrentDay.length >= 1) {
      return res.status(400).json({ msg: "The canceled request. Time slot data invalid" });
    }

    const position = checkCandidate.firstPriority;
    const email = req.user.email;

    const listOfInternCandidate = await listOfIntern.find({ emailProjectLeader: email, position: position });

    const internResourceNeedCandidate = await internResourceNeed.find({ email });

    const checkDuplicateInterviewer = await InterviewSchedule.findOne({
      candidateData: data.candidateData,
      interviewManager: data.interviewManager
    });

    const dataBatchIRN = await internResourceNeed.findOne({ email, skills: position }).sort([["batch", -1]]);
    // check different batch value
    if (dataBatchIRN.batch && dataBatchIRN.batch != data.batch) {
      return res.status(400).json({ msg: `The canceled request. The 'Batch' status of a candidate different from the 'Batch' status you requested.` });
    }
    // check different skill value
    const dataSkillIRN = internResourceNeedCandidate.map(res => res.skills);

    if (dataSkillIRN && dataSkillIRN.indexOf(checkCandidate.firstPriority) == -1) {
      return res.status(400).json({ msg: `The canceled request. Your request doesn't skill is '${checkCandidate.firstPriority}'` });
    }

    const checkLengthSkillIRN = await internResourceNeed.find({ email, skills: position });

    const numberOfInternCandidate =
      _.forEach(listOfInternCandidate, function (o) {
        return o.position == position;
      }).length || 0;
    const numberOfInternResourceNeed =
      _.forEach(checkLengthSkillIRN, function (o) {
        return o.skills == position;
      }).length || 0;

    if (numberOfInternCandidate > numberOfInternResourceNeed) {
      return res.status(400).json({ msg: "The canceled request. You have requested to exceed the permitted quantity." });
    }

    if (checkDuplicateInterviewer !== null) {
      return res.status(400).json({ msg: "Save failed. Data has already existed" });
    } else {
      const candidateData = await InterviewSchedule.find({ candidateData: data.candidateData });
      if (candidateData !== null) {
        let timeSlot = [];
        for (let i = 0; i <= candidateData.length - 1; i++) {
          timeSlot = timeSlot.concat(candidateData[i].timeSlot);
        }
        for (let i = 0; i <= data.timeSlot.length - 1; i++) {
          if (timeSlot.includes(data.timeSlot[i])) {
            return res.status(400).json({ msg: "Interview date already exists" });
          }
        }
      }
    }
    const newInterviewInformation = new InterviewSchedule(data);
    const saveJoin = await newInterviewInformation.save();
    if (req.body.candidateData) {
      const candidateData = CandidateModel.findById(req.body.candidateData);
      await candidateData.updateOne({ $push: { booking: saveJoin._id } });
    }

    if (checkCandidate.status == 'Finding project' || checkCandidate.status == 'Failed 1st interview') {
      await checkCandidate.updateOne({ $set: { status: 'Waiting for result' } });
    }
    const dataUser = await userModel.find({})
    if (dataUser === null) {
      return res.status(400).json({ msg: "Account not found" });
    }
    dataUser.forEach(element => {
      const sendingData = {
        content: `${checkCandidate.fullName} has been scheduled an interview with ${data.interviewManager} at ${data.timeSlot}`,
        email: element.email,
        password: element.password,
        subject: `${checkCandidate.fullName} got an interview`,
      };
      SenderHelper.sendingNotifyEmail(sendingData);
    })
    return res.send(saveJoin);

  } catch (error) {
    return res.status(500).json({ msg: "Unable to save data", error });
  }
};

//Delete one
const deleteOneInterviewSchedule = async (req, res) => {
  try {
    const removed = await InterviewSchedule.findByIdAndRemove({ _id: req.params._id });
    return res.status(200).json({ msg: "Delete successfully", removed: removed });
  } catch (error) {
    return res.status(500).json({ msg: "Unable to delete data", error: error });
  }
};

//Editing one
const editOneInterviewSchedule = async (req, res) => {
  try {
    const userId = { _id: req.params._id };
    if (!userId) {
      return res.status(400).json({ msg: "Interview Schedule ID is required" });
    }
    const { status, commentSchedule } = req.body;

    const dataUpdated = { $set: { status, commentSchedule } };
    const candidateInfoIS = await InterviewSchedule.findById(req.params._id);
    if (!candidateInfoIS) {
      return res.status(400).json({ msg: "Could not find user on interview-schedule view" });
    }
    const candidateInfoCL = await CandidateModel.findById(candidateInfoIS.candidateData);
    if (!candidateInfoCL) {
      return res.status(400).json({ msg: "Could not find user on candidate-list view" });
    }
    const validStatuses = ["passed", "failed", "not show up"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status format" });
    } else if (status !== "not show up" && (!commentSchedule || commentSchedule.trim() === "")) {
      return res.status(400).json({ msg: "The comment field is required" });
    }
    if (status === candidateInfoIS.status) {
      return res.status(400).json({ msg: "No change was made" });
    }
    if (candidateInfoIS.status === "failed" && status === "passed") {
      if (
        candidateInfoCL.status !== undefined
        && (
          candidateInfoCL.status === "Failed interview"
          || candidateInfoCL.status === "Failed 1st interview"
          || candidateInfoCL.status === "Waiting for result"
        )
        || candidateInfoCL.status === undefined
      ) {
        // Allow for edit
      } else {
        return res.status(400).json({ msg: "Status cannot be changed" });
      }
    }
    const updateSchedule = await InterviewSchedule.findByIdAndUpdate(userId, dataUpdated);
    if (!updateSchedule) {
      return res.status(400).json({ msg: "Could not update" });
    }
    return res.status(201).json({
      ...updateSchedule._doc,
      status,
      commentSchedule,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Unable to update data", error: error });
  }
};

const confirmBookingTime = async (req, res) => {
  try {
    const { timeSlot } = req.body
    if (!timeSlot) {
      return res.status(400).json({ msg: "Interview time cannot be empty." })
    }
    await InterviewSchedule.updateOne(
      { _id: req.params._id },
      {
        $set: { timeSlot },
      }
    );
    return res.status(201).json({ msg: "Interview schedule confirmed successfully" });
  } catch (error) {
    return res.status(500).json({ msg: 'Unable to confirm the scheduled interview', error: error });
  }
};

module.exports = {
  confirmBookingTime,
  deleteOneInterviewSchedule,
  editOneInterviewSchedule,
  getAllInterviewSchedule,
  getByIdInterviewSchedule,
  postOneInterviewSchedule,
};