import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Button, IconButton, Avatar, Float, Circle } from '@chakra-ui/react';
import { Tooltip } from "../Components/ui/tooltip";
import { toast } from 'react-toastify';
import axios from 'axios';

export interface User {
  org_id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

const NavBar: React.FC = () => {
  const [Role, setRole] = useState<string>("");

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const email = sessionStorage.getItem('email') || 0;
        const response = await axios.get<User>(`http://localhost:9000/get/${email}`);
        if (response.status !== 200) {
          throw new Error('No user found');
        }
        setRole(response.data.role)
      } catch (error) {
        console.error('Failed to fetch unique employee ID:', error);
        toast.error('Failed to fetch unique employee ID.');
      }
    };

    fetchEmployeeId();
  }, []);

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
  const handleUser = () => {
    navigate('/userManagement');
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
        { (Role === 'admin' || Role === 'sa') && <Button background="white" marginRight="1rem" color="#546a7b" onClick={handleUser}>
          User
        </Button>}
        <Button background="white" marginRight="1rem" color="#546a7b" onClick={handleSignOut}>
          SignOut
        </Button>
      </Box>
    </Box>
  );
};

export default NavBar;
