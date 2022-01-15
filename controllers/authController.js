const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Staff = require("../models/staffModel");


const permissions = {
  createBook: ["admin", "librarian"],
  deleteBooks: ["admin"],
  deleteBook: ["admin"],
  updateBookStatus: ["librarian-assistant", "librarian"],
  searchBooks: ["librarian-assistant", "librarian", "admin"],
  borrowBook: ["librarian-assistant", "librarian"],
  deleteCustomer: ["admin"],
  createCustomer: ["admin"]
}

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.checkPermissions = (staff, api, res) => {
  const allowedRoles = permissions[api]

  return !(allowedRoles && !allowedRoles.includes(staff.Role));

};

const createSendToken = (staff, statusCode, res) => {
  const token = signToken(staff._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      staff,
    },
  });
};

exports.login = async (req, res) => {
  try {
    const staffID = req.body.id;

    if (!staffID) {
      return res.status(404).json({
        message: "Staff ID is missing",
      });
    }
    // 1) check if the staff exists and the password is correct
    const staff = await Staff.findById(staffID);

    if (!staff) {
      return res.status(404).json({
        message: "Staff with the provided Token does not exist",
      });
    }

    // 2) if everything ok, send token to client
    createSendToken(staff, 200, res);
  } catch (err) {
    console.log(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) check if the staff token exist
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in - Please log in to get access",
      });
    }

    // 2) token verification
    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ message: "Invalid token. Please log in" });
      } else if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Your session token has expired !! Please login again",
        });
      }
    }

    // 3) check if staff still exists
    const currentStaff = await Staff.findById(decoded.id);

    if (!currentStaff) {
      return res.status(401).json({
        message: "The staff belonging to this token does no longer exist.",
      });
    }

    // Add the valid logged in staff to other requests
    req.staff = currentStaff;

    next();
  } catch (err) {
    console.log(err);
  }
};