import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SignUp from '../../src/pages/SignUp';
import '@testing-library/jest-dom';

// Mock for react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ pathname: '/signup' }),
    };
});

// Mock for @react-oauth/google
vi.mock('@react-oauth/google', () => ({
    GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
    GoogleLogin: ({ onSuccess, onError }) => (
        <button onClick={() => onSuccess({ credential: 'mocked.credential.token' })}>
            Mock Google Login
        </button>
    ),
}));

describe('SignUp Component', () => {
    beforeEach(() => {
        // Render the SignUp component
        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );
    });

    afterEach(() => {
        vi.resetAllMocks(); // Reset mocks after each test
    });

    // Test case: Renders the sign-up form
    test('renders the Sign Up form', () => {
        expect(screen.getByText(/Sign Up Now!/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/User Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /Sign Up/i })).toHaveLength(2); // Ensure there are two buttons
    });

    // Test case: Handles Google login failure
    test('handles Google login failure', async () => {
        // Override Google login mock to simulate failure
        vi.mock('@react-oauth/google', () => ({
            GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
            GoogleLogin: ({ onSuccess, onError }) => (
                <button onClick={() => onError(new Error('Google login failed'))}>
                    Mock Google Login
                </button>
            ),
        }));

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const googleLoginButton = screen.getByRole('button', { name: /Mock Google Login/i });
        fireEvent.click(googleLoginButton);

        expect(consoleSpy).toHaveBeenCalledWith('Google login failed:', expect.any(Error));
        consoleSpy.mockRestore();
    });

    // Test case: Handles standard sign-up form submissio
    // test('handles standard sign-up form submission', async () => {
    //     const usernameInput = screen.getByLabelText(/User Name/i);
    //     const emailInput = screen.getByLabelText(/Email/i);
    //     const passwordInput = screen.getByLabelText(/Password/i);
        
    //     // Select the correct sign-up button
    //     const signUpButton = screen.getAllByRole('button', { name: /Sign Up/i })[1]; // Assuming the second one is for form submission

    //     // Simulate user input
    //     fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    //     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    //     fireEvent.change(passwordInput, { target: { value: 'password123' } });

    //     // Mock fetch response for standard sign-up
    //     global.fetch = vi.fn(() =>
    //         Promise.resolve({
    //             ok: true,
    //             json: () => Promise.resolve({ message: 'Signup successful' }),
    //         })
    //     );

        // // Mock handleFormSubmit
        // const handleFormSubmit = vi.fn(async (event) => {
        //     event.preventDefault();
        //     const form = event.currentTarget;
        //     const username = form.username.value;
        //     const email = form.email.value;
        //     const password = form.password.value;

        //     // Assuming you want to mock a successful sign-up
        //     if (username && email && password) {
        //         mockNavigate('/signin');
        //     }
        // });

        // // Ensure the sign-up form is handling the submission
        // const form = screen.getByRole('form');
        // form.addEventListener('submit', handleFormSubmit);

        // // Simulate form submission
        // fireEvent.submit(form);

        // // Wait for the mockNavigate call
        // await new Promise(r => setTimeout(r, 0));
        // expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
// });
