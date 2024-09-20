import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
//import '../../../styles/Login.css';
//import loginImage from '../../blob.png'; 
import axios from 'axios';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);   
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);   
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const formdata = new FormData();
      formdata.append('username', username);
      formdata.append('password', password);

      const loginResponse = await axios.post('http://localhost:7000/login', formdata, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (loginResponse.status === 200) {
        const combinedRequest = axios.get('http://localhost:7000/checkLoggedInUser', {
          withCredentials: true,
        });

        const [loginDetails, userDetails] = await Promise.all([loginResponse, combinedRequest]);

        if (userDetails.status === 200) {
          const user = userDetails.data;
          if (user.role === 'ROLE_ADMIN') {
            setIsLoggedIn(true);
            setUserId(user.id);
            setUserData(user);
            navigate('/admin');
          } else {
            alert('Invalid role');
          }
        } else {
          alert('Failed to fetch user details');
        }
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <div className="image-container">
        {/* <img src={loginImage} alt="Login" /> */}
      </div>
      {!isLoggedIn ? (
        <div className="form-container">
          <h2>Please Login to continue</h2>
          <form onSubmit={handleLogin}>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}   
                required
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>   
            <button type="submit">Login</button>
          </form>
          {/* <p>Don't have an account? <Link to="/signup/user">Sign Up</Link></p> */}
        </div>
      ) : (
        <div className="buttons-container">
          {/* <button onClick={() => navigate('/create-ticket')}>Create Ticket</button>
          <button onClick={() => navigate('/delete-ticket')}>Delete Ticket</button> */}
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
