import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const inputFileRef = useRef();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [copied, setCopied] = useState(false);
  const API_URL = "https://file-sharing-yono.onrender.com";

  const uploadFile = () => {
    inputFileRef.current.click();
  };

  useEffect(() => {
    async function getImage() {
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          setError("File size exceeds 10 mb");
          setFile(null);
          setResult("");
          setTimeout(() => {
            setError("");
          }, 60000);
          return;
        }
        const data = new FormData();
        data.append("file", file);
        setError("");
        setLoading(true);
        try {
          const response = await axios.post(`${API_URL}/upload`, data);
          setResult(response.data.path);
          setTimeout(() => {
            setResult("");
          }, 60000);
        } catch (e) {
          console.log("Error: ", e.message);
          setError("Error uploading... Try again");
        } finally {
          setLoading(false);
        }
      }
    }
    getImage();
  }, [file]);

  useEffect(() => {
    if (result) {
      setCountdown(60);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setResult("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [result]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <>
      <div>
        <h1>Share files hassle-free</h1>
        <p>
          Upload the file and share the link <br />
          <i style={{ color: "white" }}>(Max file size: 10mb)</i>
        </p>
        <button onClick={uploadFile}>Upload</button>
        <input
          type="file"
          style={{ display: "none" }}
          ref={inputFileRef}
          onChange={(e) => setFile(e.target.files[0])}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <br />
        {loading ? (
          <p>Uploading... (Sit back and chill)</p>
        ) : (
          result && (
            <div>
              <p className="res">
                <i>Share this link:</i>
              </p>
              <p>
                <a href={result} target="_blank" rel="noopener noreferrer">
                  {result}
                </a>
                <span
                  onClick={copyToClipboard}
                  style={{ cursor: "pointer", marginLeft: "10px"}}
                >
                  📋(copy)
                </span>
                {copied && (
                  <span style={{ color: "green", marginLeft: "10px" }}>
                    Copied!
                  </span>
                )}
              </p>
              <p style={{ color: "red" }}>Expires in: {countdown}s</p>
            </div>
          )
        )}

        <p className="note">
          <i>
            <span style={{ color: "white" }}>Note:</span> The uploaded file will
            be automatically deleted after 1 minute
          </i>
        </p>
      </div>
    </>
  );
}

export default App;
