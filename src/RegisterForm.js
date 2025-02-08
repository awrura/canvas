import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const RegisterForm = ({ onRegister, onSwitchLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passConfirm, setPassConfirm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== passConfirm) {
      alert("Passwords don't match!");
      return;
    }
    onRegister(username, password, passConfirm);
  };

  return (
    <div className="auth-form">
      <h2 className="mb-4">Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={passConfirm}
            onChange={(e) => setPassConfirm(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mb-3">
          Register
        </Button>
        
        <div className="text-center">
          <Button variant="link" onClick={onSwitchLogin}>
            Already have an account? Login
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
