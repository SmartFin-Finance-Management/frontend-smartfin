

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopBar from '../Components/TopBar';
import Footer from '../Components/Footer';
import { FaUser, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import NavBar from '../Components/NavBar';

const ClientInfo: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<IClient | null>(null);
  const [projects, setProjects] = useState<IProject[]>([]);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8008/clients/${clientId}`);
        setClient(response.data);
      } catch (error) {
        console.error('Error fetching client details:', error);
      }
    };

    const fetchClientProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:8008/clients/projects/${clientId}`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching client projects:', error);
      }
    };

    fetchClientDetails();
    fetchClientProjects();
  }, [clientId]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete client ${client?.name}?`)) {
      try {
        await axios.delete(`http://localhost:8008/clients/${clientId}`);
        alert(`Client ${client?.name} has been deleted.`);
        navigate('/clientManagement');
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Failed to delete client.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <NavBar />
      <div style={styles.fullContent}>
        {client && (
          <>
            <div style={styles.header}>
              <h2 style={styles.heading}>Client Information</h2>
              <div style={styles.clientStatus}>
                <h3 style={styles.clientName}>{client.name}</h3>
                <h4 style={client.status === 'active' ? styles.active : styles.inactive}>
                  Status: {client.status}
                </h4>
              </div>
              <div style={styles.actions}>
                {/* Navigate to edit client form */}
                <button style={styles.button} onClick={() => navigate(`/client/edit/${clientId}`)}>
                  Edit Client
                </button>
                <button style={styles.button} onClick={handleDelete}>
                  Delete Client
                </button>
              </div>
            </div>

            {/* Client Details Section */}
            <div style={styles.detailsSection}>
              <h3 style={styles.detailsTitle}>Client Details</h3>
              <div style={styles.details}>
                <div style={styles.detailItem}><FaUser style={styles.icon} /> {client.name}</div>
                <div style={styles.detailItem}><FaBuilding style={styles.icon} /> Organization ID: {client.orgId}</div>
                <div style={styles.detailItem}><FaPhone style={styles.icon} /> {client.phone}</div>
                <div style={styles.detailItem}><FaEnvelope style={styles.icon} /> {client.email}</div>
                <div style={styles.detailItem}><FaMapMarkerAlt style={styles.icon} /> {client.address}</div>
              </div>
            </div>

            {/* Projects Section */}
            <div style={styles.projectsSection}>
              <h3>Client Projects</h3>
              <div style={styles.projectList}>
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <div key={project.id} style={styles.projectBox}>
                      <h4 style={styles.projectTitle}>{project.title}</h4>
                      <p style={styles.projectDescription}>{project.description}</p>
                      <button
                        style={styles.projectButton}
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        View Project
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={styles.noProjects}>No projects to display</div>
                )}
              </div>
              <button style={styles.button} onClick={() => navigate('/project/form')}>
                Add Project
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

// Include the rest of your styles and component as before


const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#546a7b',
  },
  fullContent: {
    width: '100%',
    padding: '20px',
    color: '#ffffff',
  },
  header: {
    backgroundColor: '#62929e',
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  heading: {
    textAlign: 'center',
    margin: '0',
    fontSize: '2rem',
    color: '#fff',
  },
  clientStatus: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  clientName: {
    fontSize: '1.5rem',
    color: '#fff',
    margin: '10px 0',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '10px',
  },
  active: {
    color: 'green',
  },
  inactive: {
    color: 'red',
  },
  detailsSection: {
    margin: '20px 0',
    backgroundColor: '#fdfdff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  detailsTitle: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    textAlign: 'center',
    color: '#333',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    color: '#333',
  },
  icon: {
    marginRight: '8px',
    fontSize: '1.2rem',
    color: '#4CAF50',
  },
  projectsSection: {
    margin: '20px 0',
    backgroundColor: '#62929e',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  projectList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  projectBox: {
    background: '#fdfdff',
    borderRadius: '10px',
    padding: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  projectTitle: {
    fontSize: '1.2rem',
    color: '#333',
  },
  projectDescription: {
    fontSize: '0.9rem',
    color: '#666',
  },
  projectButton: {
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  noProjects: {
    textAlign: 'center',
    color: '#666',
    fontSize: '1rem',
    margin: '20px 0',
  },
};

export default ClientInfo;



