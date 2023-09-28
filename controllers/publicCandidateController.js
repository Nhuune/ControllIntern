const batchManagementModel = require("../models/batchManagementModel");
const Candidate = require("../models/candidateModel");
const listUniversityModel = require("../models/listUniversityModel");
const userModel = require("../models/userModel");
const SenderHelper = require("../utils/sendingMail");
const multer = require('multer');
const { upload, checkFileExtension, deleteFile ,} = require("../utils/uploadFile");
const { regexEmail, regexPhone, dateRegex } = require("../middleware/validate/form_validator");
//sign up for an internship 
const createCandidate = async (req, res) => {
    try {
        const dataBatch = await batchManagementModel.findOne({}).sort([["batch", -1]]);
        if (!dataBatch || dataBatch.status !== "Recruitment") {
            const message = "Currently, it is not yet time to recruit trainees. Please come back later.";
            return res.status(400).json({ msg: message });
        }

        upload(req, res, async (error) => {
            const pathCV = req.file.path;
            if (error instanceof multer.MulterError || error) {
                return res.status(500).json({ msg: "Unable to upload PDF", error: error });
            }

            if (req.file && !checkFileExtension(req.file)) {
                return res.status(400).json({ msg: "Invalid file format. Only PDF files are allowed." });
            }

            const data = req.body;
            for (let prop in data) {
                if (data[prop].trim() === "" || data[prop] == null) {
                    return res.status(400).json(`Invalid data ${prop} = ${data[prop]}`);
                }
            }

            if (!regexEmail.test(data.email)) {
                return res.status(400).json({ msg: "Invalid email format. Please enter a valid email address." });
            }

            if (!regexPhone.test(data.phone)) {
                return res.status(400).json({ msg: "Invalid phone format. Please enter a valid phone number" });
            }

            if (!dateRegex.test(data.startDate) || !dateRegex.test(data.dateOfBirth) || !dateRegex.test(data.signatureDate)) {
                return res.status(400).json({ msg: "Invalid date format. Please use a valid date format (e.g. MM/DD/YYYY)." });
            }

            const getBatch = await batchManagementModel.find({}).sort([["batch", -1]]);
            data.batch = getBatch[0].batch;
            const checkEmail = await Candidate.find({ email: data.email });

            // remove ineligible candidates and send thank you email
            if (data.GPA < 6) {
                const dataUser = await userModel.find({});
                dataUser.forEach(element => {
                    const sendingData = {
                        candidateName: data.fullName,
                        candidateEmail: data.email,
                        content: "You are not eligible for this internship",
                        email: element.email,
                        password: element.password,
                        subject: "[Company Industry Internship] Thank you for your application at Company Solutions",
                    };
                    SenderHelper.sendingRejectEmail(sendingData);
                });
                return res.status(400).json("Internship registration successful.");
            }

            if (checkEmail.length >= 1) {
                return res.status(400).json("Sorry, the email address you entered is already in use");
            }

            if (data.abbreviations) {
                const foundDataUNS = await listUniversityModel.find({
                    abbreviations: data.abbreviations
                });
                if (foundDataUNS.length >= 1) {
                    return res.status(400).json("Sorry, University information already exists");
                }
                await listUniversityModel.create({
                    abbreviations: data.abbreviations,
                    nameUniversity: data.university,
                });
            }

            const newCandidate = new Candidate(data);
            if (req.file) {
                newCandidate.linkCV = pathCV;
            }
            await newCandidate.save();
            return res.status(201).json("Successfully Registered for Internship");
        });

    } catch (error) {
        return res.status(500).json({ msg: "Unable to save data", error: error });
    }
};

module.exports = {
    createCandidate,
};