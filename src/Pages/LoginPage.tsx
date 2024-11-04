// src/LoginPage.tsx
import React, { useState } from 'react';
import { Input, Button, Box, Stack, Text } from '@chakra-ui/react';
import { Field } from '../Components/ui/field';
import { PasswordInput } from "../Components/ui/password-input";
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import TopBarLogin from '../Components/topbarlogin';
import axios from 'axios';
import NavBar from '../Components/NavBar';


const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State to manage username and password input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCancel = () => {
    navigate('/');
  };

  const handleSignIn = async () => {
    try {
      // Prepare login data
      const loginData = {
        email,
        password,
      };

      // Call the login endpoint
      const response = await axios.post('http://localhost:7000/api/auth/login', loginData);

      // Assuming the response contains a token
      const token = response.data.token; // Adjust based on your API response structure

      // Save the token to session storage
      sessionStorage.setItem('authToken', token);
      

      // Navigate to the home page or wherever appropriate
      navigate('/thome');
    } catch (error) {
      console.error('Login failed:', error);
      // Optionally handle errors, such as showing a notification or an error message
      alert('Login failed. Please check your username and password.'); // Replace with a better UI notification in production
    }
  };

  return (
    <Box>
      <TopBarLogin />
      <div className="login-container">
        <Box className="card-root">
          <div className="card-header">
            <Text as="h2" className="card-title">Sign In</Text>
          </div>
          <div className="card-body">
            <Stack>
              <Field label="Email">
                <Input 
                  className="input-field" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </Field>
              <Field label="Password">
                <PasswordInput 
                  placeholder="Enter your password" 
                  size="lg" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
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
