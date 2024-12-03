// tests/Terms.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Terms from '../../src/pages/Terms'; 
import '@testing-library/jest-dom'; // jest-dom for additional matchers

describe('Terms Component', () => {
  test('renders the main title', () => {
    render(<Terms />);
    const titleElement = screen.getByText(/Movie Perception Analysis/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders terms and conditions header', () => {
    render(<Terms />);
    const termsHeader = screen.getByRole('heading', { name: /Terms and Conditions/i });
    expect(termsHeader).toBeInTheDocument();
  });

  test('renders all sections of terms', () => {
    render(<Terms />);
    const sections = [
      "1. Acceptance of Terms",
      "2. Changes to Terms",
      "3. User Responsibilities",
      "4. Privacy",
      "5. Disclaimer",
      "6. Limitation of Liability",
      "7. Governing Law",
      "8. Contact"
    ];

    sections.forEach(section => {
      const sectionElement = screen.getByText(new RegExp(section, 'i'));
      expect(sectionElement).toBeInTheDocument();
    });
  });

  test('renders footer message', () => {
    render(<Terms />);
    const footerMessage = screen.getByText(/By using our service, you acknowledge that you have read and understood these Terms and Conditions/i);
    expect(footerMessage).toBeInTheDocument();
  });
});
