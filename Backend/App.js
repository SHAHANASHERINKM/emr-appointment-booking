const express = require('express');
const app = express();
const dotenv = require('dotenv');
const routes = require('./routes/index');
const connectDB = require("./config/db");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

dotenv.config();

const port = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later."
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts, please try again later."
  }
});

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", limiter);
app.use("/api/auth/login", authLimiter);

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error"
  });
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
});