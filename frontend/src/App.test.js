// App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import App from './App';

// Mock the components
jest.mock('./Pages/Todo', () => () => <div>Todo Component</div>);
jest.mock('./Pages/Login', () => () => <div>Login Component</div>);
jest.mock('./Pages/Signup', () => () => <div>Signup Component</div>);

const mockStore = configureStore([]);

describe('App Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        userInfo: null,
      },
    });
  });

  test('renders Todo component on root path', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText('Todo Component')).toBeInTheDocument();
  });

  test('renders Login component on /login path', () => {
    window.history.pushState({}, '', '/login');
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });

  test('renders Signup component on /signup path', () => {
    window.history.pushState({}, '', '/signup');
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText('Signup Component')).toBeInTheDocument();
  });
});