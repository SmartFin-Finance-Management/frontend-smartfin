import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h1>Organization Details</h1>
            <h2>{orgData.name}</h2>
            {/* <p><strong>Organization ID:</strong> {orgData.org_id}</p> */}
            <p><strong>Type:</strong> {orgData.type || 'N/A'}</p>
            <p><strong>Address:</strong> {orgData.address || 'N/A'}</p>
            <p><strong>Contact Info:</strong> {orgData.contact_info || 'N/A'}</p>

            <div style={{ marginTop: '20px' }}>
                <button onClick={handleDelete} style={{ marginRight: '10px', padding: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Delete Organization
                </button>
                <button onClick={handleSignOut} style={{ padding: '10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
