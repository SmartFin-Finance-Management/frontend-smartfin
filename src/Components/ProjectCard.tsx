import React from "react";

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

interface ProjectCardProps {
    project: IProject;
    onView: (id: number) => void;
    onUpdate: (id: number) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onView, onUpdate }) => {
    return (
        <div style={styles.projectCard}>
            <img src="https://via.placeholder.com/80" alt="Project Icon" style={styles.icon} />
            <h2 style={styles.projectName}>{project.project_name}</h2>
            <p style={styles.budget}>Total Budget: ${project.total_budget}</p>
            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={() => onView(project.project_id)}>
                    View
                </button>
                <button style={styles.button} onClick={() => onUpdate(project.project_id)}>
                    Update
                </button>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    projectCard: {
        width: "100%", // Full width for mobile
        maxWidth: "250px", // Max width for desktop
        height: "300px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "1rem",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        justifyContent: "center",
    },
    icon: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
    },
    projectName: {
        fontSize: "1.1rem",
        fontWeight: "bold",
        margin: "0.5rem 0",
    },
    budget: {
        fontSize: "1rem",
        color: "#333",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
    },
    button: {
        padding: "8px 12px",
        fontSize: "0.9rem",
        fontWeight: "bold",
        color: "#ffffff",
        backgroundColor: "#4CAF50",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        flex: 1,
        margin: "0 5px",
    },
};
