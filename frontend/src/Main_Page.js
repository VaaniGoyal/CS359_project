import React, { useState } from "react";
import axios from "axios";
import './index.css';
import qs from 'qs';

function Main_Page() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [category1, setCategory1] = useState([]);
  const [username, setUsername] = useState("");
  const [category, setCategory] = useState(""); 
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");

  // Function to handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  // Function to handle category selection
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  // Function to upload the file
  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token"); // Retrieve JWT token from localStorage
    if (!token) {
      alert("User is not authenticated. Please log in.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8000/api/files/upload?category=${category}`, // Append category as a parameter
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token in headers
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error.response?.data || error.message);
      alert("Failed to upload the file.");
    }
  };

  const handleCategory1Change = (event) => {
    const value = event.target.value;
    if (category1.includes(value)) {
      setCategory1(category1.filter((item) => item !== value)); // Remove category
    } else {
      setCategory1([...category1, value]); // Add category
    }
  };
  // Function to handle search
  const handleSearch = async () => {
    try {
      const params = {};
      if (name) params.name = name;
      if (category1.length > 0) {
        params.category = category1; // Include all selected categories
      }
      if (username) params.username = username;
        const response = await axios.get("http://127.0.0.1:8000/api/files/search", 
          { params , 
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
        });
        setSearchResults(response.data); // Assuming backend returns a list of files
    } catch (error) {
      console.error("Error searching files:", error.response?.data || error.message);
      alert("Failed to search for files.");
    }
  };
  const handleListSearch = async () => {
    setName(""); 
    setCategory1([]);
    setUsername("");
    try {
      const params = {};
      params.name = undefined;
      params.category = undefined;
      params.username = undefined;
      const response = await axios.get("http://127.0.0.1:8000/api/files/search", { params });
      setSearchResults(response.data); // Assuming backend returns a list of files
    } catch (error) {
      console.error("Error searching files:", error.response?.data || error.message);
      alert("Failed to search for files.");
    }
  };
  const handleDownload = async (fileId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/files/download/${fileId}`, {
        responseType: 'blob', // Ensure the response is treated as a file (binary data)
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'downloaded_file';

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading file:", error.response?.data || error.message);
      alert("Failed to download the file.");
    }
  };
  

  return (
    <div className="Main_Page">
      {/* Upload File Section */}
      <div className="upload">
        <h2>Upload a File</h2>
        <br/>
        <input className="input" type="file" onChange={handleFileChange} />
        <select value={category || ""} onChange={handleCategoryChange} style={{margin: "5px auto", padding: "5px", width: "55%", borderRadius: "5px", border: "1px solid #ccc"}}>
          <option value="" disabled> Select a category </option>
          <option value="document">Document</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <button onClick={handleFileUpload} style={{marginLeft: "10px", width: "20%"}}>Upload File</button>
      </div>

      {/* Search Section */}
      <div className="search">
      <h2 style={{ marginRight: "200px" }}>Search Files</h2>
      <br/>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{marginRight: "50px", marginLeft: "10px"}}
          />
        </label>
        <label>
          Uploaded By:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{marginLeft: "10px"}}
          />
        </label>
      </div>
      <br/>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <h3 style={{ margin: 0 }}>Categories:</h3>
        <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <input
            type="checkbox"
            value="document"
            onChange={handleCategory1Change}
          />
          Document
        </label>
        <label>
          <input
            type="checkbox"
            value="image"
            onChange={handleCategory1Change}
          />
          Image
        </label>
        <label>
          <input
            type="checkbox"
            value="video"
            onChange={handleCategory1Change}
          />
          Video
        </label>
        <button onClick={handleSearch} style={{width: "15%"}}>Search</button>
        <button onClick={handleListSearch} style={{width: "15%"}}>List all files</button>
      </div>

      {error && <div>{error}</div>}
      <br/><br/>
      {searchResults.length > 0 ? (
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>File Name (Category)</th>
          <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Owner</th>
          <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Timestamp</th>
          <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {searchResults.map((file)=> (
          <tr key={file.id}>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {file.file_name} ({file.category})
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{file.uploaded_by}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{file.created_at}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              <button onClick={() => handleDownload(file.id)}>Download</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>) : (
        <div>No files found.</div> 
    )}
    </div>
      
    </div>
  );
}

export default Main_Page;