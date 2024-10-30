// src/LoginPage.tsx
import React from 'react';
import { Input, Button, Box, Stack, Text } from '@chakra-ui/react';
import { Field } from '../Components/ui/field';
import { PasswordInput } from "../Components/ui/password-input";
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import TopBarLogin from '../Components/topbarlogin';


const LoginPage: React.FC = () => {

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/thome');
  }
  return (
    <Box>
    <TopBarLogin />
    <div className="login-container">
      
      <Box className="card-root">
        <div className="card-header">
          <Text as="h2" className="card-title">Sign In</Text>
        </div>
        <div className="card-body">
          <Stack >
            <Field label="Username">
              <Input className="input-field" placeholder="Enter your username" />
            </Field>
            <Field label="Password">
              <PasswordInput  placeholder="Enter your password" size="lg" />
            </Field>
          </Stack>
        </div>
        <div className="card-footer">
          <Button className="gets" onClick={handleSignIn}>Sign In</Button>
          <Button className="gets" onClick={handleCancel}>Cancel</Button>
        </div>
      </Box>
      <Footer />
    </div>
  </Box>
  );
};

export default LoginPage;
