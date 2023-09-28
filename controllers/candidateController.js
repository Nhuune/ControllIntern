const { regexEmail, regexPhone, dateRegex } = require("../middleware/validate/form_validator");
const batchManagementModel = require("../models/batchManagementModel");
const Candidate = require("../models/candidateModel");
const listUniversityModel = require("../models/listUniversityModel");
const multer = require('multer');
const fs = require('fs');
const { filterData } = require("../utils/filterData");
const {upload, checkFileExtension,} = require("../utils/uploadFile");

//Getting all with query filtering
const getAllCandidate = async (req, res) => {
  try {
    const filters = req.query;
    const data = await Candidate.find(filters).sort({ batch: -1 }).populate('booking');
    const filtered = filterData(data, filters);
    return res.status(200).send(filtered);
  } catch (error) {
    return res.status(500).json({ msg: "Unable to get data", error: error });
  }
};

const downLoadCV = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = `./uploads/${fileName}`;

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Send the file to the user
    res.download(filePath, (err) => {
      if (err) {
        // Handle error if any
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file');
      }
    });
  } else {
    // Handle the case when the file does not exist
    console.error('File not found:', filePath);
    res.status(404).send('File not found');
  }
};

// Getting one record by ID
const getByIdCandidate = async (req, res) => {
  try {
    const candidateId = req.params._id;
    if (!candidateId) {
      return res.status(400).json({ msg: "Candidate ID is required" });
    }

    const data = await Candidate.findOne({ _id: candidateId }).populate('booking');
    if (!data) {
      return res.status(404).json({ msg: "Candidate not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ msg: "Unable to get data", error: error });
  }
};

const postOneCandidate = async (req, res) => {
  try {
    const dataBatch = await batchManagementModel.findOne({}).sort([["batch", -1]]);
    if (!dataBatch || dataBatch.status !== "Recruitment") {
      const message = "The creation of the candidate request has been canceled as there is no valid batch value present";
      return res.status(400).json({ msg: message });
    }

    upload(req, res, async (error) => {
      if (error instanceof multer.MulterError || error) {
        return res.status(500).json({ msg: "Unable to upload PDF", error: error });
      }

      if (req.file && !checkFileExtension(req.file)) {
        return res.status(400).json({ msg: "Invalid file format. Only PDF files are allowed." });
      }

      if (await isFileDuplicate(req.file)) {
        return res.status(400).json({ msg: "File already exists. Please upload a different file." });
    }

      const data = req.body;
      const foundData = await Candidate.findOne({ email: data.email });

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

      if (foundData?.email === data.email) {
        return res.status(400).json({ msg: "Save failed. Data has already existed" });
      }

      if (data.abbreviations) {
        const foundDataUNS = await listUniversityModel.find({ abbreviations: data.abbreviations });
        if (foundDataUNS.length >= 1) {
          return res.status(400).json({ msg: "Sorry, University information already exists" });
        }
        await listUniversityModel.create({ abbreviations: data.abbreviations, nameUniversity: data.university });
      }

      const newCandidate = new Candidate(data);
      if (req.file) {
        newCandidate.linkCV = req.file.path;
      }
      await newCandidate.save();

      return res.status(201).json({ msg: "Your data has been saved!!!", newCandidate });
    });
  } catch (error) {
    return res.status(500).json({ msg: "Unable to save data", error: error });
  }
};

//Delete one
const deleteOneCandidate = async (req, res) => {
  try {
    const candidateId = req.params._id;
    if (!candidateId) {
      return res.status(400).json({ msg: "Candidate ID is required" });
    }

    const removedCandidate = await Candidate.findByIdAndRemove({ _id: candidateId });
    if (removedCandidate.deletedCount === 0) {
      return res.status(404).json({ msg: "Candidate not found" });
    }

    return res.status(200).json({ msg: "Delete successfully", removedCandidate });
  } catch (error) {
    return res.status(500).json({ msg: "Unable to delete data", error: error });
  }
};

const editOneCandidate = async (req, res) => {
  try {
    const candidateId = req.params._id;
    if (!candidateId) {
      return res.status(400).json({ msg: "Candidate ID is required" });
    }

    const updateCandidate = await Candidate.updateOne(
      { _id: candidateId },
      {
        $set: req.body,
      }
    );
    if (updateCandidate.nModified === 0) {
      return res.status(404).json({ msg: "Candidate not found" });
    }

    return res.status(200).json({ msg: "Update successfully", updateCandidate });
  } catch (error) {
    return res.status(500).json({ msg: "Unable to update data", error: error });
  }
};

//Edit status only
const editStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = [
      "Canceled application",
      "Denied offer",
      "Failed 1st interview",
      "Failed admission test",
      "Failed interview",
      "Finding project",
      "Passed",
      "Rejected",
      "Transferred",
      "Waiting for admission test",
      "Waiting for result"
    ];
    if (!status || !validStatus.includes(status)) {
      return res.status(400).json({ msg: "Status is not valid" });
    }
    const userId = { _id: req.params._id };
    const dataUpdated = { $set: { status: status } };
    const updateStatus = await Candidate.findByIdAndUpdate(userId, dataUpdated);
    if (!updateStatus || updateStatus === null || updateStatus === undefined) {
      return res.status(400).json({ msg: "Could not update status" });
    }
    return res.status(201).json({
      ...updateStatus._doc,
      status
    });
  } catch (error) {
    return res.status(500).json({ msg: "Unable to update data", error: error });
  }
}

const validateInputCandidate = async (req, res, next) => {
  const data = req.body;
  if (!regexEmail.test(data.email)) {
    return res.status(400).json({ msg: "Invalid email format. Please enter a valid email address." });
  }
  if (!regexPhone.test(data.phone)) {
    return res.status(400).json({ msg: "Invalid phone format. Please enter a valid phone number" });
  }
  if (!dateRegex.test(data.startDate)
    || !dateRegex.test(data.dateOfBirth)
    || !dateRegex.test(data.signatureDate)) {
    return res.status(400).json({ msg: "Invalid date format. Please use a valid date format (e.g. MM/DD/YYYY)." });
  }
  next()
}

module.exports = {
  deleteOneCandidate,
  downLoadCV,
  editOneCandidate,
  editStatus,
  getAllCandidate,
  getByIdCandidate,
  postOneCandidate,
  validateInputCandidate
};