
import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import TopBar from '../Components/TopBar';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../Components/NavBar';

interface IClient {
  clientId: number;
  orgId: string;
  name: string;
  phone: string;
  email: string;
}

const ClientManagement: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<IClient[]>([]);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:8008/clients');
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchName.toLowerCase())
  );

  const handleClientClick = (clientId: number) => {
    navigate(`/client/${clientId}`);
  };

  const handleAddClient = () => {
    navigate('/clientInput');
  };
  

  return (
    <div style={{ backgroundColor: '#546a7b', minHeight: '100vh', color: '#fff' }}>
      <NavBar />
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
            onChange={handleSearch}
            style={{ ...styles.searchInput, color: 'black' }}
          />
        </div>
        <h3 style={styles.clientListTitle}>Client List</h3>
        <div style={styles.clientList}>
          {filteredClients.length > 0 ? (
            filteredClients.map(client => (
              <div key={client.clientId} style={styles.clientItem} onClick={() => handleClientClick(client.clientId)}>
                <FaUser style={styles.userIcon} />
                <div style={styles.clientDetails}>
                  <p style={styles.clientName}>{client.name}</p>
                  <p>{client.email}</p>
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
    transition: 'background-color 0.3s',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
  },
  clientListTitle: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    textAlign: 'center',
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
    transition: 'background-color 0.2s',
  },
  clientItemHovered: {
    backgroundColor: '#3b515d',
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
