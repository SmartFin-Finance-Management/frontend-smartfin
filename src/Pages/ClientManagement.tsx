import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
        const response = await axios.get('http://localhost:7000/api/clients/clients',{
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the Authorization header
          }
        });
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

  return (<div style={{ backgroundColor: '#546a7b', minHeight: '100vh' }}>
      <NavBar />
    <div style={styles.container}>
      
      <div style={styles.innerContainer}>
        <h2 style={styles.title}>Client Overview</h2>
        <button style={styles.addButton} onClick={handleAddClient}>
          Add Client
        </button>
        <div style={styles.filterContainer}>
          <input
            type="text"
            placeholder="Search by Client Name"
            value={searchName}
            onChange={handleSearch}
            style={styles.searchInput}
          />
        </div>
        <h3 style={styles.clientListTitle}>Client List</h3>
        <div style={styles.clientList}>
          {filteredClients.length > 0 ? (
            <div style={styles.clientGrid}>
              {filteredClients.map(client => (
                <div
                  key={client.clientId}
                  style={styles.clientItem}
                  onClick={() => handleClientClick(client.clientId)}
                >
                  <div style={styles.iconContainer}>
                    <FaUser style={styles.userIcon} />
                  </div>
                  <div style={styles.clientDetails}>
                    <p style={styles.clientName}>{client.name}</p>
                    <p style={styles.clientEmail}><FaEnvelope /> {client.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noResults}>No clients found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#546a7b',
    minHeight: '100vh',
    color: '#fdfdff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  innerContainer: {
    width: '100%',
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#fdfdff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    paddingTop: '70px', // Add padding for the fixed NavBar
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#393D3f',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#62929e',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'background-color 0.3s',
    fontSize: '1rem',
    float: 'right',
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
    maxWidth: '600px', // Long search bar
  },
  clientListTitle: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    textAlign: 'center',
    color: '#393D3f',
    
  },
  clientList: {
   
    borderRadius: '5px',
    padding: '10px',
    boxShadow:'0 8px 20px rgba(0, 0, 0, 0)',
    
  },
  clientGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '15px',
    
  },
  clientItem: {
    backgroundColor: '#fdfdff',
    color: '#393D3f',
    borderRadius: '8px',
    padding: '15px',
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    boxShadow:'0 8px 20px rgba(0, 0, 0, 0.15)',
  },
  iconContainer: {
    backgroundColor: '#62929e',
    borderRadius: '50%',
    padding: '10px',
    marginRight: '10px',
  },
  userIcon: {
    fontSize: '2rem',
    color: '#fdfdff',
  },
  clientDetails: {
    color: '#393D3f',
  },
  clientName: {
    fontWeight: 'bold',
    margin: 0,
  },
  clientEmail: {
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  },
  noResults: {
    textAlign: 'center',
    color: '#fdfdff',
  },
};

export default ClientManagement;
