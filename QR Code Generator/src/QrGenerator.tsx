// import React, { useState } from "react";
// import QRCode from "react-qr-code";

// const QrGenerator: React.FC = () => {
//   const [link, setLink] = useState<string>("");

//   return (
//     <div style={{ padding: "20px", textAlign: "center" }}>
//       <h2>Drive Link to QR Code</h2>

//       <input
//         type="text"
//         placeholder="Paste your Google Drive link here"
//         value={link}
//         onChange={(e) => setLink(e.target.value)}
//         style={{
//           width: "300px",
//           padding: "10px",
//           fontSize: "16px",
//         }}
//       />

//       {link && (
//         <div style={{ marginTop: "20px", background: "white", padding: "16px" }}>
//           <QRCode value={link} size={200} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default QrGenerator;
import React, { useRef, useState } from "react";
import QRCode from "react-qr-code";

const QrGenerator: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [link, setLink] = useState<string>("");

  // Use ref for the SVG element
  const qrRef = useRef<SVGSVGElement | null>(null);

  const generateQR = () => {
    setLink(input);
  };

  const downloadQR = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current;
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 300;
    canvas.height = 300;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const png = canvas.toDataURL("image/png");

      const a = document.createElement("a");
      a.href = png;
      a.download = "qr-code.png";
      a.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Drive Link → QR Code</h2>

      <input
        type="text"
        placeholder="Paste Google Drive link"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={styles.input}
      />

      <button
        onClick={generateQR}
        style={{
          ...styles.button,
          opacity: input ? 1 : 0.5,
        }}
        disabled={!input}
      >
        Generate QR
      </button>

      {link && (
        <div style={styles.qrBox}>
          <QRCode value={link} size={200} ref={qrRef as any} />

          <button
            onClick={downloadQR}
            style={{ ...styles.button, marginTop: "16px" }}
          >
            Download QR
          </button>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f7fb",
    gap: "12px",
  },
  title: {
    marginBottom: "10px",
  },
  input: {
    width: "340px",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 18px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#4f46e5",
    color: "#fff",
    transition: "transform 0.1s ease",
  },
  qrBox: {
    marginTop: "20px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
};

export default QrGenerator;
