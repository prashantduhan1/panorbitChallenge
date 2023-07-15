import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './countryDetails.css'; // Import CSS file for styling

const CountryDetails = () => {
  const { name } = useParams();
  const [countryObject, setCountryObject] = useState({});
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
      const response = await axios.get(`http://localhost:3000/country/${name}`);
      setCountryObject(response.data);
    } catch (error) {
      console.error('Error fetching country details:', error);
    }
  };

  // Conditional rendering to handle the case when countryObject is still empty
  if (Object.keys(countryObject).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="country-details-container">
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <h2 className="country-details-title">Country Details</h2>
      <table className="country-details-table">
        <tbody>
          {Object.entries(countryObject).map(([key, value]) => (
            <tr key={key}>
              <td className="country-details-key">{key}</td>
              <td className="country-details-value">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CountryDetails;
