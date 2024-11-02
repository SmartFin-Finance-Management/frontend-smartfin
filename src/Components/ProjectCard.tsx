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
            <h1>{project.project_name}</h1>
            <div>
                {/* Additional project details can go here */}
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    projectCard: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 250px)",
        gap: "2rem",
        padding: "1rem",
        justifyContent: "center",
    },
};