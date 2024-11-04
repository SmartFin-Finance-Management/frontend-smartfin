import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar';

// Define the interface for Organisation
interface Organisation {
    org_id: number;
    name: string;
    type?: string; // Optional property
    address?: string; // Optional property
    contact_info?: string; // Optional property
}

const Profile: React.FC = () => {
    // Use the defined Organisation interface
    const [orgData, setOrgData] = useState<Organisation | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    useEffect(() => {
        const fetchOrgData = async () => {
            const orgId = sessionStorage.getItem('org_id');
            if (!orgId) {
                setError('No organization ID found in session storage.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get<Organisation>(`http://localhost:5000/Org/${orgId}`);
                setOrgData(response.data); // TypeScript knows that response.data is an Organisation
            } catch (err) {
                setError('Error fetching organization details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrgData();
    }, []);

    const handleDelete = async () => {
        const orgId = sessionStorage.getItem('org_id');
        if (!orgId) {
            setError('No organization ID found in session storage.');
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/Org/${orgId}`);
            sessionStorage.clear();
            navigate('/login'); // Use navigate instead of history.push
        } catch (err) {
            setError('Error deleting organization. Please try again.');
        }
    };

    const handleSignOut = () => {
        sessionStorage.clear();
        navigate('/login'); // Use navigate instead of history.push
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!orgData) {
        return <div>No organization data available.</div>;
    }

    return (
        <div className="org-details-container">
            <NavBar />
        <h1>Organization Details</h1>
        <h2>{orgData.name}</h2>
        <p><strong>Organization ID:</strong> {orgData.org_id}</p>
        <p><strong>Type:</strong> {orgData.type || 'N/A'}</p>
        <p><strong>Address:</strong> {orgData.address || 'N/A'}</p>
        <p><strong>Contact Info:</strong> {orgData.contact_info || 'N/A'}</p>

        <div style={{ marginTop: '20px' }}>
            <button onClick={handleDelete} style={{ marginRight: '10px' }}>
                Delete Organization
            </button>
            <button onClick={handleSignOut}>
                Sign Out
            </button>
        </div>
    </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    // Container for the organization details
    orgDetailsContainer: {
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        maxWidth: '600px', // Set a maximum width for better readability
        margin: '20px auto', // Center the container
        backgroundColor: '#f9f9f9', // Light background for contrast
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' // Subtle shadow for depth
    },

    // Headings for organization details
    heading1: {
        fontSize: '24px',
        color: '#333', // Darker color for headings
        marginBottom: '10px'
    },

    heading2: {
        fontSize: '20px',
        color: '#007bff', // Bootstrap primary color for emphasis
        marginBottom: '15px'
    },

    // Paragraph styling for organization information
    paragraph: {
        fontSize: '16px',
        color: '#555', // Slightly lighter color for text
        margin: '5px 0'
    },

    // Button styling
    button: {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        color: 'white', // Text color for buttons
        cursor: 'pointer', // Pointer cursor on hover
        transition: 'background-color 0.3s ease' // Smooth transition
    },

    // Specific styles for Delete button
    deleteButton: {
        backgroundColor: '#dc3545' // Bootstrap danger color
    },

    // Specific styles for Sign Out button
    signOutButton: {
        backgroundColor: '#007bff' // Bootstrap primary color
    },

    // Button hover effects
    hoverEffect: {
        opacity: 0.9 // Slightly transparent on hover
    }
};



export default Profile;
