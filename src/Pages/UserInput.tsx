import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../Components/TopBar';
import Footer from '../Components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import { jwtDecode } from 'jwt-decode';
import AccessDenied from '../Components/AccessDenied';

interface IUserForm {
  org_id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

const UserInput: React.FC = () => {
  const [Role, setRole] = useState<string>("");
  const [formData, setFormData] = useState<IUserForm>({
    org_id: 0,
    username: '',
    email: '',
    password: '',
    role: 'Finance Manager', // Default role set here, can be changed
  });

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
          throw new Error('No auth token found');
        }

        // Decode the token
        const decodedToken = jwtDecode<IUser>(token);

        // Access the role from the decoded token
        const userRole = decodedToken.role; // Ensure `role` exists in your JWT payload

        // Set the role state
        setRole(userRole);

      } catch (error) {
        console.error('Failed to fetch role from token:', error);
      }
    };

    const fetchOrgId = () => {
      const orgId = Number(sessionStorage.getItem('org_id') || 0);
      setFormData(prev => ({ ...prev, org_id: orgId })); // Ensure org_id is set correctly
    };
    
    fetchEmployeeId();
    fetchOrgId();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value, // Updates the respective field
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:7000/api/auth/register`, formData);
      if (response.status === 200 || response.status === 201) {
        toast.success('User added successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });

        // Reset form data except orgId
        setFormData({
          org_id: formData.org_id,
          username: '',
          email: '',
          password: '',
          role: 'Finance Manager', // Reset to default role
        });
        navigate('/userManagement');
      } else {
        throw new Error('Failed to add user');
      }
    } catch (error) {
      toast.error('Error adding user. Please try again.');
    }
  };

  if(Role !== 'admin') return <AccessDenied />;

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <NavBar />
      <div style={styles.container}>
        <h2 style={styles.title}>User Registration Form</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Username:
            <input type="text" name="username" value={formData.username} onChange={handleChange} style={styles.input} required />
          </label>

          <label style={styles.label}>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} required />
          </label>

          <label style={styles.label}>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleChange} style={styles.input} required />
          </label>

          <label style={styles.label}>
            Role:
            <select name="role" value={formData.role} onChange={handleChange} style={styles.input} required>
              <option value="Finance Manager">Finance Manager</option>
              <option value="Project Manager">Project Manager</option>
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

export default UserInput;
