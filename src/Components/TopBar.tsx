// src/Components/TopBar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Button } from '@chakra-ui/react';
import { Tooltip } from "../Components/ui/tooltip";

const TopBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleEmployeeFormPage = () => {
    navigate('/EmployeeFormPage');
  };

  const handleProject = () => {
    navigate('/project');
  }



  return (
    // <Box as="header" display="flex" justifyContent="space-between" alignItems="center" padding="1rem"  color="white">
    //{/* Increased font size to '2xl' and added custom font size */}

    <Box>
      <Tooltip content="Click here to Login">
        <Button className='gets' marginRight="1rem" onClick={handleLogin}>Login</Button>
      </Tooltip>
      <Tooltip content="Click here to Register">
        <Button className='gets' marginRight="1rem" onClick={handleRegister}>Register</Button>
      </Tooltip>
      <Tooltip content="Click here to EmployeeFormPage">
        <Button colorScheme="teal" marginRight="1rem" onClick={handleEmployeeFormPage}>EmployeeFormPage</Button>
      </Tooltip>
      <Tooltip content="Click here to ProjectDashBoard">
        <Button colorScheme="teal" marginRight="1rem" onClick={handleProject}>ProjectDetailsPage</Button>
      </Tooltip>
    </Box>
    // </Box>
  );
};

export default TopBar;
