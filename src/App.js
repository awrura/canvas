import { useState, useEffect } from 'react';
import './App.css';
import MatrixGrid from './MatrixGrid';
import { Container, Navbar, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

// Настройка axios
const api = axios.create({
  baseURL: 'https://hub.twoics.ru/' 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      
      try {
        const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        return api(originalRequest);
      } catch (e) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setIsAuthenticated(true);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || 'Login failed');
    }
  };

  const handleRegister = async (username, password, passConfirm) => {
    try {
      await api.post('/auth/register', { 
        username, 
        password, 
        pass_confirm: passConfirm 
      });
      setShowLogin(true);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || 'Registration failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <Navbar className="bg-body-tertiary mb-4">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="awrura.png"
              width="35"
              height="35"
              className="d-inline-block align-top"
            />{' '}
            Awrura
          </Navbar.Brand>
          {isAuthenticated && (
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Container>
      </Navbar>

      <Container>
        {!isAuthenticated ? (
          <>
            {showLogin ? (
              <LoginForm
                onLogin={handleLogin}
                onSwitchRegister={() => {
                  setShowLogin(false);
                  setErrorMessage('');
                }}
                error={errorMessage}
              />
            ) : (
              <RegisterForm
                onRegister={handleRegister}
                onSwitchLogin={() => {
                  setShowLogin(true);
                  setErrorMessage('');
                }}
                error={errorMessage}
              />
            )}
          </>
        ) : (
          <MatrixGrid api={api} />
        )}
      </Container>
    </div>
  );
}

export default App;
