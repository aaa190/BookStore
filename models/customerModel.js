const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
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
        PhoneNumber: {
            type: String,
            required: [true, "Please enter your phone number"],
            unique: true,
            trim: true,
        },
        Email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true,
            trim: true,
        },
        BorrowedBookList: [{
                type: String
            }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
