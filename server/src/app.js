const express = require("express");
const cors = require("cors");

const app = express();   // <-- THIS WAS MISSING


//   CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ecexchange.vercel.app"
    ],
    credentials: true
  })
);

//Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routes
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));

// Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR FULL:", {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code,
    raw: err
  });

  res.status(500).json({
    message: err.message || "Internal server error"
  });
});

module.exports = app;