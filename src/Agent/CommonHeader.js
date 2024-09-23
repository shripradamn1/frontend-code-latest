import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaClipboardList, FaEdit, FaArchive } from 'react-icons/fa';

const CommonHeader = ({ isLoggedIn, onLogout, showHomeIcon = true }) => {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const featuresData = [
    showHomeIcon ? { title: "Home", route: "/agent", icon: <FaHome /> } : null,
    { title: "View Tickets", route: "/view-tickets/agent", icon: <FaClipboardList /> },
    { title: "Edit Tickets", route: "/edit-tickets/agent", icon: <FaEdit /> },
    { title: "Closed Tickets", route: "/closed-tickets/agent", icon: <FaArchive /> },
  ].filter(Boolean); // Filter out null values

  const handleFeatureClick = (route) => {
    navigate(route);
  };

  return (
    <header style={styles.header}>
      <div style={styles.featuresContainer}>
        {featuresData.map((feature, index) => {
          const isActive = location.pathname === feature.route;
          return (
            <div
              key={index}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleFeatureClick(feature.route)}
              style={{
                ...styles.feature,
                color: isActive || hovered === index ? '#007bff' : '#343a40' // Highlight the active or hovered feature
              }}
            >
              {feature.icon}
              <span>{feature.title}</span>
            </div>
          );
        })}
      </div>
      <div style={styles.authButtons}>
        {isLoggedIn ? (
          <button style={styles.button} onClick={onLogout}>
            Logout
          </button>
        ) : (
          <button style={styles.button} onClick={() => navigate("login/agent")}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "10px 20px",
    borderBottom: "1px solid #ddd",
    overflow: "hidden", // Prevent overflow
  },
  featuresContainer: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flex: 1, // Allow features to take available space
  },
  feature: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  },
  authButtons: {
    display: "flex",
    alignItems: "center",
  },
  button: {
    marginRight: "35px", // Adjust this value to move the button left
    backgroundColor: "#ff9900",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    padding: "10px 20px",
    fontSize: "16px",
    transition: "background-color 0.3s",
    whiteSpace: "nowrap", // Prevent text from wrapping
  },
};
export default CommonHeader;
