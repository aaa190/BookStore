const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController.js");

router.post("/newStaff", staffController.createStaff);
router.get("/allStaff", staffController.getAllStaffs);

module.exports = router;
