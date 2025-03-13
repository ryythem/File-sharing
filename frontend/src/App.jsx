import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const inputFileRef = useRef();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const API_URL = "http://localhost:3000";

  const uploadFile = () => {
    inputFileRef.current.click();
  };

  useEffect(() => {
    async function getImage() {
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          setError("File size exceeded. Max 10MB allowed.");
          setResult(null);
          setFile(null); 
          return;
        }

        setError(""); 

        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        try {
          const response = await axios.post(`${API_URL}/upload`, data);
          console.log(response);
          setResult(response.data.path);
        } catch (e) {
          setError("Error uploading file");
          console.log("Error:", e.message);
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
        {result && (
          <a href={result} target="_blank" rel="noopener noreferrer">
            {result}
          </a>
        )}
      </div>
    </>
  );
}

export default App;
