import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Button, IconButton, Avatar, Float, Circle } from '@chakra-ui/react';
import { Tooltip } from "../Components/ui/tooltip";



const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleProject = () => {
    navigate('/project');
  };

  const handleClient = () => {
    navigate('/clientManagement');
  };

  const handleEmployee = () => {
    navigate('/EmployeeDetailsPage');
  };

  const handleProfile = () => {
    navigate('/profile');
  };
  const handleHome = () => {
    navigate('/home');
  };

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate('/login'); // Use navigate instead of history.push
};

  return (
    <Box as="header" display="flex" justifyContent="space-between" alignItems="center" padding="1rem" bg="#546a7b" color="white" boxShadow="md">
      {/* Left Section with Avatar and Heading */}
      <Box display="flex" alignItems="center">
        <Tooltip content="Go to Profile Page" >
          <Avatar.Root
            onClick={handleProfile}
            bg="cyan.500"
            color="white"
            cursor="pointer"
            size="md"
            marginRight="1rem"
          >
            SF
          </Avatar.Root>
        </Tooltip>
        <Heading
          as="h1"
          fontSize="2.5rem"
          fontWeight="bold"
          color="white"
          onClick={handleHome}
          cursor="pointer"
          marginLeft="1rem"
        >
          SmartFin
        </Heading>
      </Box>

      {/* Right Section with Navigation Buttons */}
      <Box display="flex" alignItems="center">
        <Button background="white" marginRight="1rem" color="#546a7b" onClick={handleEmployee}>
          Employee
        </Button>
        <Button background="white" marginRight="1rem" color="#546a7b" onClick={handleProject}>
          Project
        </Button>
        <Button background="white" marginRight="1rem" color="#546a7b" onClick={handleClient}>
          Client
        </Button>
        <Button background="white" marginRight="1rem" color="#546a7b" onClick={handleSignOut}>
          SignOut
        </Button>
      </Box>
    </Box>
  );
};

export default NavBar;
