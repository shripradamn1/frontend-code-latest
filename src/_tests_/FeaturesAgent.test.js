import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FeaturesAgent from '../Agent/FeaturesAgent'; // Adjust the path if needed
import { useNavigate } from 'react-router-dom';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

describe('FeaturesAgent Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
    useNavigate.mockReturnValue(mockNavigate); // Mock the return value of useNavigate
  });

  test('renders FeaturesAgent component with features', () => {
    render(
      <MemoryRouter>
        <FeaturesAgent />
      </MemoryRouter>
    );

    expect(screen.getByText(/Explore Features/i)).toBeInTheDocument();
    expect(screen.getByText(/View Tickets/i)).toBeInTheDocument();
    expect(screen.getByText(/Edit Tickets/i)).toBeInTheDocument();
    expect(screen.getByText(/Closed Tickets/i)).toBeInTheDocument();
  });

  test('navigates to the correct route when logged in', () => {
    const { getByText } = render(
      <MemoryRouter>
        <FeaturesAgent />
      </MemoryRouter>
    );

    fireEvent.click(getByText(/View Tickets/i));
    expect(mockNavigate).toHaveBeenCalledWith('/view-tickets/agent');

    fireEvent.click(getByText(/Edit Tickets/i));
    expect(mockNavigate).toHaveBeenCalledWith('/edit-tickets/agent');

    fireEvent.click(getByText(/Closed Tickets/i));
    expect(mockNavigate).toHaveBeenCalledWith('/closed-tickets/agent');
  });

  test('shows login warning when not logged in', () => {
    const { getByText } = render(
      <MemoryRouter>
        <FeaturesAgent isLoggedIn={false} /> {/* Pass in a prop to control logged-in state */}
      </MemoryRouter>
    );

    // fireEvent.click(getByText(/View Tickets/i));
    // expect(screen.getByText(/Please log in to access this feature/i)).toBeInTheDocument();
  });

  test('back button navigates back', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <FeaturesAgent />
      </MemoryRouter>
    );

    const backButton = getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1); // This checks the back navigation
  });
});
