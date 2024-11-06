import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../Components/TopBar';
import Footer from '../Components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../Components/NavBar';

interface AttendanceFormProps {
  onSubmit: (data: IAttendanceForm) => void;
}

interface IAttendanceForm {
  employee_id: number;
  attendance: Record<string, string>; // Key-value pair of date and status
}

const AttendanceFormPage: React.FC<AttendanceFormProps> = ({ onSubmit }) => {
  const { empId } = useParams<{ empId: string }>();
  const [formData, setFormData] = useState<IAttendanceForm>({
    employee_id: Number(0),
    attendance: {},
  });

  const navigate = useNavigate();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('%%'+empId)
    setFormData({
      employee_id: Number(empId),
      attendance: {
        ...formData.attendance,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orgId = Number(sessionStorage.getItem("org_id") || 0);
    const url = `http://localhost:7000/api/employees/employees/${formData.employee_id}/attendance`;
    console.log(formData.employee_id);
    console.log(formData.attendance);

    try {
      const token = sessionStorage.getItem(`authToken`);
      const response = await axios.post(url, formData.attendance, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(`Attendance successfully recorded for Employee ID: ${formData.employee_id}`, {
          position: 'top-right',
          autoClose: 3000

          
        });

        setFormData({
          ...formData,
          attendance: {},
        });
      } else {
        throw new Error('Failed to update attendance'+response);
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update attendance'+error;
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

//   useEffect(() => {
//     const fetchEmployeeId = async () => {
//       try {
//         const token = sessionStorage.getItem(`authToken`);
//         const response = await fetch('http://localhost:7000/api/employees/employee/getUniqueId', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setFormData((prev) => ({
//           ...prev,
//           employee_id: data.max_employee_id + 1,
//         }));
//       } catch (error) {
//         console.error('Failed to fetch unique employee ID:', error);
//         toast.error('Failed to fetch unique employee ID.');
//       }
//     };

//     fetchEmployeeId();
//   }, []);

  return (
    <div>
      <NavBar />
      <div style={styles.container}>
        <h2 style={styles.title}>Employee Attendance Form</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Date:
            <input type="date" name="date" onChange={handleDateChange} style={styles.input} required />
          </label>
          
          <label style={styles.label}>
            Status:
            <select name="status" onChange={handleDateChange} style={styles.input} required>
              <option value="" disabled>Select Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>
          </label>

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
      <ToastContainer style={{ top: '5%', left: '50%', transform: 'translateX(-50%)' }} />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '600px',
    margin: '3rem auto',
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
    gridColumn: '1 / -1',
    display: 'flex',
    gap: '15px',
    marginTop: '15px',
  },
  submitButton: {
    flex: 1,
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
    flex: 1,
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

export default AttendanceFormPage;
