// tests/SignIn.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SignIn from '../../src/pages/SignIn';
import '@testing-library/jest-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';

// Mocking Google OAuth provider
vi.mock('@react-oauth/google', () => ({
    GoogleLogin: ({ onSuccess }) => (
        <button onClick={() => onSuccess({ credential: 'fake-token' })}>Google Login</button>
    ),
    GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
}));

// Mock for react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Helper function to wrap the component with necessary providers
const renderWithProviders = (ui) => {
    return render(
        <GoogleOAuthProvider clientId="your-client-id">
            <BrowserRouter>{ui}</BrowserRouter>
        </GoogleOAuthProvider>
    );
};

describe('SignIn Component', () => {
    beforeEach(() => {
        renderWithProviders(<SignIn />);
    });

    afterEach(() => {
        vi.resetAllMocks(); // Reset mocks after each test
        localStorage.clear(); // Clear localStorage after each test to avoid state carryover
    });

    // Test case: Handles Google login failure
    test('handles google login failure', async () => {
        // Override Google login mock to simulate failure
        vi.mock('@react-oauth/google', () => ({
            GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
            GoogleLogin: ({ onSuccess, onError }) => (
                <button onClick={() => onError(new Error('Google login failed'))}>Mock Google Login</button>
            ),
        }));

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const googleLoginButton = screen.getByRole('button', { name: /Google Login/i });
        fireEvent.click(googleLoginButton);

        expect(consoleSpy).toHaveBeenCalledWith('Google login failed:', expect.any(Error));
        consoleSpy.mockRestore();
    });

    // Test case: Shows password in plain text when the eye icon is clicked
    test('shows the password in plain text when the eye icon is clicked', () => {
        const passwordInput = screen.getByLabelText(/Password/i);
        const eyeIcon = screen.getByRole('button', { name: '' }); // Adjust as necessary to target the correct button

        // Initially, the password is hidden
        expect(passwordInput.type).toBe('password');

        // Click the eye icon to reveal the password
        fireEvent.click(eyeIcon);
        expect(passwordInput.type).toBe('text');

        // Click again to hide the password
        fireEvent.click(eyeIcon);
        expect(passwordInput.type).toBe('password');
    });

    // Test case: Handles local logout
    test('handles local logout', async () => {
        // Simulate user logging in first
        localStorage.setItem('authToken', 'mocked.token');

        // Render again to check logout behavior
        renderWithProviders(<SignIn />);

        // Click logout button
        const logoutButton = screen.getByRole('button', { name: /Logout/i });
        fireEvent.click(logoutButton);

        expect(localStorage.getItem('authToken')).toBeNull(); // Ensure token is removed
        expect(mockNavigate).toHaveBeenCalledWith('/signin'); // Redirect to sign-in page
    });

});
