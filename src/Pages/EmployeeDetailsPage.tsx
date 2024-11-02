import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Employee {
  employee_id: number;
  org_id: number;
  client_id: number;
  name: string;
  email: string;
  role: string;
  employee_type: string;
  experience: number;
  lpa: string | number;
  hourly_rate: string | number;
  project_id: number;
  project_history: number[];
  project_manager_id: number;
  attendance: Record<string, string>;
}

const EmployeeDetailsPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const orgId = Number(sessionStorage.getItem("org_id") || 0);
      const url = `http://localhost:5000/${orgId}/employees`;

      try {
        const response = await axios.get(url);
        
        // Map response data and convert Decimal128 fields
        const convertedEmployees = response.data.map((employee: any) => ({
          ...employee,
          lpa: parseFloat(employee.lpa?.$numberDecimal || employee.lpa),
          hourly_rate: parseFloat(employee.hourly_rate?.$numberDecimal || employee.hourly_rate),
        }));
        
        setEmployees(convertedEmployees);
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Employee Details</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Employee Type</th>
            <th>Experience</th>
            <th>LPA</th>
            <th>Hourly Rate</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.employee_id}>
              <td>{employee.employee_id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
              <td>{employee.employee_type}</td>
              <td>{employee.experience}</td>
              <td>{employee.lpa}</td>
              <td>{employee.hourly_rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '3rem auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    background: '#fdfdff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    borderBottom: '1px solid #ddd',
    padding: '10px',
    backgroundColor: '#f2f2f2',
    textAlign: 'left',
  },
  td: {
    borderBottom: '1px solid #ddd',
    padding: '10px',
    textAlign: 'left',
  },
};

export default EmployeeDetailsPage;
