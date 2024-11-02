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
    navigate('/EmployeeFormPage');
  };

  const handleProfile = () => {
    navigate('/organaisation');
  };

  return (
    <Box as="header" className="gets" display="flex" justifyContent="space-between" alignItems="center" padding="1rem" color="white">
      
      {/* Left section with icon and title */}
      <Box display="flex" alignItems="center">
        <Tooltip content="Go to Profile Page" >
        <Avatar.Root colorPalette="cyan" variant="subtle" onClick={handleProfile} style={{ cursor: 'pointer' }}>
            <Avatar.Fallback>SF</Avatar.Fallback>
            <Float placement="bottom-end" offsetX="1" offsetY="1">
            </Float>
          </Avatar.Root>
        </Tooltip>
      </Box>

      {/* Right section with navigation buttons */}
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
        
      </Box>
    </Box>
  );
};

export default NavBar;
