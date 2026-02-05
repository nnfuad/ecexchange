const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));
app.use("/uploads", express.static("uploads"));

module.exports = app;