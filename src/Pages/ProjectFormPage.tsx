import React, { useEffect, useState } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import { useLocation, useNavigate } from "react-router-dom";

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
    id: number;
    name: string;
}

export const ProjectFormPage: React.FC = () => {
    const location = useLocation();
    const { client_id = 0 } = location.state || {};
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [project, setFormData] = useState<IProject>({
        project_id: 0,
        org_id: 0,
        client_id,
        project_name: "",
        start_date: "",
        end_date: "",
        status: "",
        total_budget: 0,
        allocated_budget: 0,
        remaining_budget: 0,
        employee_budget: 0,
        technical_budget: 0,
        additional_budget: 0,
        employee_expenses: 0,
        technical_expenses: 0,
        additional_expenses: 0,
        actual_expenses: 0,
        employees_list: [],
    });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === 'employees_list'
                    ? Array.from((e.target as HTMLSelectElement).selectedOptions, option => Number(option.value))
                    : name === 'total_budget' || name === 'allocated_budget' ||
                        name === 'remaining_budget' || name === 'employee_budget' ||
                        name === 'technical_budget' || name === 'additional_budget' ||
                        name === 'employee_expenses' || name === 'technical_expenses' ||
                        name === 'additional_expenses' || name === 'actual_expenses'
                        ? Number(value)
                        : value,
        }));
    };

    useEffect(() => {
        const fetchProjectId = async () => {
            try {
                const response = await axios.get('http://localhost:4000/projects/getUniqueId');
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                const data = response.data;
                setFormData(prev => ({
                    ...prev,
                    project_id: data.max_project_id + 1,
                }));
            } catch (error) {
                console.error('Failed to fetch unique project ID:', error);
                toast.error('Failed to fetch unique project ID.');
            }
        };

        const fetchEmployees = async () => {
            try {
                const response = await axios.get("http://localhost:3000/employeesBench");
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
                toast.error("Failed to fetch employees.");
            }
        };

        fetchProjectId();
        fetchEmployees();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const orgId = Number(sessionStorage.getItem("org_id") || 0);
        const url = `http://localhost:5000/${orgId}/projects`;

        try {
            await axios.post(url, project);
            setFormData({
                project_id: project.project_id + 1,
                org_id: 0,
                client_id: 0,
                project_name: "",
                start_date: "",
                end_date: "",
                status: "",
                total_budget: 0,
                allocated_budget: 0,
                remaining_budget: 0,
                employee_budget: 0,
                technical_budget: 0,
                additional_budget: 0,
                employee_expenses: 0,
                technical_expenses: 0,
                additional_expenses: 0,
                actual_expenses: 0,
                employees_list: [],
            });
            toast.success(`Project successfully created! ID: ${project.project_id}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error: any) {
            console.error("Error fetching projects:", error);
            const errorMessage = error.response?.data?.message || 'Failed to create Project';
            toast.error(errorMessage);
        }
    };

    return (
        <div>
            <NavBar />
            <div style={styles.container}>
                <div style={styles.content}>
                    <div style={styles.titleContainer}>
                        <h2 style={styles.title}>Project Information</h2>
                    </div>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <label style={styles.label}>
                            Project Name:
                            <input type="text" name="project_name" value={project.project_name} onChange={handleChange} style={styles.input} required />
                        </label>

                        <label style={styles.label}>
                            Start Date:
                            <input type="date" name="start_date" value={project.start_date} onChange={handleChange} style={styles.input} required />
                        </label>

                        <label style={styles.label}>
                            End Date:
                            <input type="date" name="end_date" value={project.end_date} onChange={handleChange} style={styles.input} required />
                        </label>

                        <label style={styles.label}>
                            Status:
                            <select
                                name="status"
                                value={project.status}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="ongoing">onGoing</option>
                                <option value="upcoming">upComing</option>
                                <option value="completed">Completed</option>
                            </select>
                        </label>

                        <label style={styles.label}>
                            Total Budget:
                            <input type="number" name="total_budget" value={project.total_budget} onChange={handleChange} style={styles.input} required />
                        </label>

                        <label style={styles.label}>
                            Allocated Budget:
                            <input type="number" name="allocated_budget" value={project.allocated_budget} onChange={handleChange} style={styles.input} required />
                        </label>

                        <label style={styles.label}>
                            Remaining Budget:
                            <input type="number" name="remaining_budget" value={project.remaining_budget} onChange={handleChange} style={styles.input} required />
                        </label>

                        <label style={styles.label}>
                            Employee Budget:
                            <input type="number" name="employee_budget" value={project.employee_budget} onChange={handleChange} style={styles.input} required />
                        </label>

                        <label style={styles.label}>
                            Technical Budget:
                            <input type="number" name="technical_budget" value={project.technical_budget} onChange={handleChange} style={styles.input} required />
                        </label>

                        <label style={styles.label}>
                            Additional Budget:
                            <input type="number" name="additional_budget" value={project.additional_budget} onChange={handleChange} style={styles.input} required />
                        </label>

                        <label style={styles.label}>
                            Employees:
                            <select
                                name="employees_list"
                                value={project.employees_list.map(String)} // Convert to string array for compatibility
                                onChange={handleChange}
                                style={styles.input}
                                multiple
                                required
                            >
                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label style={styles.label}>
                            Employee Expenses:
                            <input type="number" name="employee_expenses" value={project.employee_expenses} onChange={handleChange} style={styles.input} required />
                        </label>

                        <label style={styles.label}>
                            Technical Expenses:
                            <input type="number" name="technical_expenses" value={project.technical_expenses} onChange={handleChange} style={styles.input} required />
                        </label>

                        <label style={styles.label}>
                            Additional Expenses:
                            <input type="number" name="additional_expenses" value={project.additional_expenses} onChange={handleChange} style={styles.input} required />
                        </label>

                        <label style={styles.label}>
                            Actual Expenses:
                            <input type="number" name="actual_expenses" value={project.actual_expenses} onChange={handleChange} style={styles.input} required />
                        </label>

                        <div style={styles.buttonContainer}>
                            <button type="submit" style={styles.button}>Submit</button>
                            <button type="button" style={styles.button} onClick={() => navigate('/project')}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    content: {
        width: '80%',
        maxWidth: '600px',
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    titleContainer: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    label: {
        display: 'flex',
        flexDirection: 'column',
        fontSize: '16px',
        fontWeight: '500',
    },
    input: {
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    button: {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#28a745',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default ProjectFormPage;