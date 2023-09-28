const mongoose = require("mongoose");

const listUserSchema = new mongoose.Schema({
    group: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
    role: { type: String, required: true, },
    updatedDate: { type: Date, default: Date.now }
});

module.exports = listUser = mongoose.model("listUser", listUserSchema);