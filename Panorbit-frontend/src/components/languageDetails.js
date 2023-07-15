import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './languageDetails.css'; // Import CSS file for styling

const LanguageDetails = () => {
  const { language } = useParams();
  const [languageArray, setLanguageArray] = useState([]);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false); 
  useEffect(() => {
    // Check if the user is logged in
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    if (isLoggedIn && isLoggedIn === 'true') {
      setLoggedIn(true);
    } else {
      // Redirect the user to the LandingPage if not logged in
      navigate('/');
    }
  }, []); // Empty dependency array to run the effect only once on component mount

  useEffect(() => {
    performAPICall();
  }, []);

  const performAPICall = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/language/${language}`);
      const formattedData = response.data.map((item) => ({
        CountryCode: item.CountryCode,
        Language: item.Language,
        IsOfficial: item.IsOfficial,
        Percentage: item.Percentage,
      }));
      setLanguageArray(formattedData);
    } catch (error) {
      console.error('Error fetching language details:', error);
    }
  };

  // Conditional rendering to handle the case when languageArray is still empty
  if (languageArray.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="language-details-container">
      <button onClick={() => navigate("/dashboard")} className="dashboard-button">Dashboard</button>
      <h2>Language Details</h2>
      <table className="language-table">
        <thead>
          <tr>
            <th>Country Code</th>
            <th>Language</th>
            <th>Is Official</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {languageArray.map((item, index) => (
            <tr key={index}>
              <td>{item.CountryCode}</td>
              <td>{item.Language}</td>
              <td>{item.IsOfficial}</td>
              <td>{item.Percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LanguageDetails;
