import { useState } from "react";
import { syllabus } from "../data/syllabus";

export default function UploadModal({ onClose }) {
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");
  const [file, setFile] = useState(null);

  const courses =
    semester && syllabus[semester]
      ? syllabus[semester].courses
      : [];

  const handleSubmit = async e => {
  e.preventDefault();

  if (!semester || !course || !file) {
    alert("Please select semester, course and file");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in");
      return;
    }

    const formData = new FormData();
    formData.append("semester", semester);
    formData.append("courseCode", course);
    formData.append("file", file);

    const res = await fetch("http://localhost:5050/api/resources/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Upload failed");
    }

    alert("File uploaded successfully");
    onClose();
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div style={overlayStyle}>
      <div style={modalStyle} className="card">
        <h2 style={{ marginBottom: "16px" }}>Upload Resource</h2>

        <form onSubmit={handleSubmit}>
          {/* SEMESTER */}
          <label>Semester</label>
          <select
            value={semester}
            onChange={e => {
              setSemester(e.target.value);
              setCourse("");
            }}
            style={inputStyle}
          >
            <option value="">Select semester</option>
            {Object.entries(syllabus).map(([key, val]) => (
              <option key={key} value={key}>
                {val.title}
              </option>
            ))}
          </select>

          {/* COURSE */}
          <label>Course / Category</label>
          <select
            value={course}
            onChange={e => setCourse(e.target.value)}
            style={inputStyle}
            disabled={!semester}
          >
            <option value="">Select course</option>
            {courses.map(c => (
              <option key={c.code} value={c.code}>
                {c.code}: {c.title}
              </option>
            ))}
          </select>

          {/* FILE */}
          <label>File</label>
          <input
            type="file"
            onChange={e => setFile(e.target.files[0])}
            style={{ marginBottom: "16px" }}
          />

          {/* ACTIONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px"
            }}
          >
            <button
              type="button"
              className="secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit">Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modalStyle = {
  width: "420px",
  maxWidth: "90%",
  padding: "24px"
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "14px",
  background: "#181818",
  color: "white",
  border: "1px solid #2a2a2a",
  borderRadius: "6px"
};