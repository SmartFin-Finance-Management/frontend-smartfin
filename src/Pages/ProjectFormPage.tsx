import React, { useState } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";

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


export const ProjectFormPage: React.FC = () => {
    const [project, setFormData] = useState<IProject>({
        project_id: 0,
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'project_id' || name === 'org_id' || name === 'client_id' ||
                name === 'total_budget' || name === 'allocated_budget' ||
                name === 'remaining_budget' || name === 'employee_budget' ||
                name === 'technical_budget' || name === 'additional_budget' ||
                name === 'employee_expenses' || name === 'technical_expenses' ||
                name === 'additional_expenses' || name === 'actual_expenses' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            project.employees_list = [2];
            // onSubmit(project);
            await axios.post("http://localhost:4000/projects", project);
            // console.log([...projectList, project]);
            //onSubmit(formData); // Pass the form data to the parent component
            // Reset form after submission
            setFormData({
                project_id: 0,
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
        }
        catch (error: any) {
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
                            Project ID:
                            <input type="number" name="project_id" value={project.project_id} onChange={handleChange} style={styles.input} required />
                        </label>

                        <label style={styles.label}>
                            Organization ID:
                            <input type="number" name="org_id" value={project.org_id} onChange={handleChange} style={styles.input} required />
                        </label>

                        <label style={styles.label}>
                            Client ID:
                            <input type="number" name="client_id" value={project.client_id} onChange={handleChange} style={styles.input} required />
                        </label>

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

                        <button type="submit" style={styles.button}>
                            Submit
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
            <ToastContainer style={{ top: '5%', left: '50%', transform: 'translateX(-50%)' }} />
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'grid',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        maxWidth: '900px',
        margin: '2rem auto',
        padding: '20px',
        border: '1px solid #ddd',
        background: "#fdfdff",
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
    },
    titleContainer: {
        flex: 1,
        marginRight: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    title: {
        color: '#333',
        fontSize: '2rem',
    },
    form: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '10px',
    },
    input: {
        padding: '8px',
        margin: '5px 0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
    },
    button: {
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};