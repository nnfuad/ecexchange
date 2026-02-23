import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";
import UploadModal from "../components/UploadModal";

const BASE_URL = "http://localhost:5050";

export default function Resources() {
  const { semesterId, courseCode } = useParams();
  const token = localStorage.getItem("token");

  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Safely derive semester and course
  const semester = semesterId ? syllabus[semesterId] : null;
  const decodedCode = courseCode?.replace("-", " ");
  const course = semester?.courses?.find(
    (c) => c.code === decodedCode
  );

  /* ===============================
     FETCH FILES SAFELY
  =============================== */
  useEffect(() => {
    if (!semesterId || !courseCode) return;

    const fetchFiles = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${BASE_URL}/api/resources/${semesterId}/${courseCode}`
        );

        const data = await res.json();
        setFiles(data);
      } catch (err) {
        console.error("Failed to fetch files:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [semesterId, courseCode]);

  /* ===============================
     SEMESTER VIEW
  =============================== */
  if (!semesterId) {
    return (
      <div style={{ padding: "40px 60px", width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "30px",
            alignItems: "center"
          }}
        >
          <h1>Resources</h1>
          {token && (
            <button onClick={() => setShowUpload(true)}>
              Upload Resource
            </button>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
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
                fontWeight: "600",
                textAlign: "center"
              }}
            >
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

  /* ===============================
     INVALID SEMESTER GUARD
  =============================== */
  if (!semester) {
    return (
      <p style={{ padding: "40px" }}>
        Invalid semester
      </p>
    );
  }

  /* ===============================
     COURSE VIEW
  =============================== */
  if (!courseCode) {
    return (
      <div style={{ padding: "40px 60px", width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            alignItems: "center"
          }}
        >
          <Link to="/resources" style={{ color: "#1DB954" }}>
            ← Back to semesters
          </Link>

          {token && (
            <button onClick={() => setShowUpload(true)}>
              Upload Resource
            </button>
          )}
        </div>

        <h1 style={{ marginBottom: "30px" }}>
          {semester.title}
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px"
          }}
        >
          {semester.courses.map((c) => {
            const safeCode = c.code.replace(" ", "-");

            return (
              <Link
                key={c.code + c.title}
                to={`/resources/${semesterId}/${safeCode}`}
                className="card"
                style={{
                  position: "relative",
                  paddingBottom: "38px"
                }}
              >
                <h3 style={{ fontSize: "15px" }}>
                  {c.code}: {c.title}
                </h3>

                {c.credits && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "14px",
                      right: "16px",
                      fontSize: "12px",
                      color: "#b3b3b3"
                    }}
                  >
                    {c.credits} credits
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {showUpload && (
          <UploadModal onClose={() => setShowUpload(false)} />
        )}
      </div>
    );
  }

  /* ===============================
     INVALID COURSE GUARD
  =============================== */
  if (!course) {
    return (
      <p style={{ padding: "40px" }}>
        Invalid course
      </p>
    );
  }

  /* ===============================
     FILE VIEW
  =============================== */
  return (
    <div style={{ padding: "40px 60px", width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
          alignItems: "center"
        }}
      >
        <Link
          to={`/resources/${semesterId}`}
          style={{ color: "#1DB954" }}
        >
          ← Back to courses
        </Link>

        {token && (
          <button onClick={() => setShowUpload(true)}>
            Upload Resource
          </button>
        )}
      </div>

      <h1 style={{ marginBottom: "6px" }}>
        {course.code}: {course.title}
      </h1>

      <p
        style={{
          color: "#b3b3b3",
          marginBottom: "20px"
        }}
      >
        {course.credits} credits • Read-only resources
      </p>

      <div className="card">
        {loading && <p>Loading files...</p>}

        {!loading && files.length === 0 && (
          <p style={{ color: "#b3b3b3" }}>
            No files uploaded for this course yet.
          </p>
        )}

        {!loading &&
          files.map((file, i) => (
            <div
              key={file._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom:
                  i !== files.length - 1
                    ? "1px solid #2a2a2a"
                    : "none"
              }}
            >
              <a
                href={`${BASE_URL}${file.filePath.replace(
                  /\\/g,
                  "/"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1DB954" }}
              >
                {file.originalName}
              </a>

              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#b3b3b3"
                  }}
                >
                  {file.fileType}
                </div>

                {file.uploadedBy?.name && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#888",
                      marginTop: "2px"
                    }}
                  >
                    uploaded by {file.uploadedBy.name}
                  </div>
                )}
              </div>
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
        Files are read-only. Uploads are available to
        logged-in users only.
      </p>

      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} />
      )}
    </div>
  );
}