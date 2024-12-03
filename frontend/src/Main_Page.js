import React, { useState } from "react";
import axios from "axios";

function Main_Page() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("document"); // Default category
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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

  // Function to handle search
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/search?query=${searchQuery}`);
      setSearchResults(response.data.files); // Assuming backend returns a list of files
    } catch (error) {
      console.error("Error searching files:", error.response?.data || error.message);
      alert("Failed to search for files.");
    }
  };

  return (
    <div className="Main_Page">
      {/* Upload File Section */}
      <div>
        <h2>Upload a File</h2>
        <input type="file" onChange={handleFileChange} />
        <select value={category} onChange={handleCategoryChange}>
          <option value="document">Document</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <button onClick={handleFileUpload}>Upload File</button>
      </div>

      {/* Search Section */}
      <div>
        <h2>Search Files</h2>
        <input
          type="text"
          placeholder="Search for files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Search Results Table */}
      {searchResults.length > 0 && (
        <div>
          <h3>Search Results</h3>
          <table border="1">
            <thead>
              <tr>
                <th>File Name</th>
                <th>File Size</th>
                <th>Uploaded By</th>
                <th>Category</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((file) => (
                <tr key={file.id}>
                  <td>{file.name}</td>
                  <td>{file.size}</td>
                  <td>{file.uploader}</td>
                  <td>{file.category}</td>
                  <td>
                    <a href={file.downloadLink} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Main_Page;