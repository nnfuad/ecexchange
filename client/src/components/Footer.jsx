export default function Footer() {
  return (
    <footer
      style={{
        background: "#181818",
        padding: "24px 16px",
        textAlign: "center",
        color: "#b3b3b3",
        borderTop: "1px solid #2a2a2a",
        marginTop: "60px"
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            lineHeight: "1.6"
          }}
        >
          © {new Date().getFullYear()} eceXchange
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "13px",
            lineHeight: "1.8",
            maxWidth: "700px"
          }}
        >
          Built by{" "}
          <a
            href="https://www.linkedin.com/in/nnfuad01/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#1DB954",
              textDecoration: "none"
            }}
          >
            Fuad
          </a>
          , for{" "}
          <a
            href="https://www.ece.ruet.ac.bd/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#1DB954",
              textDecoration: "none"
            }}
          >
            ECE
          </a>
          {' '}• Academic use only
        </p>
      </div>
    </footer>
  );
}