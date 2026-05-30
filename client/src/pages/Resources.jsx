import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";
import UploadModal from "../components/UploadModal";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5050";

export default function Resources() {
  const { semesterId, courseCode } = useParams();
  const token = localStorage.getItem("token");

  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [globalSearch, setGlobalSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [globalResults, setGlobalResults] = useState([]);

  let currentUserId = null;

  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUserId = payload.id;
    }
  } catch {
    currentUserId = null;
  }

  const semester = semesterId ? syllabus[semesterId] : null;
  const decodedCode = courseCode ? courseCode.replace(/-/g, " ") : null;
  const course = semester?.courses?.find((c) => c.code === decodedCode);

  /* ---------------- FETCH FILES ---------------- */

  useEffect(() => {
    if (!semesterId || !courseCode) return;

    const fetchFiles = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${BASE_URL}/api/resources/${semesterId}/${courseCode}`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setFiles(data);
        } else {
          setFiles([]);
        }
      } catch {
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [semesterId, courseCode]);

  /* ---------------- FILE URL HELPER ---------------- */

  const getFileURL = (file) => {
    if (file.fileUrl) return file.fileUrl;
    if (file.filePath) return `${BASE_URL}${file.filePath}`;
    return "#";
  };

  /* ---------------- GLOBAL SEARCH ---------------- */

  const handleGlobalSearch = async () => {
    try {
      const query = new URLSearchParams({
        search: globalSearch,
        semester: filterSemester,
        type: filterType
      }).toString();

      const res = await fetch(`${BASE_URL}/api/resources?${query}`);
      const data = await res.json();

      setGlobalResults(Array.isArray(data) ? data : []);
    } catch {
      setGlobalResults([]);
    }
  };

  /* ---------------- SEMESTER VIEW ---------------- */

  if (!semesterId) {
    return (
      <div
        style={{
          padding: "30px 16px",
          maxWidth: "1200px",
          margin: "0 auto",
          boxSizing: "border-box"
        }}
      >
        <div style={headerRow}>
          <h1>Resources</h1>

          {token && (
            <button onClick={() => setShowUpload(true)}>
              Upload Resource
            </button>
          )}
        </div>

        <div style={{ marginTop: "30px" }}>
          <input
            placeholder="Search resources..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            style={searchInput}
          />

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px"
            }}
          >
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Semesters</option>

              {Object.entries(syllabus).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.title}
                </option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Types</option>
              <option value="pdf">PDF</option>
              <option value="doc">DOC/DOCX</option>
              <option value="ppt">PPT/PPTX</option>
              <option value="tex">LaTeX</option>
            </select>

            <button onClick={handleGlobalSearch}>Search</button>
          </div>
        </div>

        {globalResults.length > 0 && (
          <div className="card" style={{ marginTop: "30px" }}>
            {globalResults.map((file) => (
              <div key={file._id} style={fileRow}>
                <a
                  href={getFileURL(file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#4da6ff",
                    textDecoration: "none",
                    wordBreak: "break-word",
                    flex: 1,
                    minWidth: "220px",
                    lineHeight: "1.6"
                  }}
                >
                  {file.originalName}
                </a>

                <div style={{ fontSize: "12px", color: "#888" }}>
                  {file.semester} • {file.courseCode}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={semesterGrid}>
          {Object.entries(syllabus).map(([key, value]) => (
            <Link key={key} to={`/resources/${key}`} className="card">
              {value.title}
            </Link>
          ))}
        </div>

        {showUpload && (
          <UploadModal onClose={() => setShowUpload(false)} />
        )}
      </div>
    );
  }

  if (!semester) return <p style={{ padding: "40px" }}>Invalid semester</p>;

  /* ---------------- COURSE LIST ---------------- */

  if (!courseCode) {
    return (
      <div
        style={{
          padding: "30px 16px",
          maxWidth: "1200px",
          margin: "0 auto",
          boxSizing: "border-box"
        }}
      >
        <Link to="/resources">← Back</Link>

        <h1 style={{ marginTop: "20px" }}>{semester.title}</h1>

        <div style={courseGrid}>
          {semester.courses.map((c) => {
            const safeCode = c.code.replace(" ", "-");

            return (
              <Link
                key={c.code}
                to={`/resources/${semesterId}/${safeCode}`}
                className="card"
              >
                <strong>{c.code}</strong>
                <br />
                {c.title}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  if (!course) return <p style={{ padding: "40px" }}>Invalid course</p>;

  const filteredFiles = files.filter((file) =>
    file.originalName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------- FILE VIEW ---------------- */

  return (
    <div
      style={{
        padding: "30px 16px",
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box"
      }}
    >
      <Link to={`/resources/${semesterId}`}>← Back</Link>

      <h1 style={{ marginTop: "20px" }}>
        {course.code}: {course.title}
      </h1>

      {token && (
        <button
          style={{ marginTop: "10px" }}
          onClick={() => setShowUpload(true)}
        >
          Upload Resource
        </button>
      )}

      <input
        type="text"
        placeholder="Search within this course..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchInput}
      />

      <div className="card" style={{ marginTop: "20px" }}>
        {loading && <p>Loading...</p>}

        {!loading && filteredFiles.length === 0 && (
          <p style={{ color: "#888" }}>No files found.</p>
        )}

        {!loading &&
          filteredFiles.map((file) => (
            <div key={file._id} style={fileRow}>
              <a
                href={getFileURL(file)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#4da6ff",
                  textDecoration: "none",
                  wordBreak: "break-word",
                  flex: 1,
                  minWidth: "220px",
                  lineHeight: "1.6"
                }}
              >
                {file.originalName}
              </a>

              <div
                style={{
                  textAlign: "right",
                  minWidth: "120px",
                  width: "100%"
                }}
              >
                <div style={{ fontSize: "12px" }}>{file.fileType}</div>

                {file.uploadedBy?.name && (
                  <div style={{ fontSize: "11px", color: "#888" }}>
                    uploaded by {file.uploadedBy.name}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} />
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap"
};

const semesterGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "20px",
  marginTop: "40px"
};

const courseGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
  marginTop: "30px"
};

const searchInput = {
  marginTop: "20px",
  padding: "12px",
  width: "100%",
  borderRadius: "8px",
  border: "1px solid #333",
  background: "#111",
  color: "white",
  boxSizing: "border-box",
  fontSize: "16px"
};

const selectStyle = {
  padding: "10px",
  marginRight: "10px",
  marginBottom: "10px",
  background: "#111",
  border: "1px solid #333",
  borderRadius: "6px",
  color: "white",
  width: "100%",
  maxWidth: "260px",
  boxSizing: "border-box"
};

const fileRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "14px",
  padding: "14px 0",
  borderBottom: "1px solid #222",
  flexWrap: "wrap",
  overflowWrap: "anywhere"
};