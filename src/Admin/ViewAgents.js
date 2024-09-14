import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import '../styles/ViewAgents.css'; 
const columns = [
  { name: 'ID', selector: row => row.id, sortable: true },
  { name: 'Request by', selector: row => row.requestBy, sortable: true },
  { name: 'Subject', selector: row => row.subject, sortable: true, grow: 2 }, // Increase size of Subject column
  { name: 'Assignee', selector: row => row.assignee, sortable: true },
  { name: 'Priority', selector: row => row.priority, sortable: true, cell: row => (
      <span className={`priority-tag ${row.priority.toLowerCase()}`}>
        {row.priority}
      </span>
    ),
  },
  { name: 'Status', selector: row => row.status, sortable: true },
  { name: 'Created Date', selector: row => row.createdDate, sortable: true },
  { name: 'Due Date', selector: row => row.dueDate, sortable: true },
  { name: 'Action', cell: row => (
      <div className="action-buttons">
        <button className="edit-button">Edit</button>
        <button className="delete-button">Delete</button>
      </div>
    ),
    grow: 2, // Extend the last column
  },
];
 
const data = [
  { id: '190365', requestBy: 'Joseph D.', subject: 'Support for theme', assignee: 'A. Brown', priority: 'Medium', status: 'Open', createdDate: '01/10/2021', dueDate: '01/15/2021' },
  { id: '190366', requestBy: 'E. Brown', subject: 'Your application received', assignee: 'B. Smith', priority: 'Low', status: 'Closed', createdDate: '01/11/2021', dueDate: '01/16/2021' },
  { id: '190367', requestBy: 'Alice C.', subject: 'Issue with login', assignee: 'C. Davis', priority: 'High', status: 'In Progress', createdDate: '01/12/2021', dueDate: '01/17/2021' },
  { id: '190368', requestBy: 'Bob E.', subject: 'Payment not processed', assignee: 'D. Evans', priority: 'Medium', status: 'Pending', createdDate: '01/13/2021', dueDate: '01/18/2021' },
  { id: '190369', requestBy: 'Charlie F.', subject: 'Feature request', assignee: 'E. Foster', priority: 'Low', status: 'Resolved', createdDate: '01/14/2021', dueDate: '01/19/2021' },
  { id: '190370', requestBy: 'David G.', subject: 'Bug report', assignee: 'F. Green', priority: 'High', status: 'Open', createdDate: '01/15/2021', dueDate: '01/20/2021' },
  { id: '190371', requestBy: 'Eve H.', subject: 'Account suspension', assignee: 'G. Harris', priority: 'Medium', status: 'In Progress', createdDate: '01/16/2021', dueDate: '01/21/2021' },
  { id: '190372', requestBy: 'Frank I.', subject: 'Password reset', assignee: 'H. Johnson', priority: 'Low', status: 'Pending', createdDate: '01/17/2021', dueDate: '01/22/2021' },
  { id: '190373', requestBy: 'Grace J.', subject: 'Subscription issue', assignee: 'I. King', priority: 'High', status: 'Resolved', createdDate: '01/18/2021', dueDate: '01/23/2021' },
  { id: '190374', requestBy: 'Henry K.', subject: 'Feedback', assignee: 'J. Lee', priority: 'Medium', status: 'Open', createdDate: '01/19/2021', dueDate: '01/24/2021' },
];
 
const ViewAgents = () => {
  const [filterText, setFilterText] = useState('');
  const [filteredData, setFilteredData] = useState(data);
 
  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    setFilterText(searchText);
    const filteredItems = data.filter(item =>
      item.id.toLowerCase().includes(searchText) ||
      item.requestBy.toLowerCase().includes(searchText) ||
      item.subject.toLowerCase().includes(searchText) ||
      item.assignee.toLowerCase().includes(searchText) ||
      item.priority.toLowerCase().includes(searchText) ||
      item.status.toLowerCase().includes(searchText) ||
      item.createdDate.toLowerCase().includes(searchText) ||
      item.dueDate.toLowerCase().includes(searchText)
    );
    setFilteredData(filteredItems);
  };
 
  return (
    <div className="admin-page">
      <div className="main-panel">
        <div className="header">
          <h1>Tickets</h1>
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            value={filterText}
            onChange={handleSearch}
          />
        </div>
        <div className="table-container">
          <DataTable
            title="Tickets"
            columns={columns}
            data={filteredData}
            pagination
            className="data-table"
          />
        </div>
      </div>
    </div>
  );
};
 
export default ViewAgents;