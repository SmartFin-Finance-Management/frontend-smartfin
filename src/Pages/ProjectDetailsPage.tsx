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
    }, [])
    return (
        <div>
            <div>
                {projectList.length === 0 ? (
                    <div>
                        <button onClick={() => navigate('/project/form')}>Add New Project</button>
                        <h3>There are no projects</h3>
                    </div>
                ) : (
                    <div>
                        <ul>
                            {projectList.map((project) => (
                                <li key={project.project_id}>
                                    <ProjectCard project={project} />
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => navigate('/project/form')}>Add New Project</button>
                    </div>
                )}
            </div>
        </div>
    );
};