import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../Images/image.png";
import CommonHeader from "./CommonHeader"; // Import CommonHeader

const HomePageAgent = () => {
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const featuresData = [
    { title: "View Tickets", route: "/view-tickets/agent" },
    { title: "Edit Tickets", route: "/edit-tickets/agent" },
    { title: "Closed Tickets", route: "/closed-tickets/agent" },
  ];

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/checkLoggedInUser",
          { withCredentials: true }
        );
        setIsLoggedIn(response.status === 200);
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:7000/api/signup",
        signUpData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsLoggedIn(true);
        navigate("/agent");
      } else {
        console.error("Sign-up failed");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:7000/logout",
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      navigate("/agent/login/agent"); // Redirect after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      alert("Please log in to access the features.");
    } else {
      navigate("/features/agent");
    }
  };

  return (
    <div style={styles.container}>
      <CommonHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} showHomeIcon={false} />{/* Use CommonHeader here */}

      <main style={styles.mainSection}>
        <div style={styles.heroText}>
          <h1>Ticket Management</h1>
          <button
            style={styles.getStartedButton}
            onClick={handleGetStarted}
          >
            Get Started
          </button>
        </div>

        <div style={styles.heroImage}>
          <img
            src={backgroundImage}
            alt="Ticketing System Illustration"
            style={styles.heroImg}
          />
        </div>
      </main>

      <section style={styles.featuresSection}>
        <h2>Explore More Features</h2>
        <div style={styles.featuresGrid}>
          {featuresData.map((feature, index) => (
            <div
              key={index}
              style={styles.featureCard}
              onClick={() => {
                if (!isLoggedIn) {
                  alert("Please log in to access the feature");
                } else {
                  navigate(feature.route);
                }
              }}
            >
              <h3>{feature.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "100vh",
    overflowX: "hidden",
  },
  mainSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    flex: 1,
  },
  heroText: {
    flex: 1,
    marginRight: "20px",
  },
  heroImage: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  heroImg: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "8px",
  },
  getStartedButton: {
    backgroundColor: "#ff9900",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "18px",
    padding: "10px 20px",
    marginTop: "20px",
    transition: "background-color 0.3s",
  },
  featuresSection: {
    backgroundColor: "#f9fafc",
    textAlign: "center",
    padding: "40px 20px",
  },
  featuresGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  featureCard: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    width: "300px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
};

export default HomePageAgent;
