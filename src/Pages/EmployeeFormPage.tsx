import React, { useState } from 'react';
import TopBar from '../Components/TopBar';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';

interface EmployeeFormProps {
  onSubmit: (data: IEmployeeForm) => void;
}

interface IEmployeeForm {
  employee_id: number;
  org_id: number;
  client_id: number;
  name: string;
  email: string;
  role: string;
  employee_type: string;
  experience: number;
  lpa: number;
  hourly_rate: number;
  project_id: number;
  project_history: number[];
  project_manager_id: number;
  attendance: Record<string, string>;
}

const EmployeeFormPage: React.FC<EmployeeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<IEmployeeForm>({
    employee_id: 0,
    org_id: 0,
    client_id: 0,
    name: '',
    email: '',
    role: '',
    employee_type: '',
    experience: 0,
    lpa: 0,
    hourly_rate: 0,
    project_id: 0,
    project_history: [],
    project_manager_id: 1,
    attendance: {},
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'experience' || name === 'lpa' || name === 'hourly_rate' ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCancel = () => {
    console.log("Cancel button clicked, navigating to '/'");
    navigate('/');
  };
  

  return (
    <div>
      <TopBar />
      <div style={styles.container}>
        <h2 style={styles.title}>Employee Registration Form</h2>
        <form onSubmit={handleSubmit} style={styles.form}>

        {/* <label style={styles.label}>
          Employee ID:
          <input type="number" name="employee_id" value={formData.employee_id} onChange={handleChange} style={styles.input} required />
        </label> */}

        {/* <label style={styles.label}>
          Organization ID:
          <input type="number" name="org_id" value={formData.org_id} onChange={handleChange} style={styles.input} required />
        </label> */}

          <label style={styles.label}>
            Client ID:
            <input type="number" name="client_id" value={formData.client_id} onChange={handleChange} style={styles.input} required />
          </label>

          <label style={styles.label}>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} required />
          </label>

          <label style={styles.label}>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} required />
          </label>

          <label style={styles.label}>
            Role:
            <input type="text" name="role" value={formData.role} onChange={handleChange} style={styles.input} required />
          </label>

          <label style={styles.label}>
            Employee Type:
            <select name="employee_type" value={formData.employee_type} onChange={handleChange} style={styles.input} required>
              <option value="full">Full</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
          </label>

          <label style={styles.label}>
            Experience (years):
            <input type="number" name="experience" value={formData.experience} onChange={handleChange} style={styles.input} required />
          </label>

          <label style={styles.label}>
            LPA:
            <input type="number" name="lpa" value={formData.lpa} onChange={handleChange} style={styles.input} required />
          </label>

          <label style={styles.label}>
            Hourly Rate:
            <input type="number" name="hourly_rate" value={formData.hourly_rate} onChange={handleChange} style={styles.input} required />
          </label>

          <label style={styles.label}>
            Project ID:
            <input type="number" name="project_id" value={formData.project_id} onChange={handleChange} style={styles.input} required />
          </label>

          {/* Hidden Project Manager ID field */}
          <input type="hidden" name="project_manager_id" value={formData.project_manager_id} onChange={handleChange} />

          <div style={styles.buttonContainer}>
            <button type="button" onClick={handleCancel} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              Submit
            </button>
          </div>
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
  buttonContainer: {
    gridColumn: '1 / -1', // Span the container across both columns
    display: 'flex',
    gap: '15px', // Space between buttons
    marginTop: '15px',
  },
  submitButton: {
    flex: 1, // Expand equally with the cancel button
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  cancelButton: {
    flex: 1, // Expand equally with the submit button
    padding: '12px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
};



export default EmployeeFormPage;
