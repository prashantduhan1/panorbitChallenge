import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signup.css'; // Import CSS file for styling

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let requestBody = {
      firstname: firstName,
      lastname: lastName,
      gender: gender,
      email: email,
      phonenumber: phoneNumber,
    };

    setIsLoading(true); // Set isLoading to true when form is submitted

    try {
      const res = await axios.post('http://localhost:3000/signup', requestBody);

      if (res.status === 200) {
        setSubmitted(true);
        setTimeout(() => {
          window.location.reload(); // Refresh the page after 5 seconds
        }, 10000);
      }
    } catch (e) {
      setErrorMessage(e.response.data.message);
      setTimeout(() => {
        window.location.reload(); // Refresh the page after 5 seconds
      }, 10000);
    }

    setIsLoading(false); // Set isLoading to false after receiving response
  };

  return (
    <div className="signup-container">
      <button onClick={() => navigate('/')}>Home</button>
      {submitted && <p className="success-message">User registered successfully!</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label">First Name:</label>
        <input type="text" value={firstName} onChange={handleFirstNameChange} required />

        <label className="form-label">Last Name:</label>
        <input type="text" value={lastName} onChange={handleLastNameChange} required />

        <label className="form-label">Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} required />

        <label className="form-label">Phone Number:</label>
        <input type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} required />

        <label className="form-label">Gender:</label>
        <select value={gender} onChange={handleGenderChange} required>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      <h5 className="existing-member">Existing member?</h5>
      <button onClick={() => navigate('/login')}>Login</button>
    </div>
  );
};

export default Signup;
