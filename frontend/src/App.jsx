import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const inputFileRef = useRef();
  const [file, setFile] = useState("");
  const [result, setResult] = useState([]);
  const API_URL = "http://localhost:3000";
  const uploadFile = () => {
    inputFileRef.current.click();
  };

  useEffect(() => {
    async function getImage() {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        try {
          const response = await axios.post(`${API_URL}/upload`, data);
          console.log(response);
          setResult(response.data.path);
        } catch (e) {
          console.log("Error : ", e.message);
        }
      }
    }
    getImage();
  }, [file]);
  return (
    <>
      <div>
        <h1>Share files hassel free</h1>
        <p>Upload the file and share the link</p>
        <button onClick={uploadFile}>Upload</button>
        <input
          type="file"
          style={{ display: "none" }}
          ref={inputFileRef}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <a href={result} target="_blank">
          {result}
        </a>
      </div>
    </>
  );
}

export default App;
