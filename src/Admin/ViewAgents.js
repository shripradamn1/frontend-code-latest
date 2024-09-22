import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

const ViewAgents = () => {
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch agents with credentials (session or cookies)
    axios.get('http://localhost:7000/api/agents/agents', { withCredentials: true })
      .then(response => {
        // Ensure response data is an array
        if (Array.isArray(response.data)) {
          setAgents(response.data);
          console.log(response.data);
        } else {
          setError('Response data is not an array');
        }
      })
      .catch(error => {
        setError(error.message);
      });
  }, []);

  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Name', selector: row => row.name, sortable: true },
    { 
      name: 'Username', 
      selector: row => row.username ? row.username : 'N/A', // Check for null or undefined
      sortable: true 
    },
    { 
      name: 'Team', 
      selector: row => row.team ? row.team.teamName : 'No Team Assigned', // Display team name or fallback text
      sortable: true 
    }
  ];

  const containerStyle = {
    padding: '20px',
    backgroundColor: '#f4f4f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '90%',
    margin: '0 auto',
    overflow: 'hidden'
  };

  const tableStyle = {
    borderRadius: '8px',
    overflow: 'hidden'
  };

  return (
    <div style={containerStyle}>
      {error ? <div style={{ color: 'red', fontSize: '16px' }}>Error: {error}</div> : (
        <DataTable
          title="Support Agents"
          columns={columns}
          data={agents}
          pagination
          customStyles={{
            table: {
              style: tableStyle
            },
            headCells: {
              style: {
                backgroundColor: '#ff9900',
                color: 'white',
                fontWeight: 'bold'
              }
            },
            cells: {
              style: {
                padding: '10px',
                fontSize: '16px'
              }
            },
            pagination: {
              style: {
                fontSize: '14px'
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default ViewAgents;
