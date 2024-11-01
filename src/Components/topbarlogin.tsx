// src/Components/TopBar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Button } from '@chakra-ui/react';
import { Tooltip } from "./ui/tooltip";

const TopBarLogin: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

 

  return (
  
     
    <Box as="header" className='gets'  display="flex" justifyContent="space-between" alignItems="center" padding="1rem"  color="white">
    {/* Increased font size to '2xl' and added custom font size */}
    <Heading as="h2"  fontFamily="'Playfair Display', serif" fontSize="2rem"  >SmartFin</Heading>
    <Box>
      <Tooltip content="Click here to Register">
        <Button background={'white'} marginRight="1rem" color={'#546a7b'} onClick={handleRegister}>Register</Button>
      </Tooltip>
      
    </Box>
  </Box>
    
  );
};

export default TopBarLogin;
