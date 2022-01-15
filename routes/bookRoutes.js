const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController.js");
const authController = require("../controllers/authController.js");

router.post("/newBook", authController.protect, bookController.createBook);
router.post("/deleteBooks", authController.protect, bookController.deleteBooks);
router.delete("/removeBook/:id", authController.protect, bookController.deleteBook);
router.patch("/updateBookStatus/:id", authController.protect, bookController.updateBookStatus);
router.get("/allBooks/:sortBy", bookController.getAllBooks);
router.get("/searchBooks", authController.protect, bookController.searchBooks);


module.exports = router;
