import React from 'react';
import {  Router, Route, Link, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import LandingPage from './components/landingPage';
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/dashboard';
import CountryDetails from './components/countryDetails';
import CityDetails from './components/cityDetails';
import LanguageDetails from './components/languageDetails';


function App() {
  return (
  <div>
    <Routes>
      <Route exact path="/" element={<LandingPage />}></Route> 
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/dashboard" element={<Dashboard />}/>
      <Route exact path="/country/:name" element={<CountryDetails />} />
      <Route exact path="/city/:name" element={<CityDetails />} />
      <Route exact path="/language/:language" element={<LanguageDetails />} />
     </Routes>
  </div>
  );
}

export default App;
