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

  const handleCancel = () => {
    navigate('/');
  }
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
          <Stack spacing={4}>
            <Field label="Username">
              <Input className="input-field" placeholder="Choose a username" />
            </Field>
            <Field label="Email">
              <Input className="input-field" type="email" placeholder="Enter your email" />
            </Field>
            <Field label="Password">
              <PasswordInput  placeholder="Create a password" />
            </Field>
            <Field label="Confirm Password">
              <PasswordInput  placeholder="Confirm your password" />
            </Field>
          </Stack>
        </div>
        <div className="card-footer">
          <Button className="gets" >Register</Button>
          <Button className="gets" onClick={handleCancel}>Cancel</Button>
        </div>
      </Box>
      <Footer/>
    </div>
    </Box>
  );
};

export default RegistrationPage;
