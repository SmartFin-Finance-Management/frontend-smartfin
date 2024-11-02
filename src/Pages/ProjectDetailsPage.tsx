import React, { useEffect, useState } from "react";
import { ProjectCard } from "../Components/ProjectCard";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";

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

    // Handler for viewing a project
    const handleView = (projectId: number) => {
        console.log("Viewing project with ID:", projectId);
        navigate(`/projects/${projectId}`);
    };

    // Handler for updating a project
    const handleUpdate = (projectId: number) => {
        console.log("Updating project with ID:", projectId);
        navigate(`/project/update/${projectId}`);
    };

    return (
        <div>
            <NavBar />
            <div style={styles.pageContainer}>
                <div style={styles.buttonContainer}>
                    <button style={styles.button} onClick={() => navigate('/project/form')}>
                        Add New Project
                    </button>
                </div>
                {projectList.length === 0 ? (
                    <div style={styles.noProjectsContainer}>
                        <h1 style={styles.noProjectsMessage}>Oops! There are no projects</h1>
                    </div>
                ) : (
                    <div style={styles.projectGridContainer}>
                        {projectList.map((project) => (
                            <div key={project.project_id} style={styles.projectGridItem}>
                                <ProjectCard
                                    project={project}
                                    onView={handleView}
                                    onUpdate={handleUpdate}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    pageContainer: {
        padding: "2rem",
        textAlign: "center",
        position: "relative",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "1rem",
    },
    noProjectsContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
    },
    noProjectsMessage: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#333",
    },
    projectGridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", // Responsive grid
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
    },
};
