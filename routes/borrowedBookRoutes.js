const express = require("express");
const router = express.Router();
const borrowedBookController = require("../controllers/borrowedBookController.js");
const authController = require("../controllers/authController.js");

router.post("/borrowBook", authController.protect, borrowedBookController.borrowBook);

module.exports = router;
