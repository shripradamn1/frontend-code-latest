import React from 'react';
import { render, screen } from '@testing-library/react';
import DashBoard from '../DashBoard'; // Adjust the path accordingly

describe('DashBoard Component', () => {
  test('renders the "What is a ticketing system?" heading', () => {
    render(<DashBoard />);
    const headingElement = screen.getByText(/What is a ticketing system?/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders the description paragraph for the ticketing system', () => {
    render(<DashBoard />);
    const descriptionParagraph = screen.getByText(/A ticketing system is software that helps you streamline customer support tickets/i);
    expect(descriptionParagraph).toBeInTheDocument();
  });

  test('renders the "Why do you need a ticketing system?" heading', () => {
    render(<DashBoard />);
    const whyHeading = screen.getByText(/Why do you need a ticketing system?/i);
    expect(whyHeading).toBeInTheDocument();
  });

  test('renders the list of reasons for needing a ticketing system', () => {
    render(<DashBoard />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(6);

    const reasons = [
      "Struggling to handle customer conversations across multiple platforms.",
      "Having trouble keeping up with everyday repetitive tasks.",
      "Frequently missing high priority issues and failing to meet deadlines.",
      "Struggling to organize all of the relevant data for a ticket.",
      "Disappointing customers because of slow response time.",
      "Receiving poor customer feedback about your customer service."
    ];

    reasons.forEach(reason => {
      expect(screen.getByText(reason)).toBeInTheDocument();
    });
  });
});
