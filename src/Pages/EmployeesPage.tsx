import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface IProject {
    project_id: number;
    org_id: number;
    client_id: number;
    project_name: string;
    start_date: string;
    end_date: string;
    status: string;
    total_budget: number;
    allocated_budget: number;
    remaining_budget: number;
    employee_budget: number;
    technical_budget: number;
    additional_budget: number;
    employee_expenses: number;
    technical_expenses: number;
    additional_expenses: number;
    actual_expenses: number;
    employees_list: number[];
}

interface IEmployee {
    employee_id: number;
    name: string;
    experience: number;
}

export const EmployeesPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<IProject | null>(null);
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployeesOnBench = async () => {
            try {
                const response = await axios.get("http://localhost:3000/employeesBench");
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees on bench:", error);
            }
        };

        fetchEmployeesOnBench();
    }, []);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const id = Number(projectId);
                const response = await axios.get(`http://localhost:4000/projects/${id}`);
                setProject(response.data);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        };

        fetchProject();
    }, [projectId]);

    const handleAddEmployee = async (employeeId: number) => {
        if (project) {
            try {
                // Ensure employees_list is correctly updated
                const employees_list = [...project.employees_list, employeeId];
                console.log(employees_list);
                if (project.status === "ongoing") {
                    const project_id = project.project_id;
                    await axios.get(`http://localhost:3000/employees/assignProject/${employeeId}/${project_id}`);
                }
                // Send the updated project to the API
                const response = await axios.put(`http://localhost:4000/projects/${project.project_id}/employees`, employees_list);
                setProject(response.data); // Update local project state with the response data

                setSuccessMessage(`Employee ${employeeId} added successfully!`);
                setErrorMessage(null); // Clear any previous error message
            } catch (error) {
                console.error("Error updating project:", error);
                setErrorMessage("Failed to add employee. Please try again.");
                setSuccessMessage(null); // Clear any previous success message
            }
        }
    };

    // Inline styles
    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            margin: '20px',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse' as 'collapse',
            marginBottom: '20px',
        },
        th: {
            border: '1px solid #dddddd',
            textAlign: 'left' as 'left',
            padding: '8px',
            backgroundColor: '#f2f2f2',
            fontWeight: 'bold' as 'bold',
        },
        td: {
            border: '1px solid #dddddd',
            textAlign: 'left' as 'left',
            padding: '8px',
        },
        button: {
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '5px 10px',
            border: 'none',
            cursor: 'pointer' as 'pointer',
        },
        projectDetails: {
            marginTop: '20px',
        },
        heading: {
            color: '#333',
            fontSize: '24px',
            fontWeight: 'bold' as 'bold',
        },
        subHeading: {
            fontSize: '20px',
            marginTop: '10px',
        },
        message: {
            color: 'red',
            marginBottom: '10px',
        },
        success: {
            color: 'green',
            marginBottom: '10px',
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Employees on Bench</h1>
            {errorMessage && <div style={styles.message}>{errorMessage}</div>}
            {successMessage && <div style={styles.success}>{successMessage}</div>}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Experience</th>
                        <th style={styles.th}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.employee_id}>
                            <td style={styles.td}>{employee.name}</td>
                            <td style={styles.td}>{employee.experience} years</td>
                            <td style={styles.td}>
                                <button
                                    style={styles.button}
                                    onClick={() => handleAddEmployee(employee.employee_id)}
                                >
                                    Add
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {project && (
                <div style={styles.projectDetails}>
                    <h2 style={styles.subHeading}>Project: {project.project_name}</h2>
                    <h3 style={styles.subHeading}>Assigned Employees</h3>
                    <ul>
                        {project.employees_list.map((empId) => (
                            <li key={empId}>Employee ID: {empId}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
