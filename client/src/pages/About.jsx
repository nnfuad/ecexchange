export default function About() {
  return (
    <div
      style={{
        width: "100%",
        padding: "80px 60px"
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "50px" }}>About the Platform</h1>

        {/* ================= CARD GRID ================= */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px"
          }}
        >
          {/* ================= CARD 1 ================= */}
          <div className="glass-card">
            <h3>Department of ECE, RUET</h3>
            <p>
              The Department of Electrical & Computer Engineering (ECE) at
              Rajshahi University of Engineering & Technology (RUET) aims to
              produce skilled engineers with strong foundations in electronics,
              communication systems, computing, and applied engineering.
            </p>
            <p>
              The department emphasizes academic excellence, research
              orientation, innovation, and ethical engineering practices to
              prepare students for both industry and higher studies.
            </p>
          </div>

          {/* ================= CARD 2 ================= */}
          <div className="glass-card">
            <h3>Where We Are Located</h3>

            <div
              style={{
                width: "100%",
                height: "260px",
                borderRadius: "14px",
                overflow: "hidden",
                marginTop: "12px"
              }}
            >
              <iframe
                title="ECE Department RUET"
                src="https://www.google.com/maps?q=ECE%20Department%20RUET&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* ================= CARD 3 ================= */}
          <div className="glass-card">
            <h3>Academic Project</h3>
            <p>
              This platform was developed as a project of the
              <strong> Third Year Odd Semester</strong> by
              <strong> Nur Nafis Fuad</strong>, an undergraduate student of the
              Department of Electrical & Computer Engineering, RUET.
            </p>
            <p>
              The project was carried out under the supervision of
              <strong> Md. Omaer Faruq Goni</strong>, Assistant Professor,
              Department of ECE, RUET.
            </p>
          </div>

          {/* ================= CARD 4 ================= */}
          <div className="glass-card">
            <h3>Vision & Future Development</h3>
            <p>
              The primary aim of this website is to provide a centralized,
              organized, and secure platform for intra-departmental resource
              sharing among ECE students.
            </p>
            <p>
              Future plans include extending this platform into an
              <strong> intra-department reselling system</strong>, where students
              can exchange academic goods such as books, lab equipment, and
              study materials in a trusted academic environment.
            </p>
          </div>
        </div>
      </div>

      {/* ================= INLINE GLASS STYLE ================= */}
      <style>{`
        .glass-card {
          background: rgba(24, 24, 24, 0.55);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: 18px;
          padding: 26px;
          border: 1px solid rgba(29, 185, 84, 0.25);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
          transition: transform 0.25s ease, border 0.25s ease;
        }

        .glass-card:hover {
          transform: translateY(-6px);
          border: 1px solid rgba(29, 185, 84, 0.55);
        }

        .glass-card h3 {
          color: #1DB954;
          margin-bottom: 14px;
        }

        .glass-card p {
          color: #b3b3b3;
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
}