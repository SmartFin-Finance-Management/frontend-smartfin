// src/RegistrationPage.tsx
import React from 'react';
import { Input, Button, Box, Stack, Text } from '@chakra-ui/react';
import { Field } from '../Components/ui/field';
import { PasswordInput } from "../Components/ui/password-input";
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';

const RegistrationPage: React.FC = () => {

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/');
  }
  return (
    <div className="login-container">
      <Box className="card-root">
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
              <PasswordInput className="input-field" placeholder="Create a password" />
            </Field>
            <Field label="Confirm Password">
              <PasswordInput className="input-field" placeholder="Confirm your password" />
            </Field>
          </Stack>
        </div>
        <div className="card-footer">
          <Button className="button button-solid" >Register</Button>
          <Button className="button button-outline" onClick={handleCancel}>Cancel</Button>
        </div>
      </Box>
      <Footer/>
    </div>
  );
};

export default RegistrationPage;
