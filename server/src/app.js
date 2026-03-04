const express = require("express");


// CORS configuration for development and production
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ecexchange.vercel.app"
    ],
    credentials: true
  })
);

const cors = require("cors");


app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));
// app.use("/uploads", express.static("uploads")); // No need as we'd be using Cloudinary for storage now

module.exports = app;