const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
    {
        FirstName: {
            type: String,
            required: [true, "Please enter your first name"],
            trim: true,
        },
        LastName: {
            type: String,
            required: [true, "Please enter your last name"],
            trim: true,
        },
        Gender: {
            type: String,
            enum: ['Male', 'Female'],
            required: true
        },
        DateOfBirth: Date,
        Role: {
            type: String,
            enum: ['librarian', 'librarian-assistant', 'admin'],
            required: true
        },
        Salary: {
            type: Number,
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);
