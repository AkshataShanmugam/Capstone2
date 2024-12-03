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

  test('renders wishlist items when there are items in localStorage', () => {
    const mockArticles = [
      { title: 'Article 1', link: 'http://example.com/article1', date: '2023-01-01', thumbnail: 'http://example.com/thumb1.jpg' },
      { title: 'Article 2', link: 'http://example.com/article2', date: '2023-02-01', thumbnail: 'http://example.com/thumb2.jpg' },
    ];

    window.localStorage.setItem('wishlist', JSON.stringify(mockArticles));
    
    render(
      <MemoryRouter> {/* Wrap with MemoryRouter */}
        <Wishlist />
      </MemoryRouter>
    );

    expect(screen.getByText(/My Wishlist/i)).toBeInTheDocument();
    expect(screen.getByText(/Article 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Article 2/i)).toBeInTheDocument();
  });

  test('removes an item from the wishlist', () => {
    const mockArticles = [
      { title: 'Article 1', link: 'http://example.com/article1', date: '2023-01-01', thumbnail: 'http://example.com/thumb1.jpg' },
    ];

    window.localStorage.setItem('wishlist', JSON.stringify(mockArticles));
    
    render(
      <MemoryRouter> {/* Wrap with MemoryRouter */}
        <Wishlist />
      </MemoryRouter>
    );

    const removeButton = screen.getByLabelText(/Remove from wishlist/i);
    fireEvent.click(removeButton);
    
    expect(screen.queryByText(/Article 1/i)).not.toBeInTheDocument();
  });

  test('updates localStorage after removing an item', () => {
    const mockArticles = [
      { title: 'Article 1', link: 'http://example.com/article1', date: '2023-01-01', thumbnail: 'http://example.com/thumb1.jpg' },
      { title: 'Article 2', link: 'http://example.com/article2', date: '2023-02-01', thumbnail: 'http://example.com/thumb2.jpg' },
    ];

    window.localStorage.setItem('wishlist', JSON.stringify(mockArticles));
    
    render(
      <MemoryRouter> {/* Wrap with MemoryRouter */}
        <Wishlist />
      </MemoryRouter>
    );

    // Get all remove buttons
    const removeButtons = screen.getAllByLabelText(/Remove from wishlist/i);

    // Click the first remove button (for Article 1)
    fireEvent.click(removeButtons[0]);
    
    const updatedWishlist = JSON.parse(window.localStorage.getItem('wishlist'));
    expect(updatedWishlist).toEqual([{ title: 'Article 2', link: 'http://example.com/article2', date: '2023-02-01', thumbnail: 'http://example.com/thumb2.jpg' }]);
  });
});
