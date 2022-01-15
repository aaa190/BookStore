const Customer = require("../models/customerModel");

const authController = require("../controllers/authController.js");

exports.createCustomer = async (req, res) => {
    try {

        const allowed = authController.checkPermissions(req.staff, 'createCustomer', res)

        if(!allowed){
            return res.status(401).json({
                message: "You are not allowed to do this action",
            });
        }
        const newCustomer = await Customer.create(req.body);

        res.status(201).json({
            status: "success",
            data: newCustomer,
        });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {

        const allowed = authController.checkPermissions(req.staff, 'deleteCustomer', res)

        if(!allowed){
            return res.status(401).json({
                message: "You are not allowed to do this action",
            });
        }

        const customerTobeDeleted = await Customer.findByIdAndDelete(req.params.id);
        if (!customerTobeDeleted) {
            return res.status(404).json({
                message: "Customer with the provided ID does not exist",
            });
        }
        return res
            .status(200)
            .json({ message: "The customer is deleted successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {

        const customers = await Customer.find({});

        if (customers.length <= 0) {
            return res
                .status(404)
                .json({ message: "There is no Customers in the DB" });
        }
        return res.status(200).json({ data: customers });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};