import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Header from '../Admin/Header'; // Adjust the path accordingly

// Mock the `useNavigate` hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe('Header Component', () => {
  const mockedNavigate = jest.fn();
  const mockedLocation = { pathname: '/admin' };

  beforeEach(() => {
    require('react-router-dom').useNavigate.mockReturnValue(mockedNavigate);
    require('react-router-dom').useLocation.mockReturnValue(mockedLocation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders all menu items correctly', () => {
    render(
      <MemoryRouter>
        <Header isLoggedIn={false} onLogout={jest.fn()} />
      </MemoryRouter>
    );

    // Check if all feature titles are rendered
    const featureTitles = ['Home', 'Categories', 'Teams', 'Agents', 'Create Agent'];
    featureTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test('navigates to correct route when a feature is clicked', () => {
    render(
      <MemoryRouter>
        <Header isLoggedIn={false} onLogout={jest.fn()} />
      </MemoryRouter>
    );

    const homeButton = screen.getByText('Home');
    fireEvent.click(homeButton);

    expect(mockedNavigate).toHaveBeenCalledWith('/admin');
  });

  test('renders Sign In button when user is not logged in', () => {
    render(
      <MemoryRouter>
        <Header isLoggedIn={false} onLogout={jest.fn()} />
      </MemoryRouter>
    );

    const signInButton = screen.getByText('Sign In');
    expect(signInButton).toBeInTheDocument();
  });

  test('renders Logout button when user is logged in', () => {
    render(
      <MemoryRouter>
        <Header isLoggedIn={true} onLogout={jest.fn()} />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
  });

  test('calls onLogout function when Logout button is clicked', () => {
    const onLogoutMock = jest.fn();

    render(
      <MemoryRouter>
        <Header isLoggedIn={true} onLogout={onLogoutMock} />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(onLogoutMock).toHaveBeenCalled();
  });

  test('navigates to login page when Sign In button is clicked', () => {
    render(
      <MemoryRouter>
        <Header isLoggedIn={false} onLogout={jest.fn()} />
      </MemoryRouter>
    );

    const signInButton = screen.getByText('Sign In');
    fireEvent.click(signInButton);

    expect(mockedNavigate).toHaveBeenCalledWith('/login/admin');
  });
});
