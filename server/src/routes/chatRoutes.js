const express = require("express");

const router = express.Router();

const model = require("../config/gemini");

const auth = require("../middleware/auth");

const chatLimiter = require("../middleware/chatLimiter");

router.post(
  "/",
  auth,
  chatLimiter,
  async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          message: "Message required"
        });
      }

      const prompt = `
You are ECExchange AI.

You help university students with:
- Electrical engineering
- Electronics
- Programming
- Mathematics
- Study guidance
- Assignment explanations

Keep responses educational,
accurate,
and concise.

Student question:
${message}
`;

      const result =
        await model.generateContent(prompt);

      const response =
        result.response.text();

      res.json({
        reply: response
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "AI request failed"
      });
    }
  }
);

module.exports = router;