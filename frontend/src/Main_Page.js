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
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");
  const [error3, setError3] = React.useState({});
  const [message, setMessage] = useState("");
  const [msg, setMsg] = React.useState({});

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
      setError("Select a file to upload");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token"); // Retrieve JWT token from localStorage
    if (!token) {
      setError("User is not authenticated. Please log in again");
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
      setMessage(response.data.message); // Set success message
      setError(""); 
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail); 
      } else {
        setError("Fail to upload the file. Please try again."); 
      }
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
    // setSearchResults([]);
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
        setError1("");
    } catch (error1) {
      if (error1.response && error1.response.data && error1.response.data.detail) {
        setError1(error1.response.data.detail); 
      } else {
        setError1("Error searching files. Please try again."); 
      }
      setSearchResults([]);
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
      setError1("");
    } catch (error1) {
      if (error1.response && error1.response.data && error1.response.data.detail) {
        setError1(error1.response.data.detail); 
      } else {
        setError1("Error searching files. Please try again."); 
      }
      setSearchResults([]);
    }
  };


  const handleDownload = async (fileId, fileName) => {
    fetch(`http://127.0.0.1:8000/api/files/download/${fileId}`)
    .then(response => response.blob())  // Convert the response to a Blob
    .then(blob => {
      const filename = fileName;  // Get the filename (you can modify this based on server response)
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);  // Create a URL for the Blob
      link.download = filename;  // Set the filename to be downloaded
      link.click();  // Trigger the download
    })
    .then(setError2(""))
    .catch(error2 => {
      if (error2.response && error2.response.data && error2.response.data.detail) {
        setError2(error2.response.data.detail); 
      } else {
        setError2("File download failed. Please try again."); 
      }
    });
  };
  const handleDelete = async (fileId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        if (error3.response && error3.response.data && error3.response.data.detail) {
          setError3((prev) => ({ ...prev, [fileId]: "" })); 
        } else {
          setError3((prev) => ({
            ...prev,
            [fileId]: error3.response.data.detail,
          })); 
        }
        return;
      }
      const response = await axios.delete(
        `http://localhost:8000/api/files/delete/${fileId}`, // Correct URL without extra brace
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token in headers
          },
        }
      );
  
      if (response.status === 200) {
        setMsg((prev) => ({
          ...prev,
          [fileId]: "file deleted successfully",
        }));
        
        setSearchResults((prevResults) =>
          prevResults.filter((file) => file.id !== fileId)
        );
        setError3((prev) => ({ ...prev, [fileId]: "" }));
      } else {
        if (error3.response && error3.response.data && error3.response.data.detail) {
          setError3((prev) => ({
            ...prev,
            [fileId]: error3.response.data.detail,
          })); 
        } else {
          setError3((prev) => ({
            ...prev,
            [fileId]: "failed to delete the file",
          }));
        }
      }
    } catch (error3) {
      if (error3.response && error3.response.data && error3.response.data.detail) {
        setError3((prev) => ({
          ...prev,
          [fileId]: error3.response.data.detail,
        })); 
      } else {
        setError3((prev) => ({
          ...prev,
          [fileId]: "failed to delete the file",
        }));
      }
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
        {message && <div style={{ color: "green" }}>{message}</div>} {/* Display success message */}
        {error && <div style={{ color: "red", marginTop: "20.5px" }}>{error}</div>}
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
      {error1 && <div style={{ color: "red", marginTop: "30px" }}>{error1}</div>}
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
            <td style={{ border: "1px solid #ddd", padding: "8px", width: "10px" }}>
              {file.file_name} ({file.category})
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{file.uploaded_by}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{file.created_at}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              <button style={{width: "65px"}} onClick={() => handleDownload(file.id, file.file_name)}>Download</button>
              <button style={{ width: "55px", marginLeft: "10px" }} onClick={() => handleDelete(file.id)}>Delete</button>
              {msg[file.id] && (
              <div style={{ color: "red", marginTop: "10px" }}>{msg[file.id]}</div>
              )}
              {error3[file.id] && (
              <div style={{ color: "red", marginTop: "10px" }}>{error3[file.id]}</div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>) : (
        <div></div> 
    )}
    </div>
      
    </div>
  );
}

export default Main_Page;