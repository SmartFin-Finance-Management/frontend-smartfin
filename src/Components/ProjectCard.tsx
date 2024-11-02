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
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <div style={styles.projectCard}>
            <img src="https://via.placeholder.com/80" alt="Project Icon" style={styles.icon} />
            <h2 style={styles.projectName}>{project.project_name}</h2>
            <p style={styles.budget}>Total Budget: ${project.total_budget}</p>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    projectCard: {
        width: "250px",                 // Fixed width
        height: "250px",                // Fixed height
        border: "1px solid #ddd",       // Light border
        borderRadius: "8px",            // Rounded corners
        padding: "1rem",                // Padding inside the card
        textAlign: "center",            // Centered text
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Shadow for depth
        backgroundColor: "#ffffff",     // White background
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        justifyContent: "center",       // Center content vertically
    },
    icon: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",            // Make the icon round
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
};
