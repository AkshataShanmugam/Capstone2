// tests/Wishlist.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Wishlist from '../../src/pages/Wishlist'; 
import '@testing-library/jest-dom'; // For additional matcher

// Mocking localStorage
beforeEach(() => {
  const mockLocalStorage = (() => {
    let store = {};
    return {
      getItem(key) {
        return store[key] || null;
      },
      setItem(key, value) {
        store[key] = value;
      },
      removeItem(key) {
        delete store[key];
      },
      clear() {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
});

describe('Wishlist Component', () => {
  test('renders empty wishlist message when there are no items', () => {
    render(
      <MemoryRouter> {/* Wrap with MemoryRouter */}
        <Wishlist />
      </MemoryRouter>
    );
    
    const emptyMessage = screen.getByText(/Your wishlist is empty/i);
    expect(emptyMessage).toBeInTheDocument();
    
    const discoverLink = screen.getByText(/Discover some news to add/i);
    expect(discoverLink).toBeInTheDocument();
  });

  });
