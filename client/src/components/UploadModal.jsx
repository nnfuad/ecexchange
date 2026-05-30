import { useState } from "react";
import { syllabus } from "../data/syllabus";

export default function UploadModal({ onClose }) {
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");
  const [file, setFile] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const courses =
    semester && syllabus[semester]
      ? syllabus[semester].courses
      : [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!semester || !course || !file) {
      alert("Please select semester, course and file");
      return;
    }

    if (!agreed) {
      alert("You must agree to the community standards");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in");
        return;
      }

      const formData = new FormData();
      formData.append("semesterId", semester);
      formData.append("courseCode", course);
      formData.append("file", file);

      const res = await fetch(
        "https://ecexchange-api.onrender.com/api/resources/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      const text = await res.text();

      console.log("UPLOAD RESPONSE:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Server returned invalid response. Check Render logs."
        );
      }

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      alert("File uploaded successfully");
      onClose();
    } catch (err) {
      console.error("UPLOAD FRONTEND ERROR:", err);
      alert(err.message || "Upload failed");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle} className="card">
        <h2 style={{ marginBottom: "16px" }}>
          Upload Resource
        </h2>

        <form onSubmit={handleSubmit}>
          {/* SEMESTER */}
          <label>Semester</label>
          <select
            value={semester}
            onChange={(e) => {
              setSemester(e.target.value);
              setCourse("");
            }}
            style={inputStyle}
          >
            <option value="">Select semester</option>
            {Object.entries(syllabus).map(
              ([key, val]) => (
                <option key={key} value={key}>
                  {val.title}
                </option>
              )
            )}
          </select>

          {/* COURSE */}
          <label>Course / Category</label>
          <select
            value={course}
            onChange={(e) =>
              setCourse(e.target.value)
            }
            style={inputStyle}
            disabled={!semester}
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option
                key={c.code}
                value={c.code}
              >
                {c.code}: {c.title}
              </option>
            ))}
          </select>

          {/* FILE */}
          <label>File</label>
          <input
            type="file"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
            style={{ marginBottom: "16px" }}
          />

          {/* COMMUNITY WARNING */}
          <div
            style={{
              fontSize: "13px",
              color: "#b3b3b3",
              marginBottom: "10px"
            }}
          >
            <ul>
              <li>
                Academic content only.
              </li>
              <li>
                No copyrighted material
                without permission.
              </li>
              <li>
                No harmful or malicious
                files.
              </li>
              <li>
                No offensive or
                inappropriate content.
              </li>
            </ul>
          </div>

          <label
            style={{
              fontSize: "13px",
              display: "block",
              marginBottom: "16px"
            }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={() =>
                setAgreed(!agreed)
              }
            />{" "}
            I agree to the community
            standards
          </label>

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
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!agreed}
            >
              Upload
            </button>
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