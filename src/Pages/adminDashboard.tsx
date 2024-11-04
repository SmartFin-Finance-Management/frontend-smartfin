import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the Organisation interface based on your structure
export interface Organisation {
    org_id: number;
    name: string;
    type: string;
    address: string;
    contact_info: string;
}

interface OrganisationWithEmployeeCount extends Organisation {
    numberOfEmployees: number;
}

const OrganizationTable: React.FC = () => {
    const [organizations, setOrganizations] = useState<OrganisationWithEmployeeCount[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrganizations = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all organizations
                const orgResponse = await axios.get<Organisation[]>('http://localhost:5000/Org');
                const orgs = orgResponse.data;

                console.log(orgs);
                

                // Map to get the number of employees for each organization
                const orgsWithEmployees = await Promise.all(
                    orgs.map(async (org) => {
                        const empResponse = await axios.get(`http://localhost:5000/${org.org_id}/employees`);
                        return {
                            ...org,
                            numberOfEmployees: empResponse.data.length,
                        };
                    })
                );

                setOrganizations(orgsWithEmployees);
            } catch (error) {
                console.error('Error fetching organizations:'+error, error);
                setError('Failed to fetch organizations.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    const handleDelete = async (orgId: number) => {
        try {
            await axios.delete(`http://localhost:5000/Org/${orgId}`);
            setOrganizations(organizations.filter(org => org.org_id !== orgId));
        } catch (error) {
            console.error('Error deleting organization:', error);
            setError('Failed to delete organization.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
    };

    const thStyle = {
        backgroundColor: '#f2f2f2',
        border: '1px solid #ddd',
        padding: '8px',
    };

    const tdStyle = {
        border: '1px solid #ddd',
        padding: '8px',
    };

    const buttonStyle = {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer',
    };

    return (
        <div>
            <h1>Organizations</h1>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Org ID</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Type</th>
                        <th style={thStyle}>Address</th>
                        <th style={thStyle}>Contact Info</th>
                        <th style={thStyle}>No. of Employees</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {organizations.map((org) => (
                        <tr key={org.org_id}>
                            <td style={tdStyle}>{org.org_id}</td>
                            <td style={tdStyle}>{org.name}</td>
                            <td style={tdStyle}>{org.type}</td>
                            <td style={tdStyle}>{org.address}</td>
                            <td style={tdStyle}>{org.contact_info}</td>
                            <td style={tdStyle}>{org.numberOfEmployees}</td>
                            <td style={tdStyle}>
                                <button style={buttonStyle} onClick={() => handleDelete(org.org_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrganizationTable;
