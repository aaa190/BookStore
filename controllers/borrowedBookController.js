const BorrowedBook = require("../models/borrowedBookModel");
const Book = require("../models/bookModel");
const Customer = require("../models/customerModel");
const bookController = require("../controllers/bookController");
const authController = require("../controllers/authController.js");

const sendMail = require("../utils/email").sendMail;

exports.borrowBook = async (req, res) => {

    try {

        const allowed = authController.checkPermissions(req.staff, 'borrowBook', res)

        if(!allowed){
            return res.status(401).json({
                message: "You are not allowed to do this action",
            });
        }


        const bookIDToBorrow = req.body.borrowerBookID
        const bookToBorrow = await Book.findOne({BookID: bookIDToBorrow});

        if (!bookToBorrow) {
            return res.status(404).json({
                message: "Book to borrow with the provided ID does not exist",
            });
        }

        const borrowerID = req.body.borrowerID
        const borrower = await Customer.findOneAndUpdate(
            {"_id": borrowerID},
            {$addToSet: { "BorrowedBookList": bookIDToBorrow}}
        )

        if (!borrower) {
            return res.status(404).json({
                message: "Borrower customer with the provided ID does not exist",
            });
        }

        const newBorrowedBook = await BorrowedBook.create({
            borrowerID: borrowerID,
            borrowedBookName: bookToBorrow.BookName,
            borrowerBookID: bookIDToBorrow,
            borrowerBookDate: bookToBorrow.Date,
        });

        await bookController.updateBookStatus(
            {
                body: {
                    Status: "Borrowed"
                    },
                params: {
                    id: bookIDToBorrow
                },
                source: "internal",
                staff: req.staff
            },
            res)

        try {
            await sendMail({
                email: borrower.Email,
                subject: `Borrowing Success`,
                message: `You Borrowed ${bookToBorrow.BookName}`,
            });

        } catch (err) {

            res.status(500).json({
                status: "Error",
                message:
                    " An error occurred while sending the email. Please try again in a moment",
            });
        }
9
        res.status(201).json({
            status: "success",
            data: newBorrowedBook,
        });


    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};
