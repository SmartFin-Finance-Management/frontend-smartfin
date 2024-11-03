import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../Components/NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../Components/TopBar';
import Footer from '../Components/Footer';

interface IClient {
  clientId: number;
  name: string;
  orgId: number;
  status: string;
  phone: string;
  email: string;
  address: string;
}

const EditClientForm: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<IClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(`http://localhost:8008/clients/${clientId}`);
        setClient(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching client data:', error);
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClient((prevClient) => prevClient ? { ...prevClient, [name]: value } : null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (client) {
      try {
        await axios.put(`http://localhost:8008/clients/${clientId}`, client);
        alert('Client updated successfully');
        navigate(`/client/${clientId}`);
      } catch (error) {
        console.error('Error updating client:', error);
        alert('Failed to update client');
      }
    }
  };

  if (loading) {
    return <div>Loading client data...</div>;
  }

  if (!client) {
    return <div>Error: Client not found</div>;
  }

  return (<div style={{ backgroundColor: '#546a7b', minHeight: '100vh' }}>
      <NavBar />
    <div style={styles.container}>
      
      <h2 style={styles.title}>Edit Client</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Name:
          <input
            type="text"
            name="name"
            value={client.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Organization ID:
          <input
            type="number"
            name="orgId"
            value={client.orgId}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Status:
          <select
            name="status"
            value={client.status}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <label style={styles.label}>
          Phone:
          <input
            type="tel"
            name="phone"
            value={client.phone}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Email:
          <input
            type="email"
            name="email"
            value={client.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Address:
          <textarea
            name="address"
            value={client.address}
            onChange={handleChange}
            style={styles.textarea}
            required
          />
        </label>
        <button type="submit" style={styles.button}>
          Save Changes
        </button>
      </form>
      </div>
      <Footer />
      <ToastContainer style={{ top: '5%', left: '50%', transform: 'translateX(-50%)' }} />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    background: '#fdfdff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  label: {
    color: '#333',
    fontSize: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    outline: 'none',
    marginTop: '5px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    outline: 'none',
    marginTop: '5px',
    resize: 'vertical',
    minHeight: '100px',
  },
  button: {
    gridColumn: '1 / -1',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
};

export default EditClientForm;
