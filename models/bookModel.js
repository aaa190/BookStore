const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const bookSchema = new mongoose.Schema(
    {
        BookID: {
            type: String,
            unique: true,
            trim: true,
        },
        ISBN: {
            type: String,
            required: [true, "Please enter the book's ISBN"],
            unique: true,
            trim: true,
        },
        BookName: {
            type: String,
            required: [true, "Please enter the book name"],
            trim: true,
        },
        Author: {
            type: String,
            required: true,
            trim: true,
        },
        Genre: {
            type: String,
            required: true,
            trim: true,
        },
        Status: {
            type: String,
            enum: ['Borrowed', 'Available'],
            default: 'Available'
        },
        Date: {type: Date, required: true}
    },
    { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
