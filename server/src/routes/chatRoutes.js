const express = require("express");

const router = express.Router();

const OpenAI = require("openai");

const auth = require("../middleware/auth");
const Chat = require("../models/Chat");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",

  apiKey: process.env.OPENROUTER_API_KEY
});

/* =========================
   CHAT ROUTE
========================= */

router.post(
  "/",
  auth,
  async (req, res) => {
    try {
      const { message } = req.body;

      const userId = req.user.id;

      let chat = await Chat.findOne({
        user: userId
      });

      if (!chat) {
        chat = await Chat.create({
          user: userId,
          messages: []
        });
      }

      if (!message) {
        return res.status(400).json({
          message: "Message required"
        });
      }

      const models = [
        "nvidia/nemotron-3-super-120b-a12b:free",

        "moonshotai/kimi-k2.6:free",

        "qwen/qwen-2.5-72b-instruct:free",

        "meta-llama/llama-3.3-70b-instruct:free",

        "mistralai/mistral-7b-instruct:free",

        "google/gemma-3-27b-it:free",

        "deepseek/deepseek-r1:free",

        "nvidia/nemotron-4-340b-instruct:free"
      ];

      let completion = null;

      let lastError = null;

      for (const modelName of models) {
        try {
          completion =
            await openai.chat.completions.create({
              model: modelName,

              messages: [
                {
                  role: "system",

                  content: `
You are ECExchange AI.

If only asked about your creators/builder:
"Fuad, an ECE undergrad at RUET. This was an academic project built under the supervision of Md. Omaer Faruq Goni, Assistant Professor, ECE, RUET."

You help university students with:
- EEE/ECE concepts
- Computer science topics
- Machine learning and AI
- Research guidance
- Programming
- Electronics
- Assignments
- Study guidance
- Academic explanations

Rules:
- Be educational and accurate.
- Explain concepts step-by-step.
- Use markdown formatting when useful.
- For equations, format clearly.
- For code, use proper code blocks.
- Avoid politics, sexual content, hate, illegal activities, and harmful instructions.
- If uncertain, say you are uncertain.
`
                },

                ...chat.messages.slice(-12),

                {
                  role: "user",
                  content: message
                }
              ],

              max_tokens: 2000,

              temperature: 0.7
            });

          console.log(
            "USING MODEL:",
            modelName
          );

          break;
        } catch (err) {
          console.log(
            "MODEL FAILED:",
            modelName
          );

          console.log(
            "FAIL REASON:",
            err?.error?.message || err.message
          );

          lastError = err;
        }
      }

      if (!completion) {
        throw lastError;
      }

      chat.messages.push({
        role: "user",
        content: message
      });

      const reply =
        completion.choices?.[0]?.message
          ?.content ||
        "No response generated.";

      chat.messages.push({
        role: "assistant",
        content: reply
      });

      await chat.save();

      res.json({
        reply
      });
    } catch (err) {
      console.error(
        "OPENROUTER ERROR:",
        err
      );

      res.status(500).json({
        message: "AI server error",

        error:
          err.message ||
          "Unknown AI error"
      });
    }
  }
);

module.exports = router;