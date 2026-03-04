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


//routes
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));

module.exports = app;