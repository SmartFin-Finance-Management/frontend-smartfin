import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../Components/TopBar';
import Footer from '../Components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar';

interface IClientForm {
  clientId: number; // This will now be automatically generated
  orgId: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: string;
}

const ClientInput: React.FC = () => {
  const [formData, setFormData] = useState<IClientForm>({
    clientId: 0, // Start with 0, will fetch from server
    orgId: 0,
    name: '',
    phone: '',
    email: '',
    address: '',
    status: 'active',
  });

  useEffect(() => {
    const fetchOrgId = () => {
      const orgId = Number(sessionStorage.getItem('org_id') || 0);
      console.log('orgId: ', orgId);
      setFormData((prev) => ({ ...prev, orgId }));
    };

    const fetchMaxClientId = async () => {
      try {
        const token = sessionStorage.getItem('authToken') || ''; // Fetch the token from session storage
        const response = await axios.get(`http://localhost:7000/api/clients/clients/clientId/max`,{
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the Authorization header
          }
        });
        if (response.status === 200) {
          // Update the client ID with the maximum client ID from the server
          const maxClientId = response.data.max_client_id;
          setFormData((prev) => ({ ...prev, clientId: maxClientId + 1 })); // Increment max clientId by 1 for new client
        } else {
          toast.error('Error fetching client ID. Please try again.'+response.data.clientId);
        }
      } catch (error) {
        toast.error('Error fetching client ID. Please try again.');
      }
    };

    fetchOrgId();
    fetchMaxClientId();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('authToken') || ''; // Fetch the token from session storage
      const response = await axios.post(`http://localhost:7000/api/clients/clients`, formData,{
        headers: {
          Authorization: `Bearer ${token}` // Add the token to the Authorization header
        }
      });
      if (response.status === 200 || response.status === 201) {
        toast.success('Client added successfully!'+formData.clientId, {
          position: 'top-right',
          autoClose: 3000,
        });

        // Reset form data except orgId
        setFormData({
          clientId: formData.clientId+1,
          orgId: formData.orgId,
          name: '',
          phone: '',
          email: '',
          address: '',
          status: 'active',
        });
        navigate('/clientManagement');
      } else {
        throw new Error('Failed to add client');
      }
    } catch (error) {
      toast.error('Error adding client. Please try again.'+formData.clientId+error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#546a7b', minHeight: '100vh' }}>
      <NavBar />
      <div style={styles.container}>
        <h2 style={styles.title}>Client Registration Form</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} required />
          </label>

          <label style={styles.label}>
            Phone:
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={styles.input} required />
          </label>

          <label style={styles.label}>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} required />
          </label>

          <label style={styles.label}>
            Address:
            <textarea name="address" value={formData.address} onChange={handleChange} style={styles.textarea} required />
          </label>

          <label style={styles.label}>
            Status:
            <select name="status" value={formData.status} onChange={handleChange} style={styles.input} required>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <button type="submit" style={styles.button}>
            Submit
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

export default ClientInput;

