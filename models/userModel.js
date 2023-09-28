const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: [
            'Travel Team Member',
            'Travel Administrator',
            'Manager',
            'Requester',
            'Accommodation Supplier'
        ]
    }
});

module.exports = User = mongoose.model("user", userSchema);