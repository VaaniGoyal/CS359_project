import React, { useState } from "react";
import axios from "axios";

function Main_Page() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [category1, setCategory1] = useState([]);
  const [uploadedBy, setUploadedBy] = useState("");
  const [category, setCategory] = useState("document"); 
  const [searchQuery, setSearchQuery] = useState("");
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
        const params = {
            name,
            category: category1.length > 0 ? category1 : undefined, // Only add category if it's selected
            uploaded_by: uploadedBy || undefined, // Only add uploadedBy if it's provided
        };
        const response = await axios.get("http://127.0.0.1:8000/api/files/search", { params });
        setSearchResults(response.data); // Assuming backend returns a list of files
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
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Uploaded By:
          <input
            type="text"
            value={uploadedBy}
            onChange={(e) => setUploadedBy(e.target.value)}
          />
        </label>
      </div>

      <div>
        <h3>Categories:</h3>
        <label>
          <input
            type="checkbox"
            value="document"
            onChange={handleCategoryChange}
          />
          Document
        </label>
        <label>
          <input
            type="checkbox"
            value="image"
            onChange={handleCategoryChange}
          />
          Image
        </label>
        <label>
          <input
            type="checkbox"
            value="video"
            onChange={handleCategoryChange}
          />
          Video
        </label>
      </div>

      <button onClick={handleSearch}>Search</button>

      {error && <div>{error}</div>}

      {searchResults && (
        <div>
          <h3>Search Results</h3>
          <ul>
            {searchResults.map((file) => (
              <li key={file.id}>
                {file.file_name} ({file.category})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
      
    </div>
  );
}

export default Main_Page;