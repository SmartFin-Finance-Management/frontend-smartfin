// src/Components/TopBar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Button } from '@chakra-ui/react';


const Getstarted: React.FC = () => {
  const navigate = useNavigate();



  const handleRegister = () => {
    navigate('/register');
  };

  return (

     
      <Box>
        
        <Button className="gets" colorScheme="purple" size="lg" marginTop="8" onClick={handleRegister}>
      Get Started
    </Button>
      </Box>
      
     
   
  );
};

export default Getstarted;