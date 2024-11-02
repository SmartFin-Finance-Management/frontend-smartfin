import React, { useEffect, useState } from "react";
import { ProjectCard } from "../Components/ProjectCard";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

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

export const ProjectDetailsPage: React.FC = () => {
    const [projectList, setProjectList] = useState<IProject[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get("http://localhost:4000/projects");
                setProjectList(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div style={styles.pageContainer}>
            {projectList.length === 0 ? (
                <div style={styles.noProjectsContainer}>
                    <button style={styles.button} onClick={() => navigate('/project/form')}>
                        Add New Project
                    </button>
                    <h3>There are no projects</h3>
                </div>
            ) : (
                <div style={styles.projectGridContainer}>
                    {projectList.map((project) => (
                        <div key={project.project_id} style={styles.projectGridItem}>
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            )}
            <button style={styles.button} onClick={() => navigate("/project/form")}>
                Add New Project
            </button>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    pageContainer: {
        padding: "2rem",
        textAlign: "center",
    },
    noProjectsContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    projectGridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)", // Ensures 4 columns per row
        gap: "1.5rem",
        padding: "1rem",
    },
    projectGridItem: {
        display: "flex",
        justifyContent: "center",
    },
    button: {
        padding: "12px 24px",
        fontSize: "1rem",
        fontWeight: "bold",
        color: "#ffffff",
        backgroundColor: "#4CAF50",
        border: "2px solid #4CAF50",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        marginTop: "2rem",
    },
};
