// tests/SignIn.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SignIn from '../../src/pages/SignIn';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';

// Mocking Google OAuth provider
vi.mock('@react-oauth/google', () => ({
    GoogleLogin: ({ onSuccess }) => (
        <button onClick={() => onSuccess({ credential: 'fake-token' })}>Google Login</button>
    ),
    GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
}));

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

    test('calls Google login success handler', async () => {
        fireEvent.click(screen.getByText(/Google Login/i));

        await waitFor(() => expect(localStorage.getItem('authToken')).toBe('fake-token')); // Ensure token is saved
    });
    });