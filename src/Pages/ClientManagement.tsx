import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa'; // Importing user icon from react-icons
import TopBar from '../Components/TopBar';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';

interface IClient {
  client_id: number;
  organization: string;
  name: string;
  phone: string;
  email: string;
}

const ClientManagement: React.FC = () => {
  const navigate = useNavigate(); // Using useNavigate instead of useHistory
  
  // Sample clients data
  const [clients, setClients] = useState<IClient[]>
   ([]);
//   ([
//     { client_id: 1, organization: 'ABC Corp', name: 'John Doe', phone: '123-456-7890', email: 'john@example.com' },
//     { client_id: 2, organization: 'XYZ Inc', name: 'Jane Smith', phone: '987-654-3210', email: 'jane@example.com' },
//     { client_id: 3, organization: 'Tech Solutions', name: 'Alice Johnson', phone: '456-789-0123', email: 'alice@example.com' },
//     { client_id: 4, organization: 'Global Corp', name: 'Bob Brown', phone: '321-654-9870', email: 'bob@example.com' },
//   ]);
  
  const [searchName, setSearchName] = useState('');
  const [searchOrg, setSearchOrg] = useState('');
  const [filteredClients, setFilteredClients] = useState<IClient[]>(clients);

  const handleSearch = () => {
    const results = clients.filter(client =>
      client.name.toLowerCase().includes(searchName.toLowerCase()) &&
      client.organization.toLowerCase().includes(searchOrg.toLowerCase())
    );
    setFilteredClients(results);
  };

  const handleClientClick = (client: IClient) => {
    navigate('/clientInput', { state: { client } }); // Pass client details to the input page
  };

  const handleAddClient = () => {
    navigate('/clientInput'); // Navigate to client input page
  };

  return (
    <div style={{ backgroundColor: '#546a7b', minHeight: '100vh', color: '#fff' }}>
      <TopBar />
      <div style={styles.container}>
        <h2 style={styles.title}>Client Overview</h2>
        <button style={styles.addButton} onClick={handleAddClient}>
          Add a Client
        </button>
        <div style={styles.filterContainer}>
          <input
            type="text"
            placeholder="Search by Client Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ ...styles.searchInput, color: 'black' }} // Set text color to black
          />
          {/* <input
            type="text"
            placeholder="Search by Organization"
            value={searchOrg}
            onChange={(e) => setSearchOrg(e.target.value)}
            style={{ ...styles.searchInput, color: 'black' }} // Set text color to black
          /> */}
          <button onClick={handleSearch} style={styles.searchButton}>
            Search
          </button>
        </div>
        <h3 style={styles.clientListTitle}>Client List</h3>
        <div style={styles.clientList}>
          {filteredClients.length > 0 ? (
            filteredClients.map(client => (
              <div key={client.client_id} style={styles.clientItem} onClick={() => handleClientClick(client)}>
                <FaUser style={styles.userIcon} />
                <div style={styles.clientDetails}>
                  <p style={styles.clientName}>{client.name}</p>
                  <p>{client.email}</p>
                  <p>{client.organization}</p>
                </div>
              </div>
            ))
          ) : (
            <p style={styles.noResults}>No clients found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '20px',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '85%',
  },
  searchButton: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  clientListTitle: {
    fontSize: '1.5rem',
    marginBottom: '10px',
  },
  clientList: {
    backgroundColor: '#4a626e',
    borderRadius: '5px',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  clientItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ccc',
    cursor: 'pointer',
  },
  userIcon: {
    fontSize: '2rem',
    marginRight: '10px',
    color: '#4CAF50',
  },
  clientDetails: {
    color: '#fff',
  },
  clientName: {
    fontWeight: 'bold',
    margin: 0,
  },
  noResults: {
    textAlign: 'center',
    color: '#fff',
  },
};

export default ClientManagement;
