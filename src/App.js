import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';
import React from 'react';
import SignUpPage from './Images/Signup/signin/Signup';
import LoginPage from './Images/Signup/signin/LoginPage';
import Features from './Features';
import AgentSignUpPage from './Images/Signup/AgentSignUp';
import ViewTicketsUser from './ViewTicketsUser';
import AgentLoginPage from './Agent/AgentLogin';
import ViewTicketDetails from './styles/ViewTicketDetails';
import CreateTicket from './CreateTicket';
import EditTickets from './EditTickets';
import ViewTickets from './Agent/ViewTickets';
import EditTicketsAgent from './Agent/EditTicketsAgent';
import HomePageAgent from './Agent/HomePageAgent';
import ViewAgents from './Admin/ViewAgents';
import CategoryList from './Admin/CategoryList';
import TeamsList from './Admin/TeamsList'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/agent" element={<HomePageAgent />} />
          <Route path="/signup/user" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/features" element={<Features/>} />
          <Route path="/create-ticket" element={<CreateTicket/>} />
          <Route path="/ticket-details/:title" element={<ViewTicketDetails />} />
          <Route path="/view-tickets" element={<ViewTicketsUser/>} />

          <Route path="/signup/agent" element={<AgentSignUpPage />} />
          <Route path="agent/login/agent" element={<AgentLoginPage />} />
          <Route path="/view-tickets/agent" element={<ViewTickets/>} />
          <Route path="/edit-tickets/agent" element={<EditTicketsAgent/>} />


          {/* admin part */}

          <Route path="/viewAgents/admin" element={<ViewAgents/>} />
          <Route path="/categories/admin" element={<CategoryList/>} />
          <Route path="/teams/admin" element={<TeamsList/>} />

          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
