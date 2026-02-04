import { useEffect, useState } from "react";

const quotes = [
  "Education is not the learning of facts, but the training of the mind to think.",
  "Study while others are sleeping. Work while others are loafing.",
  "Engineering is the art of directing the great sources of power in nature.",
  "The future belongs to those who learn more skills and combine them creatively.",
  "Success is the sum of small efforts repeated day in and day out."
];

const bgImages = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7"
];

export default function Home() {
  const [quote, setQuote] = useState("");
  const [bgIndex, setBgIndex] = useState(0);
  const firstName = localStorage.getItem("userName");

  // Random quote on refresh
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // Background slider every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % bgImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {/* ================= HERO SECTION ================= */}
      <section
        style={{
          position: "relative",
          minHeight: "calc(100vh - 140px)",
          overflow: "hidden"
        }}
      >
        {/* BACKGROUND SLIDES */}
        {bgImages.map((img, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(
                rgba(0,0,0,0.75),
                rgba(0,0,0,0.75)
              ), url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: index === bgIndex ? 1 : 0,
              transition: "opacity 1.2s ease-in-out"
            }}
          />
        ))}

        {/* HERO CONTENT */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "80px 60px",
            maxWidth: "900px"
          }}
        >
          {firstName && (
            <h2 style={{ color: "#1DB954", marginBottom: "12px" }}>
              Hello {firstName}, welcome to ECE’s resource sharing world
            </h2>
          )}

          <h1 style={{ fontSize: "3.5rem", lineHeight: "1.2" }}>
            Study smarter. <br /> Learn together.
          </h1>

          <p
            style={{
              color: "#b3b3b3",
              fontSize: "1.2rem",
              marginTop: "22px",
              maxWidth: "700px"
            }}
          >
            {quote}
          </p>
        </div>
      </section>

      {/* ================= WHY THIS PLATFORM ================= */}
      <section
        style={{
          background: "#121212",
          padding: "90px 60px"
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.4rem", marginBottom: "36px" }}>
            Why this platform?
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "32px"
            }}
          >
            {[
              {
                title: "Centralized Notes",
                desc: "All semester-wise ECE resources, structured and easy to find."
              },
              {
                title: "Student Driven",
                desc: "Built by ECE students, for collaborative learning."
              },
              {
                title: "Focused Environment",
                desc: "No distractions. Just learning, sharing, and growth."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="card"
              >
                <h3 style={{ color: "#1DB954", marginBottom: "10px" }}>
                  {item.title}
                </h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        style={{
          background: "#181818",
          padding: "90px 60px"
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.4rem", marginBottom: "36px" }}>
            How it works
          </h2>

          <ol
            style={{
              color: "#b3b3b3",
              fontSize: "1.1rem",
              lineHeight: "1.9",
              paddingLeft: "20px"
            }}
          >
            <li>Sign up with OTP verification</li>
            <li>Browse year & semester wise resources</li>
            <li>Upload notes to help others</li>
            <li>Search smarter, study faster</li>
            <li>Grow together as a community</li>
          </ol>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section
        style={{
          background: "#121212",
          padding: "90px 60px",
          textAlign: "center"
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.6rem", marginBottom: "20px" }}>
            Built for focused learners
          </h2>

          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "28px"
            }}
          >
            This is not social media. This is a calm, academic space designed
            to help you learn better and faster.
          </p>

          <p style={{ color: "#1DB954", fontSize: "1.1rem" }}>
            Learn • Share • Grow
          </p>
        </div>
      </section>
    </div>
  );
}