import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Create_Account() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleCreateClick = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/user/register", {
        username: username,
        email: email,
        password: password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/Main_Page"); 
    } catch (error) {
      setError("Account creation failed. Please try again.");
    }
  };

  return (
    <div className="Create_Account">
      <div class="box">
        <h4 className="head1">REGISTER<br/></h4>
        <span>Username</span>
        <input type="text" class="textbox1" placeholder="enter username..." value={username} onChange={(e) => setUsername(e.target.value)} />
        <span>Email Address</span>
        <input type="text" class="textbox1" placeholder="enter email..." value={email} onChange={(e) => setEmail(e.target.value)} />
        <span>Password</span>
        <input type="password" class="textbox1" placeholder="enter password..." value={password} onChange={(e) => setPassword(e.target.value)} />
        <br/>
        <button className="btn1" onClick={handleCreateClick}>Register</button>
        {error && <div style={{ color: "red", marginTop: "-27.5px" }}>{error}</div>}
      </div>
    </div>
  );
}

export default Create_Account;