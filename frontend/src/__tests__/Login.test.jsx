import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Login from '../Pages/Login';
import { ToastContainer } from 'react-toastify';
import { login as mockLogin } from '../Services';
import { useGoogleLogin } from '@react-oauth/google';

// Mocking the services
jest.mock('../Services', () => ({
  login: jest.fn(),
  glogin: jest.fn(),
}));

jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: jest.fn(),
}));

const mockStore = configureStore([]);

describe('Login Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { userInfo: null },
    });

    mockLogin.mockClear();
    useGoogleLogin.mockClear();
    localStorage.clear();  // Clear localStorage before each test
  });

  afterEach(() => {
    jest.clearAllMocks();  // Clear all mocks after each test
  });

  it('renders login form', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
  });

  it('updates email and password fields', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });


  it('handles login success', async () => {
    mockLogin.mockResolvedValueOnce({
      status: true,
      user: { email: 'test@example.com' },
      token: 'fakeToken',
      message: 'Login successful',
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
        <ToastContainer />
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByTestId('login-button');

    fireEvent.change(emailInput, { target: { value: 'nayak@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Prakash@1' } });
    fireEvent.click(loginButton);

    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith('nayak@gmail.com', 'Prakash@1')
    );

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('todoToken')).toBe('fakeToken');
    expect(await screen.findByText(/login successful/i)).toBeInTheDocument();
  });

  it('handles login failure', async () => {
    mockLogin.mockResolvedValueOnce({
      status: false,
      message: 'Invalid credentials',
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
        <ToastContainer />
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByTestId('login-button');


    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('shows error message for empty form submission', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
        <ToastContainer />
      </Provider>
    );

    const loginButton = screen.getByTestId('login-button');

    fireEvent.click(loginButton);

    expect(await screen.findByText(/Please fill all the fields/i)).toBeInTheDocument();
  });
});
