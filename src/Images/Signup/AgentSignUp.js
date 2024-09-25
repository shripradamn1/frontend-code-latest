import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Signup.css';
import signupImage from '../blob.png';

const AgentSignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    //console.log(`${process.env.REACT_APP_BACKEND_URL}/api/agents/checkUsername/${username}`)
    if (username && password && email) {
      // Check if the username is available when signing up
      try {
        const usernameCheckResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/agents/checkUsername/${username}`);
        const usernameCheckData = await usernameCheckResponse.json();
        console.log(usernameCheckData)

        if (usernameCheckResponse.ok && usernameCheckData.exists) {
          const userData = { username, password, email };
          console.log(userData)

          // Proceed to sign up
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signup/agent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          if (response.ok) {
            navigate('/agent');
          } else {
            const errorResponse = await response.json();
            if (response.status === 409) { // Username taken
              alert("This username is already taken. Please choose a different username.");
            } else if (response.status === 500) { // Server error
              alert("Your account could not be created due to an unexpected error. Please try again later.");
            } else {
              alert("Please ensure all fields are filled out correctly. Your account could not be created.");
            }
          }
        } else {
          alert(usernameCheckData.message || "This username is already taken. Please choose a different username.");
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
