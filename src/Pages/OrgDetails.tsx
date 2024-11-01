// src/RegistrationPage.tsx
import React from 'react';
import { Input, Button, Box, Stack, Text } from '@chakra-ui/react';
import { Field } from '../Components/ui/field';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import TopBarRegister from '../Components/TopBarRegister';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrgDetails: React.FC = () => {

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/register');
  }
  const handleRegister = () => {
    // Show success message
    toast.success("Account successfully created", {
        position: "top-center", // Using string value instead of POSITION enum
        autoClose: 2000, // Duration for the toast to be displayed
      });

    // Redirect to the login page after a short delay
    setTimeout(() => {
      navigate('/login');
    }, 2000); // Adjust delay as needed
  };
  return (
    <Box>
    <TopBarRegister />
    <div className="login-container">
      <Box className="card-roots">
        <div className="card-header">
          <Text as="h2" className="card-title">Organization Details</Text>
        </div>
        <div className="card-body">
          <Stack >
            <Field label="Name">
              <Input className="input-field" placeholder="Enter your organization name" />
            </Field>
            <Field label="Type">
              <Input className="input-field" type="email" placeholder="Enter your organization type" />
            </Field>
            <Field label="Address">
              <Input className="input-field" placeholder="Enter your ADDRESS" />
            </Field>
            <Field label="Contact-info">
              <Input className="input-field" placeholder="Enter your contact-info" />
            </Field>
          </Stack>
        </div>
        <div className="card-footer">
          <Button className="gets" onClick={handleRegister} >Register</Button>
          <ToastContainer />
          <Button className="gets" onClick={handleCancel}>Cancel</Button>
        </div>
      </Box>
      <Footer/>
    </div>
    </Box>
  );
};

export default OrgDetails;
