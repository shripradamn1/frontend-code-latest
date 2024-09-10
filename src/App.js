import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';
import React from 'react';
import SignUpPage from './Images/Signup/signin/Signup';
import LoginPage from './Images/Signup/signin/LoginPage';
import Features from './Features';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup/user" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/features" element={<Features/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
