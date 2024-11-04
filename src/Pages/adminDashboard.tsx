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

    return (
        <div>
            <h1>Organizations</h1>
            <table>
                <thead>
                    <tr>
                        <th>Org ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Address</th>
                        <th>Contact Info</th>
                        <th>No. of Employees</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {organizations.map((org) => (
                        <tr key={org.org_id}>
                            <td>{org.org_id}</td>
                            <td>{org.name}</td>
                            <td>{org.type}</td>
                            <td>{org.address}</td>
                            <td>{org.contact_info}</td>
                            <td>{org.numberOfEmployees}</td>
                            <td>
                                <button onClick={() => handleDelete(org.org_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrganizationTable;
