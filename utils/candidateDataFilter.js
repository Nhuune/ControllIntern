const batchManagementModel = require("../models/batchManagementModel");
const Candidate = require("../models/candidateModel");
const listOfIntern = require("../models/listOfInternModel");
const Internresourceneed = require("../models/internResourceNeedModel");
const SenderHelper = require("./sendingMail");
const _ = require("lodash");

const candidateDataFilterByRequest = async () => {
  try {
    // get all data
    const allInternData = await listOfIntern.find();
    if (!allInternData) {
      return console.log('Trainee data not found')
    }
    const allResourceNeedData = await Internresourceneed.find();
    if (!allResourceNeedData) {
      return console.log('No human resource requirement was found')
    }
    const allCandidateData = await Candidate.find({
      $or: [{ status: "Finding project" }],
    });
    if (!allCandidateData) {
      return console.log('Candidate not found')
    }
    const dataBatch = await batchManagementModel.findOne({}).sort([["batch", -1]]);
    if (!dataBatch || dataBatch.status !== "Recruitment") {
      const message = "The mail sending request has been cancelled due to the absence of a valid batch value"
      return console.log({ msg: message });
    }
    const allSkills = dataBatch.skill.map(element => {
      return element.name
    });
    for (let i = 0; i < allSkills.length; i++) {
      const filteredLisOfInternDataWithSkill = _.filter(
        allInternData,
        function (o) {
          return o.position == allSkills[i];
        }
      );
      const filteredInternResourceNeedDataWithSkill = _.filter(
        allResourceNeedData,
        function (o) {
          return o.skills == allSkills[i];
        }
      );
      const filteredCandidateDataWithSkill = _.filter(
        allCandidateData,
        function (o) {
          return (
            o.firstPriority == allSkills[i] || o.secondPriority == allSkills[i]
          );
        }
      );
      if (_.isEmpty(filteredCandidateDataWithSkill)) {
        continue;
      }
      // Check if the manager get full candidate of position
      // by get full of name first and search it
      const allNameOfManager = [];
      const managerEmail = [];
      const listOfManagerNameToSend = [];
      // get list of Manager name
      _.map(filteredInternResourceNeedDataWithSkill, function (o) {
        if (_.includes(allNameOfManager, o.requester)) {
          return;
        }
        allNameOfManager.push(o.requester);
        managerEmail.push(o.email);
      });
      // get list of Manager name need to send email
      _.forEach(allNameOfManager, function (element) {
        const filteredInternResourceNeedCount = _.filter(
          filteredInternResourceNeedDataWithSkill,
          function (o) {
            return o.requester == element;
          }
        )[0].internResourceNeed;
        const filteredLisOfInternCount = _.filter(
          filteredLisOfInternDataWithSkill,
          function (o) {
            return o.nameProjectLeader == element;
          }
        ).length;
        if (filteredInternResourceNeedCount <= filteredLisOfInternCount) {
          return;
        }
        listOfManagerNameToSend.push(element);
      });
      // sending mail
      const email = managerEmail.map(res => {
        return res
      })
      await SenderHelper.sendingEmail(email, dataBatch.batch, filteredCandidateDataWithSkill);
    }
  } catch (error) {
    return error
  }
};

module.exports = { candidateDataFilterByRequest };