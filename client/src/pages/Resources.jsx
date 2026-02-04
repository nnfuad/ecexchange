import { Link, useParams } from "react-router-dom";
import { syllabus } from "../data/syllabus";
import { useState } from "react";
import UploadModal from "../components/UploadModal";

/* TEMP MOCK FILES (READ ONLY) */
const mockFiles = [
  { name: "Lecture Notes.pdf", type: "PDF" },
  { name: "Midterm Solutions.docx", type: "DOCX" },
  { name: "Formula Sheet.tex", type: "LaTeX" }
];

export default function Resources() {
  const { semesterId, courseCode } = useParams();

  /* ===============================
     SEMESTER VIEW
  =============================== */
  if (!semesterId) {
    return (
      <div style={{ padding: "40px 60px" }}>
        <h1 style={{ marginBottom: "30px" }}>Resources</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "30px"
          }}
        >
          {Object.entries(syllabus).map(([key, value]) => (
            <Link
              key={key}
              to={`/resources/${key}`}
              className="card"
              style={{
                aspectRatio: "1 / 1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "600"
              }}
            >
              {value.title}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const semester = syllabus[semesterId];
  if (!semester) {
    return <p style={{ padding: "40px" }}>Invalid semester</p>;
  }

  /* ===============================
     COURSE VIEW
  =============================== */
  if (!courseCode) {
    return (
      <div style={{ padding: "40px 60px" }}>
        <Link to="/resources" style={{ color: "#1DB954" }}>
          ← Back to semesters
        </Link>

        <h1 style={{ margin: "20px 0 30px" }}>{semester.title}</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px"
          }}
        >
          {semester.courses.map(course => {
            const safeCode = course.code.replace(" ", "-");

            return (
              <Link
                key={course.code}
                to={`/resources/${semesterId}/${safeCode}`}
                className="card"
                style={{
                  position: "relative",
                  paddingBottom: "38px"
                }}
              >
                <h3 style={{ fontSize: "15px" }}>
                  {course.code}: {course.title}
                </h3>

                {course.credits && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "14px",
                      right: "16px",
                      fontSize: "12px",
                      color: "#b3b3b3"
                    }}
                  >
                    {course.credits} credits
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  /* ===============================
     FILE VIEW
  =============================== */
  const decodedCode = courseCode.replace("-", " ");
  const course = semester.courses.find(
    c => c.code === decodedCode
  );

  if (!course) {
    return <p style={{ padding: "40px" }}>Invalid course</p>;
  }

  return (
    <div style={{ padding: "40px 60px" }}>
      <Link
        to={`/resources/${semesterId}`}
        style={{ color: "#1DB954" }}
      >
        ← Back to courses
      </Link>

      <h1 style={{ margin: "20px 0 10px" }}>
        {course.code}: {course.title}
      </h1>

      <p style={{ color: "#b3b3b3", marginBottom: "20px" }}>
        {course.credits} credits • Read-only resources
      </p>

      <div className="card">
        {mockFiles.map((file, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom:
                i !== mockFiles.length - 1
                  ? "1px solid #2a2a2a"
                  : "none"
            }}
          >
            <span>{file.name}</span>
            <span
              style={{
                fontSize: "12px",
                color: "#b3b3b3"
              }}
            >
              {file.type}
            </span>
          </div>
        ))}
      </div>

      <p
        style={{
          marginTop: "12px",
          fontSize: "13px",
          color: "#b3b3b3"
        }}
      >
        Uploading is restricted to logged-in users.
      </p>
    </div>
  );
}