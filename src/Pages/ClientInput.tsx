import React, { useState } from 'react';
import TopBar from '../Components/TopBar';
import Footer from '../Components/Footer';

interface ClientFormProps {
  onSubmit: (data: IClientForm) => void;
}

interface IClientForm {
  client_id: number;
  organization: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: string;
}

const ClientInput: React.FC<ClientFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<IClientForm>({
    client_id: 0,
    organization: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    status: 'active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{ backgroundColor: '#546a7b', minHeight: '100vh' }}>
      <TopBar />
      <div style={styles.container}>
        <h2 style={styles.title}>Client Registration Form</h2>
        <form onSubmit={handleSubmit} style={styles.form}>

          <label style={styles.label}>
            Client ID:
            <input type="number" name="client_id" value={formData.client_id} onChange={handleChange} style={styles.input} required />
          </label>

          <label style={styles.label}>
            Organization ID:
            <input type="text" name="organization" value={formData.organization} onChange={handleChange} style={styles.input} required />
          </label>

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
            <input type="text" name="address" value={formData.address} onChange={handleChange} style={styles.input} required />
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
    gridTemplateColumns: '1fr 1fr', // Two columns
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
  button: {
    gridColumn: '1 / -1', // Span across both columns
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
