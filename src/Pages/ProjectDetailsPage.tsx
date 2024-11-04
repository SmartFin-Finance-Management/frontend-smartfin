import React, { useEffect, useState } from "react";
import { ProjectCard } from "../Components/ProjectCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import {
    DialogRoot,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
} from "../Components/ui/dialog";
import { Button, Input, Stack } from "@chakra-ui/react";

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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
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

    const handleView = (projectId: number) => {
        navigate(`/project/${projectId}`);
    };

    const handleUpdate = (projectId: number) => {
        const project = projectList.find((p) => p.project_id === projectId);
        if (project) {
            setSelectedProject(project);
            setIsDialogOpen(true);
        }
    };

    const handleSaveChanges = async () => {
        if (selectedProject) {
            try {
                const response = await axios.put(
                    `http://localhost:4000/projects/${selectedProject.project_id}`,
                    selectedProject
                );

                // Update the projectList in the local state
                setProjectList((prev) =>
                    prev.map((project) =>
                        project.project_id === selectedProject.project_id
                            ? response.data
                            : project
                    )
                );
                setIsDialogOpen(false);
            } catch (error) {
                console.error("Error updating project:", error);
            }
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedProject(null);
    };

    return (
        <div>
            <NavBar />
            <div style={styles.pageContainer}>
                <div style={styles.buttonContainer}>
                    <button style={styles.button} onClick={() => navigate("/project/form")}>
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
                                <ProjectCard project={project} onView={handleView} onUpdate={() => handleUpdate(project.project_id)} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {selectedProject && (
                <DialogRoot open={isDialogOpen} onOpenChange={handleCloseDialog}>
                    <DialogTrigger asChild>
                        <Button>Edit Project</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Project Details</DialogTitle>
                        </DialogHeader>
                        <DialogBody pb="4">
                            <Stack spacing={4}>
                                <label>Project Name</label>
                                <Input
                                    placeholder="Project Name"
                                    value={selectedProject.project_name}
                                    onChange={(e) =>
                                        setSelectedProject({ ...selectedProject, project_name: e.target.value })
                                    }
                                />
                                <label>Start Date</label>
                                <Input
                                    type="date"
                                    value={selectedProject.start_date}
                                    onChange={(e) =>
                                        setSelectedProject({ ...selectedProject, start_date: e.target.value })
                                    }
                                />
                                <label>End Date</label>
                                <Input
                                    type="date"
                                    value={selectedProject.end_date}
                                    onChange={(e) =>
                                        setSelectedProject({ ...selectedProject, end_date: e.target.value })
                                    }
                                />
                                <label>Status</label>
                                <select
                                    value={selectedProject.status}
                                    onChange={(e) =>
                                        setSelectedProject({ ...selectedProject, status: e.target.value })
                                    }
                                    required
                                >
                                    <option value="" disabled>Select Status</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="completed">Completed</option>
                                </select>
                                {["total_budget", "allocated_budget", "remaining_budget", "employee_budget", "technical_budget", "additional_budget", "employee_expenses", "technical_expenses", "additional_expenses", "actual_expenses"].map((field) => (
                                    <div key={field}>
                                        <label>{field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                                        <Input
                                            type="number"
                                            placeholder={field.replace('_', ' ')}
                                            value={selectedProject[field as keyof IProject]}
                                            onChange={(e) =>
                                                setSelectedProject({
                                                    ...selectedProject,
                                                    [field]: Number(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                ))}
                            </Stack>
                        </DialogBody>
                        <DialogFooter>
                            <Button colorScheme="blue" onClick={handleSaveChanges}>
                                Save Changes
                            </Button>
                            <Button variant="ghost" onClick={handleCloseDialog}>
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </DialogRoot>
            )}
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
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
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
