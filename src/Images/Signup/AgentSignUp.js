import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'C:/Users/e031906/Downloads/Front-end-latest/my-app/src/styles/Signup.css'
import signupImage from 'C:/Users/e031906/Downloads/Front-end-latest/my-app/src/Images/blob.png';


const AgentSignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (username && password && email) {
      const userData = { username, password, email };

      try {
        const response = await fetch('http://localhost:7000/signup/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          navigate('/view-tickets/agent');
        } else {
          alert('Error: Unable to sign up');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
      }
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="page-container">
      <div className="image-container">
      
      
      <img src={signupImage} alt="Sign Up" />
      <div className="form-container">
        <h2>Sign Up</h2>
        
        <form onSubmit={handleSignUp}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
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
          <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <Link to="/login/agent">Login</Link></p>
      </div>
    </div>
    </div>
  );
};

export default AgentSignUpPage;

