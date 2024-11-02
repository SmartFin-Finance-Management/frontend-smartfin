// src/RegistrationPage.tsx
import React, { useEffect, useState } from 'react';
import { Input, Button, Box, Stack, Text } from '@chakra-ui/react';
import { Field } from '../Components/ui/field';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import TopBarRegister from '../Components/TopBarRegister';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import NavBar from '../Components/NavBar';

interface RegistrationData {
    username: string;
    email: string;
    password: string; // Ideally, you shouldn't send passwords to the backend
    org_id :number;
    role:String;
  }
  
  interface OrgDetailsData {
    org_id: number;
    name: string;
    type: string;
    address: string;
    contactInfo: string;
  }
  
  const OrgDetails: React.FC = () => {
    const navigate = useNavigate();
    const [orgName, setOrgName] = useState('');
    const [orgType, setOrgType] = useState('');
    const [address, setAddress] = useState('');
    const [contactInfo, setContactInfo] = useState('');
  
    useEffect(() => {
      // Optional: Retrieve data from session storage and clear if needed
      const username = sessionStorage.getItem('username');
      const email = sessionStorage.getItem('email');
      const password = sessionStorage.getItem('password'); // Avoid using this in production
      // If you want to clear after retrieving:
      // sessionStorage.clear(); // Uncomment to clear storage if needed
  
      if (!username || !email || !password) {
        // Handle case where session data is not available
        toast.error("No registration data found.");
        navigate('/register'); // Redirect if no data
      }
    }, [navigate]);
  
    const handleCancel = () => {
      navigate('/register');
    };
  
    const handleRegister = async () => {
      // Retrieve data from session storage
      const username = sessionStorage.getItem('username') || '';
      const email = sessionStorage.getItem('email') || '';
      const password = sessionStorage.getItem('password') || ''; // Avoid using this in production
      const response = await axios.get('http://localhost:7000/api/organisations/Orgp');
    
      // Assuming the API response has a structure like { org_id: <some value> }
      const org_id = Number(response.data.max_org_id)+1;
      console.log(org_id)
      // Create data objects
      const registrationData: RegistrationData = {
        username,
        email,
        password,
        org_id:org_id,
        role:"admin"
      };
  
      const orgDetailsData: OrgDetailsData = {
        name: orgName,
        type: orgType,
        address,
        contactInfo,
        org_id:org_id
      };
  
      try {
        // Send registration data to the first endpoint
        await axios.post('http://localhost:7000/api/auth/register', registrationData);
        // Send organization details to the second endpoint
        await axios.post('http://localhost:7000/api/organisations/Orgp', orgDetailsData);
  
        // Show success message
        toast.success("Account successfully created", {
          position: "top-center",
          autoClose: 2000,
        });
  
        // Redirect to the login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while registering. Please try again.");
      }
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
              <Stack>
                <Field label="Name">
                  <Input className="input-field" placeholder="Enter your organization name" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                </Field>
                <Field label="Type">
                  <Input className="input-field" placeholder="Enter your organization type" value={orgType} onChange={(e) => setOrgType(e.target.value)} />
                </Field>
                <Field label="Address">
                  <Input className="input-field" placeholder="Enter your ADDRESS" value={address} onChange={(e) => setAddress(e.target.value)} />
                </Field>
                <Field label="Contact-info">
                  <Input className="input-field" placeholder="Enter your contact-info" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} />
                </Field>
              </Stack>
            </div>
            <div className="card-footer">
              <Button className="gets" onClick={handleRegister}>Register</Button>
              <ToastContainer />
              <Button className="gets" onClick={handleCancel}>Cancel</Button>
            </div>
          </Box>
          <Footer />
        </div>
      </Box>
    );
  };

export default OrgDetails;
