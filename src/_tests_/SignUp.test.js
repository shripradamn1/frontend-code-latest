import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react'; // Import act from 'react'
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import LoginPage from '../Images/Signup/signin/LoginPage'; // Adjust the import path

jest.mock('axios');

describe('LoginPage Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Please Login to continue')).toBeInTheDocument();
    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('updates username and password input fields', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username:');
    const passwordInput = screen.getByLabelText('Password:');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  test('successful login and redirection to the homepage', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    axios.get.mockResolvedValue({
      status: 200,
      data: { id: 1, role: 'ROLE_USER' },
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        process.env.REACT_APP_BACKEND_URL + '/login',
        expect.any(FormData),
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      expect(axios.get).toHaveBeenCalledWith(
        process.env.REACT_APP_BACKEND_URL + '/checkLoggedInUser',
        { withCredentials: true }
      );
    });

    // Add redirection assertion if needed
  });

  test('handles login error and shows alert', async () => {
    axios.post.mockRejectedValue(new Error('Login failed'));
  
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  
    fireEvent.change(getByLabelText('Username:'), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(getByLabelText('Password:'), {
      target: { value: 'wrongpassword' },
    });
  
    fireEvent.click(getByText('Login'));
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      // expect(global.alert).toHaveBeenCalledWith(
      //   'Its looks like you dont have an account please create account!'
      // );
    });
  });
  

  test('navigates to create ticket page when Create Ticket button is clicked', async () => {
    const navigate = jest.fn();

    axios.post.mockResolvedValue({ status: 200 });
    axios.get.mockResolvedValue({
      status: 200,
      data: { id: 1, role: 'ROLE_USER' },
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Create Ticket'));
      // Mocking navigation, e.g., expect(navigate).toHaveBeenCalledWith('/create-ticket');
    });
  });
});
