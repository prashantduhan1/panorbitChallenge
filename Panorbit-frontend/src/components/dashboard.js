import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css'; // Import CSS file for styling

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

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

  const handleSearchTermChange = async (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    try {
      const response = await axios.get(`http://localhost:3000/search?term=${value}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleLogout = () => {
    // Set isLoggedIn to false and clear the session storage
    setLoggedIn(false);
    sessionStorage.removeItem('loggedIn');
    navigate('/login'); // Redirect the user to the login page
  };

  return (
    <div className="dashboard-container">
       <button onClick={handleLogout}>Logout</button>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchTermChange}
        placeholder="Search by city, country, or language"
        className="search-input"
      />
      <button className="search-button">
        Search
      </button>

      <ul className="suggestions-list">
        {suggestions.map((item, index) => (
          <li key={item.name + index} className="suggestion-item">
            {/* Render clickable links based on the suggestion type */}
            {item.type === 'country' && (
              <button
                onClick={() => navigate(`/country/${item.name}`, { state: { name: item.name, type: item.type } })}
                className="suggestion-link"
              >
                {item.type} - {item.name}
              </button>
            )}
            {item.type === 'city' && (
              <button
                onClick={() => navigate(`/city/${item.name}`, { state: { name: item.name, type: item.type } })}
                className="suggestion-link"
              >
                {item.type} - {item.name}
              </button>
            )}
            {item.type === 'language' && (
              <button
                onClick={() => navigate(`/language/${item.name}`, { state: { name: item.name, type: item.type } })}
                className="suggestion-link"
              >
                {item.type} - {item.name}
              </button>
            )}
          </li>
        ))}
      </ul>

     
    </div>
  );
};

export default Dashboard;
