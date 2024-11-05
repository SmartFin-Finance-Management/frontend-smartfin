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
    password: string;
    org_id :number;
    role: string;
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
    const [contactInfoError, setContactInfoError] = useState<string | null>(null);

    useEffect(() => {
        const username = sessionStorage.getItem('username');
        const email = sessionStorage.getItem('email');
        const password = sessionStorage.getItem('password');
  
        if (!username || !email || !password) {
            toast.error("No registration data found.");
            navigate('/register');
        }
    }, [navigate]);

    const validateContactInfo = (contactInfo: string): string | null => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(contactInfo) ? null : 'Contact info must be a 10-digit number.';
    };

    const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newContactInfo = e.target.value;
        setContactInfo(newContactInfo);
        setContactInfoError(validateContactInfo(newContactInfo));
    };

    const handleCancel = () => {
        navigate('/register');
    };
  
    const handleRegister = async () => {
        const username = sessionStorage.getItem('username') || '';
        const email = sessionStorage.getItem('email') || '';
        const password = sessionStorage.getItem('password') || '';
        const response = await axios.get('http://localhost:7000/api/organisations/Orgp');
        const org_id = Number(response.data.max_org_id) + 1;

        if (contactInfoError) {
            toast.error(contactInfoError);
            return;
        }

        const registrationData: RegistrationData = {
            username,
            email,
            password,
            org_id,
            role: "admin"
        };

        const orgDetailsData: OrgDetailsData = {
            name: orgName,
            type: orgType,
            address,
            contactInfo,
            org_id
        };

        try {
            await axios.post('http://localhost:7000/api/auth/register', registrationData);
            await axios.post('http://localhost:7000/api/organisations/Orgp', orgDetailsData);

            toast.success("Account successfully created", {
                position: "top-center",
                autoClose: 2000,
            });

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
                  <Input className="input-field" placeholder="Enter your address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </Field>
                <Field label="Contact-info">
                  <Input className="input-field" placeholder="Enter your contact info" value={contactInfo} onChange={handleContactInfoChange} />
                  {contactInfoError && <Text color="red.500" fontSize="sm">{contactInfoError}</Text>}
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
