import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployeesOnBench = async () => {
            try {
                const response = await axios.get("http://localhost:3000/employeesBench");
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees on bench:", error);
                toast.error("Failed to load employees on bench");
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
                toast.error("Failed to load project details");
            }
        };

        fetchProject();
    }, [projectId]);

    const handleAddEmployee = async (employeeId: number) => {
        if (project) {
            try {
                const updatedEmployeesList = [...project.employees_list, employeeId];
                if (project.status === "ongoing") {
                    const project_id = project.project_id;
                    await axios.get(`http://localhost:3000/employees/assignProject/${employeeId}/${project_id}`);
                }

                const response = await axios.put(`http://localhost:4000/projects/${project.project_id}/employees`, updatedEmployeesList);
                setProject({ ...project, employees_list: updatedEmployeesList });
                toast.success(`Employee ${employeeId} added successfully!`);
            } catch (error) {
                toast.error("Employees budget is exceeding");
                console.error("Error updating project:", error);
            }
        }
    };

    const handleDelete = async (employeeId: number) => {
        if (project) {
            try {
                if (project.employees_list.length === 1) {
                    console.log("chetan");
                    await axios.get(`http://localhost:3000/employees/projectCompleted/${employeeId}`);
                    console.log("ananthu");
                    // setProject({ ...project, employees_list: [] });
                    const response = await axios.put(`http://localhost:4000/projects/${project.project_id}/employees`, []);
                    console.log("bannu");
                    setProject({ ...project, employees_list: [] });
                    toast.success(`Employee ${employeeId} removed successfully!`);
                }
                else {

                    const updatedEmployeesList = project.employees_list.filter(id => id !== employeeId);
                    await axios.get(`http://localhost:3000/employees/projectCompleted/${employeeId}`);
                    console.log(employeeId);
                    console.log(updatedEmployeesList);

                    const response = await axios.put(`http://localhost:4000/projects/${project.project_id}/employees`, updatedEmployeesList);
                    setProject({ ...project, employees_list: updatedEmployeesList });
                    toast.success(`Employee ${employeeId} removed successfully!`);
                }
            } catch (error) {
                toast.error("Error removing employee");
                console.error("Error updating project:", error);
            }
        }
    };

    // Inline styles
    const styles = {
        container: { fontFamily: 'Arial, sans-serif', margin: '20px' },
        table: { width: '100%', borderCollapse: 'collapse' as 'collapse', marginBottom: '20px' },
        th: { border: '1px solid #ddd', textAlign: 'left' as 'left', padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' as 'bold' },
        td: { border: '1px solid #ddd', textAlign: 'left' as 'left', padding: '8px' },
        button: { backgroundColor: '#4CAF50', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' as 'pointer' },
        projectDetails: { marginTop: '20px' },
        heading: { color: '#333', fontSize: '24px', fontWeight: 'bold' as 'bold' },
        subHeading: { fontSize: '20px', marginTop: '10px' },
    };

    return (
        <div>
            <div style={styles.container}>
                <h1 style={styles.heading}>Employees on Bench</h1>
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
                                        disabled={project?.employees_list.includes(employee.employee_id)}
                                    >
                                        {project?.employees_list.includes(employee.employee_id) ? "Added" : "Add"}
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
                                <li key={empId}>
                                    Employee ID: {empId}
                                    <button onClick={() => handleDelete(empId)} style={{ marginLeft: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px' }}>
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <ToastContainer position="top-center" />
        </div>
    );
};
