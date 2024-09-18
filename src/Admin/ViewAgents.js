import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

const ViewAgents = () => {
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch agents with credentials (session or cookies)
    axios.get('http://localhost:7000/api/agentss', { withCredentials: true })
      .then(response => {
        // Ensure response data is an array
        if (Array.isArray(response.data)) {
          setAgents(response.data);
          console.log(response.data)
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
      name: 'Team', 
      selector: row => row.team ? row.team.name : 'N/A', // Check for null or undefined
      sortable: true 
    },
    { 
      name: 'Category', 
      selector: row => row.category ? row.category.name : 'N/A', // Check for null or undefined
      sortable: true 
    },
    { name: 'Priority', selector: row => row.priority, sortable: true },
    // Add other columns if necessary
  ];

  return (
    <div>
      {error ? <div>Error: {error}</div> : (
        <DataTable
          title="Support Agents"
          columns={columns}
          data={agents}
          pagination
        />
      )}
    </div>
  );
};

export default ViewAgents;
