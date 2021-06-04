const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

const authRoutes = require("./routes/auth");

// middlewares
app.use(express.json()); // for body parser
app.use("/api/user", authRoutes);
dotenv.config();
const API_PORT = process.env.PORT || 5000;
// connect to db
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

app.listen(API_PORT, () => console.log("server is running..."));
