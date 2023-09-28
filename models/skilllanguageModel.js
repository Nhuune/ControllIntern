const mongoose = require("mongoose");

const skillLanguageSchema = new mongoose.Schema({
    skill: [{ name: { type: String } }],
});

module.exports = skillLanguage = mongoose.model("skillLanguage", skillLanguageSchema);