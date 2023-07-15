import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css'; // Import the CSS file

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleGenerateOtp = async () => {
    try {
      const res = await axios.post("http://localhost:3000/login", { "email": email });
      if (res.status === 200) {
        setShowOtpInput(true);
        setOtpSent(true);
        setMessage(res.data.message);
      }
    } catch (e) {
      setMessage(e.response.data.message);
    }
  };

  const handleOtpChange = (event) => {
    setOtp(Number(event.target.value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/verify-otp', { "email": email, "otp": otp });
      if (res.status === 200) {
        setMessage(res.data.message);
        // Set loggedIn to true in session storage upon successful login
        sessionStorage.setItem('loggedIn', 'true');
        navigate("/dashboard");
      }
    } catch (e) {
      setMessage(e.response.data.message);
    }
  };

  return (
    <div className="login-container">
      <button onClick={() => navigate("/")}>Home</button>
      <h2>Login</h2>
      {message && <h4 className="error-message">{message}</h4>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={handleEmailChange} required />

        {showOtpInput && (
          <div>
            <label htmlFor="otp">OTP:</label>
            <input type="text" id="otp" value={otp} onChange={handleOtpChange} required />
          </div>
        )}

        <button type="button" onClick={handleGenerateOtp}>
          Generate OTP
        </button>
        {otpSent && <button type="submit">Submit</button>}
      </form>
      <div>
        <h5>Are you a new user?</h5>
        <button onClick={() => navigate("/signup")}>Signup</button>
      </div>
    </div>
  );
};

export default Login;
