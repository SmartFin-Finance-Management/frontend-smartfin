// src/RegistrationPage.tsx
import React from 'react';
import { Input, Button, Box, Stack, Text } from '@chakra-ui/react';
import { Field } from '../Components/ui/field';
import { PasswordInput } from "../Components/ui/password-input";
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import TopBarRegister from '../Components/TopBarRegister';

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  const handleCancel = () => {
    navigate('/');
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character.';
    return null;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleRegister = () => {
    // Validate password and confirm password
    if (passwordError) {
      alert(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Save data in session storage (Do not store passwords in plain text in real applications)
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('password', password);
    
    navigate('/orgdetails');
  };

  return (
    <Box>
      <TopBarRegister />
      <div className="login-container">
        <Box className="card-roots">
          <div className="card-header">
            <Text as="h2" className="card-title">Register</Text>
            <Text className="card-description">Create your account by filling out the details below.</Text>
          </div>
          <div className="card-body">
            <Stack>
              <Field label="Username">
                <Input className="input-field" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </Field>
              <Field label="Email">
                <Input className="input-field" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field label="Password">
                <PasswordInput placeholder="Create a password" value={password} onChange={handlePasswordChange} />
                {passwordError && <Text color="red.500" fontSize="sm">{passwordError}</Text>}
              </Field>
              <Field label="Confirm Password">
                <PasswordInput placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </Field>
            </Stack>
          </div>
          <div className="card-footer">
            <Button className="gets" onClick={handleRegister}>Next</Button>
            <Button className="gets" onClick={handleCancel}>Cancel</Button>
          </div>
        </Box>
        <Footer />
      </div>
    </Box>
  );
};

export default RegistrationPage;
