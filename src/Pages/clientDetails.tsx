import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

interface IClient {
  clientId: string;
  name: string;
  orgId: string;
  phone: string;
  email: string;
  address: string;
  status: string;
}

interface IProject {
  project_id: string;
  project_name: string;
}

const ClientInfo: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<IClient | null>(null);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedClient, setEditedClient] = useState<IClient | null>(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const token = sessionStorage.getItem('authToken'); // Get the token from the session storage
        const response = await axios.get(`http://localhost:7000/api/clients/clients/${clientId}`,{
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the Authorization header
          }
        });
        setClient(response.data);
      } catch (error) {
        console.error('Error fetching client details:', error);
      }
    };

    const fetchClientProjects = async () => {
      try {
        const token = sessionStorage.getItem('authToken'); // Get the token from the session storage
        const response = await axios.get(`http://localhost:7000/api/clients/clients/projects/${clientId}`,{
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the Authorization header
          }
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching client projects:', error);
      }
    };

    fetchClientDetails();
    fetchClientProjects();
  }, [clientId]);

  const handleEditClient = () => {
    setEditedClient(client);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    if (editedClient) {
      try {
        const token = sessionStorage.getItem('authToken'); // Get the token from the session storage
        await axios.put(`http://localhost:7000/api/clients/clients/${clientId}`, editedClient,{
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the Authorization header
          }
        });
        setClient(editedClient);
        setShowEditModal(false);
        alert('Client details updated successfully.');
      } catch (error) {
        console.error('Error updating client details:', error);
        alert('Failed to update client details.');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete client ${client?.name}?`)) {
      try {
        const token = sessionStorage.getItem('authToken'); // Get the token from the session storage
        await axios.delete(`http://localhost:7000/api/clients/clients/${clientId}`,{
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the Authorization header
          }
        });
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
                <button style={styles.button} onClick={handleEditClient}>
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
                    <div key={project.project_id} style={styles.projectBox}>
                      <h4 style={styles.projectTitle}>{project.project_name}</h4>
                      <p style={styles.projectDescription}>Project ID: {project.project_id}</p>
                      <button
                        style={styles.projectButton}
                        onClick={() => navigate(`/project/${project.project_id}`)}
                      >
                        View Project Details
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={styles.noProjects}>No projects to display</div>
                )}
              </div>
              <button style={{ ...styles.button, marginTop: '20px' }} onClick={() => navigate('/project/form')}>
                Add Project
              </button>
            </div>

            {/* Edit Client Modal */}
            {showEditModal && editedClient && (
              <div style={styles.modal}>
                <h3>Edit Client</h3>
                <div style={styles.inputContainer}>
                  <label>Name</label>
                  <input
                    type="text"
                    value={editedClient.name}
                    onChange={(e) => setEditedClient({ ...editedClient, name: e.target.value })}
                    style={styles.inputField}
                  />
                </div>
               
                <div style={styles.inputContainer}>
                  <label>Phone</label>
                  <input
                    type="text"
                    value={editedClient.phone}
                    onChange={(e) => setEditedClient({ ...editedClient, phone: e.target.value })}
                    style={styles.inputField}
                  />
                </div>
                <div style={styles.inputContainer}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={editedClient.email}
                    onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
                    style={styles.inputField}
                  />
                </div>
                <div style={styles.inputContainer}>
                  <label>Address</label>
                  <input
                    type="text"
                    value={editedClient.address}
                    onChange={(e) => setEditedClient({ ...editedClient, address: e.target.value })}
                    style={styles.inputField}
                  />
                </div>
                <div style={styles.inputContainer}>
                  <label style={styles.label}>
                    Status:
                    <select
                      name="status"
                      value={editedClient.status}
                      onChange={(e) => setEditedClient({ ...editedClient, status: e.target.value })}
                      style={styles.inputField}
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </label>
                </div>
                <div style={styles.modalActions}>
                  <button onClick={handleSaveChanges} style={styles.saveButton}>Save</button>
                  <button onClick={() => setShowEditModal(false)} style={styles.cancelButton}>Cancel</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    zIndex: 1000,
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    color: 'black',
  },
  inputContainer: {
    marginBottom: '15px',
  },
  inputField: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
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
    color: '#2e7d32',
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
    color: '#546a7b',
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
    backgroundColor: '#546a7b',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#546a7b',
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
