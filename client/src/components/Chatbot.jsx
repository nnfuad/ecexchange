import { useState, useRef, useEffect } from "react";

import ReactMarkdown from "react-markdown";

import {
  FiSend,
  FiMessageSquare,
  FiX
} from "react-icons/fi";

const API = import.meta.env.VITE_API_URL;

export default function Chatbot() {
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Hello. I am ECExchange AI.\n\nAsk me anything related to:\n- Electronics\n- EEE/ECE topics\n- Programming\n- Study help\n- Assignments"
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = {
      role: "user",
      text: message
    };

    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    const currentMessage = message;

    setMessage("");

    try {
      setLoading(true);

      const res = await fetch(
        `${API}/api/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            message: currentMessage
          })
        }
      );

      const rawText = await res.text();

      console.log(
        "RAW AI RESPONSE:",
        rawText
      );

      let data;

      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          "Server returned invalid JSON"
        );
      }

      if (!res.ok) {
        throw new Error(
          data.message ||
            "AI request failed"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            data.reply ||
            "No response from AI"
        }
      ]);
    } catch (err) {
      console.error(
        "CHATBOT FRONTEND ERROR:",
        err
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:

            "Error: " + err.message +"\n"+
            "Maybe try logging back in..."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        style={floatingButton}
      >
        {open ? (
          <FiX size={22} />
        ) : (
          <FiMessageSquare size={22} />
        )}
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div style={chatWrapper}>
          {/* HEADER */}
          <div style={headerStyle}>
            <div>
              <h3 style={{ margin: 0 }}>
                ECExchange AI
              </h3>

              <span
                style={{
                  fontSize: "12px",
                  opacity: 0.7
                }}
              >
                Academic Assistant
              </span>
            </div>
          </div>

          {/* MESSAGES */}
          <div style={messagesContainer}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user"
                      ? "flex-end"
                      : "flex-start"
                }}
              >
                <div
                  style={{
                    ...messageBubble,

                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg,#1DB954,#169c46)"
                        : "#1a1a1a",

                    color:
                      msg.role === "user"
                        ? "white"
                        : "#ddd"
                  }}
                >
                  <ReactMarkdown>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div style={typingStyle}>
                ECExchange AI is thinking...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* INPUT */}
          <div style={inputContainer}>
            <textarea
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              style={inputStyle}
            />

            <button
              onClick={sendMessage}
              style={sendButton}
            >
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= STYLES ================= */

const floatingButton = {
  position: "fixed",
  bottom: "24px",
  right: "24px",

  width: "60px",
  height: "60px",

  borderRadius: "50%",

  border: "none",

  background:
    "linear-gradient(135deg,#1DB954,#15803d)",

  color: "white",

  cursor: "pointer",

  zIndex: 9999,

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.45)"
};

const chatWrapper = {
  position: "fixed",

  bottom: "95px",
  right: "24px",

  width: "380px",
  maxWidth: "92vw",

  height: "620px",
  maxHeight: "82vh",

  background:
    "rgba(12,12,12,0.88)",

  backdropFilter: "blur(20px)",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius: "24px",

  overflow: "hidden",

  display: "flex",
  flexDirection: "column",

  zIndex: 9999,

  boxShadow:
    "0 25px 60px rgba(0,0,0,0.6)"
};

const headerStyle = {
  padding: "18px 20px",

  borderBottom:
    "1px solid rgba(255,255,255,0.06)",

  background:
    "linear-gradient(135deg,#0f172a,#111827)"
};

const messagesContainer = {
  flex: 1,

  overflowY: "auto",

  padding: "18px",

  display: "flex",
  flexDirection: "column",

  gap: "14px"
};

const messageBubble = {
  maxWidth: "85%",

  padding: "14px 16px",

  borderRadius: "18px",

  lineHeight: 1.6,

  fontSize: "14px",

  overflowWrap: "break-word"
};

const typingStyle = {
  fontSize: "13px",
  opacity: 0.7,
  padding: "4px 10px"
};

const inputContainer = {
  display: "flex",

  padding: "14px",

  gap: "10px",

  borderTop:
    "1px solid rgba(255,255,255,0.06)"
};

const inputStyle = {
  flex: 1,

  resize: "none",

  border: "none",

  outline: "none",

  borderRadius: "14px",

  padding: "14px",

  background: "#151515",

  color: "white",

  fontSize: "14px",

  minHeight: "50px",

  maxHeight: "120px"
};

const sendButton = {
  width: "52px",

  border: "none",

  borderRadius: "14px",

  background:
    "linear-gradient(135deg,#1DB954,#15803d)",

  color: "white",

  cursor: "pointer",

  fontSize: "18px"
};