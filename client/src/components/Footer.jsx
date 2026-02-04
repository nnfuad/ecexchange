export default function Footer() {
  return (
    <footer
      style={{
        background: "#181818",
        padding: "20px",
        textAlign: "center",
        color: "#b3b3b3",
        borderTop: "1px solid #2a2a2a",
        marginTop: "60px"
      }}
    >
      <p style={{ margin: "6px 0" }}>
        © {new Date().getFullYear()} eceXchange
      </p>
      <p style={{ margin: "6px 0", fontSize: "13px" }}>
        Built by <a href = "https://www.linkedin.com/in/nnfuad01/">Fuad</a>, for <a>ECE</a> • Academic use only
      </p>
    </footer>
  );
}