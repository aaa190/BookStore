const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController.js");
const authController = require("../controllers/authController.js");

router.post("/newCustomer", authController.protect, customerController.createCustomer);
router.delete("/removeCustomer/:id", authController.protect, customerController.deleteCustomer);
router.get("/allCustomers", authController.protect, customerController.getAllCustomers);

module.exports = router;
