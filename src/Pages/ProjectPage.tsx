import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

export const ProjectPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<IProject | null>();

    useEffect(() => {
        const fetch = async () => {
            try {
                const id = Number(projectId);
                const getById = await axios.get(`http://localhost:4000/projects/${id}`);
                setProject(getById.data);
                console.log(getById.data);
            }
            catch (error) {
                console.log(error);
            }
        };
        fetch();
    }, [projectId]);

    if (!project) {
        return <div><h1>Project Not Found</h1></div>;
    }

    return (
        <div>
            <NavBar />
            <div style={styles.container}>
                <div style={styles.projectNameBox}>
                    <h1>{project.project_name}</h1>
                </div>
                <div style={styles.metricsBox}>
                    <h1>Key Metrics</h1>
                    <div style={styles.metricsGrid}>
                        <div><strong>Start Date:</strong> {project.start_date}</div>
                        <div><strong>End Date:</strong> {project.end_date}</div>
                        <div><strong>Total Budget:</strong> ${project.total_budget}</div>
                    </div>
                </div>
                <div style={styles.employeesContainer}>
                    <div style={styles.employeesSection}>
                        <h1>Employees Section</h1>
                    </div>
                    <div style={styles.employeesGrid}>
                        {project.employees_list.map((id) => (
                            <div key={id} style={styles.employeeIdBox}>
                                <h1>{id}</h1> {/* Displaying employee ID */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "20px",
    },
    projectNameBox: {
        width: "100%",
        textAlign: "center",
        padding: "10px",
        borderBottom: "2px solid #ccc",
    },
    metricsBox: {
        width: "100%",
        textAlign: "center",
        padding: "20px",
        border: "2px solid #ccc",
        borderRadius: "8px",
    },
    metricsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)", // Three equal-width columns
        gap: "10px",
        marginTop: "10px",
    },
    employeesContainer: {
        display: "flex",
        alignItems: "flex-start",
        gap: "20px",
        width: "100%",
    },
    employeesSection: {
        flex: "1", // Allow this section to take available space
        textAlign: "center",
    },
    employeesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)", // Adjust number of columns as needed
        gap: "10px",
        flex: "2", // Allow this section to take more space
    },
    employeeIdBox: {
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "10px",
        textAlign: "center",
    },
};
