import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './cityDetails.css'; // Import CSS file for styling

const CityDetails = () => {
  const { name } = useParams();
  const [cityObject, setCityObject] = useState({});
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
      const response = await axios.get(`http://localhost:3000/city/${name}`);
      setCityObject(response.data);
    } catch (error) {
      console.error('Error fetching city details:', error);
    }
  };

  // Conditional rendering to handle the case when cityObject is still empty
  if (Object.keys(cityObject).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="city-details-container">
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <h2 className="city-details-title">City Details</h2>
      <table className="city-details-table">
        <tbody>
          {Object.entries(cityObject).map(([key, value]) => (
            <tr key={key}>
              <td className="city-details-key">{key}</td>
              <td className="city-details-value">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CityDetails;
