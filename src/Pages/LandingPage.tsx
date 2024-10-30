// src/LandingPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Heading, Image, Stack, Text, VStack } from '@chakra-ui/react';
import TopBar from '../Components/TopBar';

import Footer from '../Components/Footer';
import Getstarted from '../Components/getstarted';

const LandingPage: React.FC = () => {


 



  return (
    <Box className="landing-page">
    <Box
      as="section"
      minHeight="100vh"
      color="white"
      padding="8"
      bgImage="url('https://static.vecteezy.com/system/resources/previews/016/741/794/non_2x/financial-management-concept-and-investment-flat-design-of-payment-and-finance-with-money-cash-banknote-calculator-credit-card-pile-coins-and-coins-stack-illustration-and-banner-template-free-vector.jpg')"
      bgSize="cover"
      // bgPosition="center"
      bgRepeat="no-repeat"
      position="relative"
    >
      {/* Overlay to darken background for readability */}
      <Box position="absolute" top="0" left="0" width="100%" height="100%" bg="blackAlpha.700" zIndex="1" />
  
      {/* TopBar positioned above the background */}
      <Box position="relative" zIndex="2">
        <TopBar />
      </Box>
  
      {/* Main Content */}
      <Stack align="center" justify="center" textAlign="center" height="80vh" position="relative" zIndex="2">
        {/* Logo */}
        <Box bg="white" p="6" borderRadius="md" marginBottom="4">
          <Heading as="h1" fontSize="4xl" color="#546a7b">
            Smart Fin
          </Heading>
        </Box>
  
        {/* Heading */}
        <Heading as="h2" fontSize="4xl" fontWeight="bold" maxWidth="80%" color="white">
          Empower Your Financial Future: Streamline and Track Organizational Finances
        </Heading>
  
        {/* Subheading */}
        <Text fontSize="lg" color="purple.200" marginTop="4">
          Simplifying finance tracking for better decision-making and organizational success.
        </Text>
        <Getstarted />
        
      </Stack>
      
    </Box>
   
    {/* Footer positioned above the background */}
    <Box position="relative" zIndex="2">
      <Footer />
    </Box>
  </Box>
  
  

  );
};

export default LandingPage;
