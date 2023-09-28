const _ = require("lodash");
const listOfIntern = require("../models/listOfInternModel");
const internResourceNeed = require("../models/internResourceNeedModel");
const Candidate = require("../models/candidateModel");
const SenderHelper = require("../utils/sendingMail");
const userModel = require("../models/userModel");

//Getting all with query filtering
const getSendingMail = async (req, res) => {
    try {
        // get all data
        const allInternData = await listOfIntern.find();
        const allResourceNeedData = await internResourceNeed.find();
        const allCandidateData = await Candidate.find({
            $or: [{ status: "Finding project" }],
        });
        // filter data base on skills
        const allSkills = [
            "Front-End Developer",
            "Back-end Developer",
            "Embedded",
            "Full Stack Developer",
            "Network Developer",
            "Telecom Developer",
            "Data Science, AI/ML",
            "Java Developer",
            "PhP Developer",
            ".NET Developer",
            "Python Developer",
            "Mobile Developer",
        ];
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
            for (const email of managerEmail) {
                await SenderHelper.sendingEmail(email, filteredCandidateDataWithSkill);
            }
        }
        return res.status(200).json({ msg: "Sending successfully" });
    } catch (error) {
        return res.status(500).json({ msg: " Unable to send email ", error: error });
    }
};

const postSendRejecCompanyil = async (req, res) => {
    try {
        const { subject, content, } = req.body;
        const candidate = await Candidate.findOne({ _id: req.params._id });
        const dataUser = await userModel.find({})
        if (dataUser === null) {
            return res.status(400).json({ msg: "Account not found" });
        }
        dataUser.forEach(element => {
            const sendingData = {
                candidateName: candidate.fullName,
                candidateEmail: candidate.email,
                content: content,
                email: element.email,
                password: element.password,
                subject: subject,
            };
            SenderHelper.sendingRejectEmail(sendingData);
            return res.status(201).json({ msg: "Email sent successfully" });
        });
    } catch (error) {
        return res.status(500).json({ msg: " Unable to send email ", error: error });
    }
};

const postSendingMail = async (req, res) => {
    try {
        const { subject, content, } = req.body;
        const candidate = await Candidate.findOne({ _id: req.params._id });
        const dataUser = await userModel.find({})
        if (dataUser === null) {
            return res.status(400).json({ msg: "Account not found" });
        }
        dataUser.forEach(element => {
            const sendingData = {
                candidateName: candidate.fullName,
                candidateEmail: candidate.email,
                content: content,
                email: element.email,
                password: element.password,
                subject: subject,
            };
            SenderHelper.sendingRejectEmail(sendingData);
            return res.status(201).json({ msg: "Email sent successfully" });
        });
    } catch (error) {
        return res.status(500).json({ msg: " Unable to send email ", error: error });
    }
};

module.exports = {
    getSendingMail,
    postSendRejecCompanyil,
    postSendingMail
};