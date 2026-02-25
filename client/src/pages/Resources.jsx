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
  const [searchTerm, setSearchTerm] = useState("");

  /* ===============================
     SAFE TOKEN DECODE
  =============================== */
  let currentUserId = null;

  try {
    if (token) {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );
      currentUserId = payload.id;
    }
  } catch (err) {
    console.error("Token decode failed:", err);
    currentUserId = null;
  }

  /* ===============================
     DERIVE SEMESTER + COURSE SAFELY
  =============================== */
  const semester = semesterId
    ? syllabus[semesterId]
    : null;

  const decodedCode = courseCode
    ? courseCode.replace("-", " ")
    : null;

  const course = semester?.courses?.find(
    (c) => c.code === decodedCode
  );

  /* ===============================
     FETCH FILES
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

        if (Array.isArray(data)) {
          setFiles(data);
        } else {
          setFiles([]);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [semesterId, courseCode]);

  /* ===============================
     SEMESTER LIST VIEW
  =============================== */
  if (!semesterId) {
    return (
      <div style={{ padding: "40px 60px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
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
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "30px",
            marginTop: "30px"
          }}
        >
          {Object.entries(syllabus).map(
            ([key, value]) => (
              <Link
                key={key}
                to={`/resources/${key}`}
                className="card"
              >
                {value.title}
              </Link>
            )
          )}
        </div>

        {showUpload && (
          <UploadModal
            onClose={() => setShowUpload(false)}
          />
        )}
      </div>
    );
  }

  /* ===============================
     INVALID SEMESTER
  =============================== */
  if (!semester) {
    return (
      <p style={{ padding: "40px" }}>
        Invalid semester
      </p>
    );
  }

  /* ===============================
     COURSE LIST VIEW
  =============================== */
  if (!courseCode) {
    return (
      <div style={{ padding: "40px 60px" }}>
        <Link to="/resources">
          ← Back to semesters
        </Link>

        <h1 style={{ marginTop: "20px" }}>
          {semester.title}
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginTop: "30px"
          }}
        >
          {semester.courses.map((c) => {
            const safeCode = c.code.replace(
              " ",
              "-"
            );

            return (
              <Link
                key={c.code + c.title}
                to={`/resources/${semesterId}/${safeCode}`}
                className="card"
              >
                <strong>
                  {c.code}
                </strong>
                <br />
                {c.title}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  /* ===============================
     INVALID COURSE
  =============================== */
  if (!course) {
    return (
      <p style={{ padding: "40px" }}>
        Invalid course
      </p>
    );
  }

  /* ===============================
     FILTER FILES
  =============================== */
  const filteredFiles = files.filter(
    (file) =>
      file.originalName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  /* ===============================
     FILE VIEW
  =============================== */
  return (
    <div style={{ padding: "40px 60px" }}>
      <Link
        to={`/resources/${semesterId}`}
      >
        ← Back to courses
      </Link>

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
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        style={{
          marginTop: "20px",
          padding: "10px",
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #333",
          background: "#111",
          color: "white"
        }}
      />

      <div
        className="card"
        style={{ marginTop: "20px" }}
      >
        {loading && <p>Loading...</p>}

        {!loading &&
          filteredFiles.length === 0 && (
            <p style={{ color: "#888" }}>
              No files found.
            </p>
          )}

        {!loading &&
          filteredFiles.map((file) => (
            <div
              key={file._id}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                padding: "12px 0",
                borderBottom:
                  "1px solid #222"
              }}
            >
              <a
                href={`${BASE_URL}${file.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.originalName}
              </a>

              <div
                style={{
                  textAlign: "right"
                }}
              >
                <div
                  style={{
                    fontSize: "12px"
                  }}
                >
                  {file.fileType}
                </div>

                {file.uploadedBy
                  ?.name && (
                  <div
                    style={{
                      fontSize:
                        "11px",
                      color:
                        "#888"
                    }}
                  >
                    uploaded by{" "}
                    {
                      file
                        .uploadedBy
                        .name
                    }
                  </div>
                )}

                {currentUserId &&
                  file.uploadedBy
                    ?._id ===
                    currentUserId && (
                    <button
                      onClick={async () => {
                        if (
                          !window.confirm(
                            "Delete this file?"
                          )
                        )
                          return;

                        await fetch(
                          `${BASE_URL}/api/resources/${file._id}`,
                          {
                            method:
                              "DELETE",
                            headers:
                              {
                                Authorization:
                                  `Bearer ${token}`
                              }
                          }
                        );

                        setFiles(
                          files.filter(
                            (f) =>
                              f._id !==
                              file._id
                          )
                        );
                      }}
                      style={{
                        fontSize:
                          "11px",
                        background:
                          "#400",
                        color:
                          "white",
                        border:
                          "none",
                        padding:
                          "4px 8px",
                        borderRadius:
                          "6px",
                        marginTop:
                          "6px",
                        cursor:
                          "pointer"
                      }}
                    >
                      Delete
                    </button>
                  )}
              </div>
            </div>
          ))}
      </div>

      {showUpload && (
        <UploadModal
          onClose={() =>
            setShowUpload(false)
          }
        />
      )}
    </div>
  );
}