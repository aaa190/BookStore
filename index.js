const express = require("express");
const dotenv = require("dotenv").config();
const DB = require("./database").connectToDb;
const app = express();

const authRouter = require("./routes/authRoutes");
const customerRouter = require("./routes/customerRoutes");
const bookRouter = require("./routes/bookRoutes");
const staffRouter = require("./routes/staffRoutes");
const borrowedBookRouter = require("./routes/borrowedBookRoutes");

// connect to DB server
DB();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/customers", customerRouter);
app.use("/api/books", bookRouter);
app.use("/api/staff", staffRouter);
app.use("/api/borrowedBooks", borrowedBookRouter);

app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT);
});
