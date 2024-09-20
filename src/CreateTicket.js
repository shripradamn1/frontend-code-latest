import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateTicket = () => {
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null); // State for file
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [loggedInUserId, setLoggedInUserId] = useState(null); // State for user ID

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/categories', {
          withCredentials: true,
          headers: {
            'Accept': 'application/json'
          }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const checkLoggedInUser = async () => {
      try {
        const response = await axios.get('http://localhost:7000/checkLoggedInUser', {
          withCredentials: true,
          headers: {
            'Accept': 'application/json'
          }
        });
        setLoggedInUserId(response.data.id);
      } catch (error) {
        console.error('Error checking logged-in user:', error);
      }
    };

    fetchCategories();
    checkLoggedInUser();
  }, []);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    axios.get(`http://localhost:7000/api/teams/categories/${categoryId}/teams`, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      setTeams(response.data);
    })
    .catch((error) => {
      console.error('Error fetching teams:', error);
    });
  };

  const getTeamIdFromName = (categoryName, teamName) => {
    if (categoryName === '1') {
      switch (teamName) {
        case 'Application Support Team':
          return 1;
        case 'Technical Support Team':
          return 2;
        case 'Security Team':
          return 3;
        default:
          return 4;
      }
    } else if (categoryName === '2') {
      switch (teamName) {
        case 'Device Support Team':
          return 1;
        case 'Networking and Connectivity Team':
          return 2;
        case 'Telecommunication Equipment Team':
          return 3;
          default:
          return 4;
      }
    }
    return null;
  };

  const handleTeamChange = (e) => {
    const selectedTeamName = e.target.value;
    setSelectedTeam(selectedTeamName);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const teamId = getTeamIdFromName(selectedCategory, selectedTeam);

    if (teamId === null) {
      setErrorMessage('Invalid team selected');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('categoryId', selectedCategory);
    formData.append('userId', loggedInUserId);
    if (file) {
      formData.append('file', file); // Append file only if it exists
    }

    axios.post(`http://localhost:7000/api/tickets/${loggedInUserId}/${selectedCategory}/${teamId}`, formData, {
      withCredentials: true,
    })
    .then((response) => {
      console.log('Ticket created successfully:', response.data);

      setSuccessMessage('Ticket created successfully!');
      setTitle('');
      setDescription('');
      setSelectedCategory('');
      setSelectedTeam('');
      setFile(null);
      setTeams([]);

      navigate('/success');
    })
    .catch((error) => {
      console.error('Error creating ticket:', error);
      setErrorMessage('Failed to create ticket. Please try again.');
    });
  };

  // Inline styles
  const styles = {
    page: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '80vh',
      fontFamily: 'Georgia, "Times New Roman", Times, serif',
      marginTop: '60px',
      marginLeft: '0px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '15px 20px',
      backgroundColor: '#f5f5f5',
      borderBottom: '1px solid #ddd',
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '1000'
    },
    sidebar: {
      width: '200px',
      backgroundColor: '#007bff',
      color: 'white',
      paddingTop: '80px',
      position: 'fixed',
      left: '0',
      height: '100vh'
    },
    sidebarItem: {
      margin: '20px 0',
      borderBottom: 'solid rgb(56, 52, 52) .5px',
      boxShadow: '#555'
    },
    sidebarLink: {
      color: 'white',
      textDecoration: 'none',
      padding: '10px',
      display: 'block'
    },
    sidebarLinkHover: {
      backgroundColor: '#282ba3',
      color: '#ddd'
    },
    formContainer: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '60px 20px',
      marginRight: '200px',
      marginLeft: '30%',
      width: '1000px',
      backgroundColor: '#f9f9f9'
    },
    form: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '600px',
      marginTop: '10px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '20px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px',
      color: '#333'
    },
    textarea: {
      resize: 'vertical',
      minHeight: '100px'
    },
    fileInput: {
      marginBottom: '20px'
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    submitButton: {
      backgroundColor: '#007bff',
      color: 'white'
    },
    cancelButton: {
      backgroundColor: '#f44336',
      color: 'white'
    },
    successMessage: {
      color: 'green'
    },
    errorMessage: {
      color: 'red'
    },
    heading: {
      color: '#3341e5',
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '20px'
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        {/* Header content */}
      </header>

      <aside style={styles.sidebar}>
        <ul>
          <li style={styles.sidebarItem}><a href="/create-ticket" style={styles.sidebarLink}>Create Ticket</a></li>
          <li style={styles.sidebarItem}><a href="/view-tickets" style={styles.sidebarLink}>View Tickets</a></li>
          <li style={styles.sidebarItem}><a href="/edit-tickets" style={styles.sidebarLink}>Edit Tickets</a></li>
          <li style={styles.sidebarItem}><a href="/helpdesk" style={styles.sidebarLink}>Helpdesk Automation</a></li>
        </ul>
      </aside>

      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Create New Ticket</h2>

        {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="title" style={styles.label}>Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />

          <label htmlFor="description" style={styles.label}>Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ ...styles.input, ...styles.textarea }}
          />

          <label htmlFor="category" style={styles.label}>Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            required
            style={styles.input}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label htmlFor="team" style={styles.label}>Team:</label>
          <select
            id="team"
            value={selectedTeam}
            onChange={handleTeamChange}
            required
            style={styles.input}
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>

          <label htmlFor="file" style={styles.label}>Attach File (Optional):</label>
          <input
            id="file"
            type="file"
            onChange={handleFileChange}
            style={styles.fileInput}
          />

          <button type="submit" style={{ ...styles.button, ...styles.submitButton }}>Submit</button>
          <button type="button" onClick={() => navigate('/')} style={{ ...styles.button, ...styles.cancelButton }}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
