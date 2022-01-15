const Book = require("../models/bookModel");
const uuid = require('uuid');

const authController = require("../controllers/authController.js");

exports.createBook = async (req, res) => {
    try {

        const allowed = authController.checkPermissions(req.staff, 'createBook', res)

        if(!allowed){
            return res.status(401).json({
                message: "You are not allowed to do this action",
            });
        }

        const randomId = uuid.v1();

        req.body.BookID = randomId.toString()

        const newBook = await Book.create(req.body);

        res.status(201).json({
            status: "success",
            data: newBook,
        });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

exports.deleteBooks = async (req, res) => {

    try {

        const allowed = authController.checkPermissions(req.staff, 'deleteBooks', res)

        if(!allowed){
            return res.status(401).json({
                message: "You are not allowed to do this action",
            });
        }

        const bookIDs = req.body["bookIDs"]

        if (!bookIDs) {
            return res.status(400).json({
                message: "Books IDs to be deleted are missing",
            });
        }


        const booksTobeDeleted = await Book.deleteMany({
            BookID: {$in: bookIDs}
        });
        if (!booksTobeDeleted) {
            return res.status(404).json({
                message: "Books with the provided ID do not exist",
            });
        }
        return res
            .status(200)
            .json({ message: "The books are deleted successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {

        const allowed = authController.checkPermissions(req.staff, 'deleteBook', res)

        if(!allowed){
            return res.status(401).json({
                message: "You are not allowed to do this action",
            });
        }

        const bookTobeDeleted = await Book.findOneAndDelete({BookID: req.params.id});
        if (!bookTobeDeleted) {
            return res.status(404).json({
                message: "Book with the provided ID does not exist",
            });
        }
        return res
            .status(200)
            .json({ message: "The book is deleted successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.updateBookStatus = async (req, res) => {
    try {

        const allowed = authController.checkPermissions(req.staff, 'updateBookStatus', res)

        if(!allowed){
            return res.status(401).json({
                message: "You are not allowed to do this action",
            });
        }

        const updatedBook = await Book.findOneAndUpdate(
            { BookID: req.params.id },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedBook) {
            return res.status(404).json({
                message: "Book with the provided id does not exist",
            });
        }

        if(req.source === 'internal'){
            return "success"
        }

        return res.status(200).json({
            message: "Book updated successfully",
            data: updatedBook,
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getAllBooks = async (req, res) => {

    try {

        const sortBy = req.params.sortBy

        if (sortBy !== 'Genre' && sortBy !== 'Author'){
            return res
                .status(400)
                .json({ message: "sortBy can be one of ['Author', 'Genre']" });
        }

        const aggregatePipeline = [
            {
                '$addFields': {
                    'lower': {
                        '$toLower': `$${sortBy}`
                    }
                }
            }, {
                '$sort': {
                    'lower': 1
                }
            }, {
                '$project': {
                    'lower': 0
                }
            }
        ]

        const books = await Book.aggregate(aggregatePipeline);

        if (books.length <= 0) {
            return res
                .status(404)
                .json({ message: "There is no Books in the DB" });
        }

        return res.status(200).json({ data: books });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.searchBooks = async (req, res) => {

    try {

        const allowed = authController.checkPermissions(req.staff, 'searchBooks', res)

        if(!allowed){
            return res.status(401).json({
                message: "You are not allowed to do this action",
            });
        }

        const bookNameFilter = req.query.BookName
        const isbnFilter = req.query.ISBN

        let books;

        if (!bookNameFilter && !isbnFilter){
            books = await Book.find({});
        }

        else if (!bookNameFilter && isbnFilter){
            books = await Book.find({
                ISBN: { $regex: `.*${isbnFilter}.*` , $options: 'i' }
            });
        }

        else if (bookNameFilter && !isbnFilter){
            books = await Book.find({
                BookName: { $regex: `.*${bookNameFilter}.*`, $options: 'i' }
            });
        }

        else {
            books = await Book.find({
                BookName: { $regex: `.*${bookNameFilter}.*` , $options: 'i' },
                ISBN: { $regex: `.*${isbnFilter}.*` , $options: 'i' }
            });
        }

        if (books.length <= 0) {
            return res
                .status(404)
                .json({ message: "There is no Books in the DB" });
        }
        return res.status(200).json({ data: books });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
