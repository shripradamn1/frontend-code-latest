import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Features from '../Features'; // Update this to the correct path of your Features component

// Mocking the useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Features component', () => {
  const mockedNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockedNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders feature cards correctly', () => {
    render(
      <MemoryRouter>
        <Features isLoggedIn={true} />
      </MemoryRouter>
    );

    const featureTitles = ['Create Ticket', 'View Tickets', 'Edit Tickets'];

    featureTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test('navigates to feature route when logged in', () => {
    render(
      <MemoryRouter>
        <Features isLoggedIn={true} />
      </MemoryRouter>
    );

    const createTicketCard = screen.getByText('Create Ticket');
    
    fireEvent.click(createTicketCard);
    
    expect(mockedNavigate).toHaveBeenCalledWith('/create-ticket');
  });

//   test('shows warning when trying to access a feature without being logged in', () => {
//     render(
//       <MemoryRouter>
//         <Features isLoggedIn={false} />
//       </MemoryRouter>
//     );

//     const createTicketCard = screen.getByText('Create Ticket');
    
//     fireEvent.click(createTicketCard);
    
//     expect(screen.getByText('Please log in to access this feature.')).toBeInTheDocument();
//   });
});
