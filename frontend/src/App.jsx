import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const inputFileRef = useRef();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = "http://localhost:3000";

  const uploadFile = () => {
    inputFileRef.current.click();
  };

  useEffect(() => {
    async function getImage() {
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          setError("File size exceeds 10 mb");
          setFile(null);
          setResult(null);
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

  return (
    <>
      <div>
        <h1>Share files hassle-free</h1>
        <p>Upload the file and share the link</p>
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
          <p>Uploading</p>
        ) : (
          result && (
            <a href={result} target="_blank" rel="noopener noreferrer">
              {result}
            </a>
          )
        )}
      </div>
    </>
  );
}

export default App;
