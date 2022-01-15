const mongoose = require("mongoose");

const borrowedBookSchema = new mongoose.Schema(
    {
        borrowerID: {
            type: String,
            required: true,
            trim: true,
        },
        borrowedBookName: {
            type: String,
            required: false,
            trim: true,
        },
        borrowerBookID: {
            type: String,
            required: true,
            trim: true,
        },
        borrowerBookDate: {type: Date, required: true}
    },
    { timestamps: true }
);

module.exports = mongoose.model("BorrowedBook", borrowedBookSchema);
