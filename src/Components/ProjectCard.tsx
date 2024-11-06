import { IconButton } from "@chakra-ui/react";
import React from "react";
import { FaTrash } from 'react-icons/fa';

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
    onDelete: (id: number) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onView, onUpdate, onDelete }) => {
    return (
        <div style={styles.projectCard}>
            <IconButton
                colorPalette='red'
                aria-label="Delete"
                size="sm"
                onClick={() => onDelete(project.project_id)}
                style={styles.deleteButton} // Apply styles to the delete button
            >
                <FaTrash />
            </IconButton>
            <img src="https://cdn.dribbble.com/users/174036/screenshots/1507631/media/0f7a8787346a1c97faea82156fb82530.gif" alt="Project Icon"  />
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
        position: "relative", // Allow positioning of the delete button
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
    deleteButton: {
        position: "absolute", // Position the button absolutely within the card
        top: "10px", // Distance from the top
        right: "10px", // Distance from the right
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
