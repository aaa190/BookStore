const Staff = require("../models/staffModel");

exports.createStaff = async (req, res) => {
    try {

        const newStaff = await Staff.create(req.body);

        res.status(201).json({
            status: "success",
            data: newStaff,
        });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

exports.getAllStaffs = async (req, res) => {
    try {

        const staffs = await Staff.find({});

        if (staffs.length <= 0) {
            return res
                .status(404)
                .json({ message: "There is no Staffs in the DB" });
        }
        return res.status(200).json({ data: staffs });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};