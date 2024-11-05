import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import UpdateModal from './Updatemodal'; // Importing the UpdateModal component

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
    const [modalOpen, setModalOpen] = useState<boolean>(false); // State to control modal visibility
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
                const token = sessionStorage.getItem('authToken'); // Assuming token is stored in session storage
                const response = await axios.get<Organisation>(`http://localhost:7000/api/organisations/Org/${orgId}`,{
                    headers: {
                      Authorization: `Bearer ${token}` // Add the token to the Authorization header
                    }
                  });
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
            const token = sessionStorage.getItem('authToken'); // Assuming token is stored in session storage
            await axios.delete(`http://localhost:7000/api/organisations/Org/${orgId}`,{
                headers: {
                  Authorization: `Bearer ${token}` // Add the token to the Authorization header
                }
              });
            sessionStorage.clear();
            navigate('/login'); // Use navigate instead of history.push
        } catch (err) {
            setError('Error deleting organization. Please try again.');
        }
    };

    const handleUpdate = async (updatedData: Organisation) => {
        const orgId = sessionStorage.getItem('org_id');
        if (!orgId) return;

        try {
            const token = sessionStorage.getItem('authToken'); // Assuming token is stored in session storage
            await axios.put(`http://localhost:7000/api/organisations/Org/${orgId}`, updatedData,{
                headers: {
                  Authorization: `Bearer ${token}` // Add the token to the Authorization header
                }
              });
            setOrgData(updatedData); // Update the local state with the new data
            setModalOpen(false); // Close the modal
        } catch (err) {
            setError('Error updating organization. Please try again.');
        }
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
        <div>
            <NavBar />
            <div style={styles.orgDetailsContainer}>
                <h1 style={styles.heading1}>Organization Details</h1>
                <h2 style={styles.heading2}>{orgData.name}</h2>
                <p style={styles.paragraph}><strong>Organization ID:</strong> {orgData.org_id}</p>
                <p style={styles.paragraph}><strong>Type:</strong> {orgData.type || 'N/A'}</p>
                <p style={styles.paragraph}><strong>Address:</strong> {orgData.address || 'N/A'}</p>
                <p style={styles.paragraph}><strong>Contact Info:</strong> {orgData.contact_info || 'N/A'}</p>

                <div style={{ marginTop: '20px' }}>
                    <button style={{ ...styles.button, ...styles.deleteButton }} onClick={handleDelete}>
                        Delete Organization
                    </button>
                    <button style={{ ...styles.button, ...styles.updateButton }} onClick={() => setModalOpen(true)}>
                        Update
                    </button>
                </div>
            </div>
            <Footer />

            {/* Update Modal */}
            <UpdateModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                orgData={orgData}
                onUpdate={handleUpdate}
            />
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

    // Specific styles for Update button
    updateButton: {
        backgroundColor: '#28a745' // Bootstrap success color
    },

    // Button hover effects
    hoverEffect: {
        opacity: 0.9 // Slightly transparent on hover
    }
};

export default Profile;

