const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema({
    abbreviations: {type: String, require: true},
    nameUniversity: { type: String, require: true },
});

module.exports = university = mongoose.model("listUniversity", universitySchema);