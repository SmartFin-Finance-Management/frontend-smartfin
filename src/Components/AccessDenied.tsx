import React from 'react';
import { Box, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <>
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      height="100vh" 
      bgGradient="linear(to-r, gray.200, gray.100)"
    >
      <VStack 
        spacing={4} 
        p={8} 
        bg="white" 
        rounded="lg" 
        shadow="lg" 
        align="center"
      >
        {/* <Icon as={FaLock} boxSize={16} color="red.500" /> */}
        <Heading as="h1" size="xl" color="red.600" textAlign="center">
          Access Denied
        </Heading>
        <Text fontSize="lg" color="gray.600" textAlign="center" px={6}>
          You do not have permission to view this page. Please contact your administrator if you believe this is an error.
        </Text>
        <Button 
          colorScheme="blue" 
          size="md" 
          onClick={handleGoBack}
        >
          Go to Home
        </Button>
      </VStack>
    </Box>
    </>

  );
};

export default AccessDenied;

