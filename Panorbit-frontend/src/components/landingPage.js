import React from 'react';
import { useNavigate } from 'react-router-dom';
import './landingPage.css'; // Import CSS file for styling

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page-container">
      <h2>Welcome to the Landing Page</h2>
      <div className="button-container">
        <h5>Are you a new user?</h5>
        <button onClick={() => navigate('/signup')} className="signup-button">
          Signup
        </button>
      </div>
      <div className="button-container">
        <h5>Existing member?</h5>
        <button onClick={() => navigate('/login')} className="login-button">
          Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
