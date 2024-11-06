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
    const [search, setSearch] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const orgId = Number(sessionStorage.getItem("org_id") || 0);
                const response = await axios.get(`http://localhost:4000/projects/orgs/${orgId}`);
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
            } catch (error: any) {
                alert("Error updating project: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedProject(null);
    };

    const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const filterList = projectList.filter(project => {
        return project.project_name.toLowerCase().includes(search.toLowerCase());
    });

    const handleDelete = async (projectId: Number) => {
        try {
            await axios.delete(`http://localhost:4000/projects/${projectId}`);
            // Remove the deleted project from the list
            setProjectList(prev => prev.filter(project => project.project_id !== projectId));
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    // Render input fields for project details
    const renderInputFields = () => {
        return (
            <>
                <label>Project Name</label>
                <Input
                    placeholder="Project Name"
                    value={selectedProject?.project_name}
                    onChange={(e) =>
                        setSelectedProject({ ...selectedProject!, project_name: e.target.value })
                    }
                />
                <label>Start Date</label>
                <Input
                    type="date"
                    value={selectedProject?.start_date}
                    onChange={(e) =>
                        setSelectedProject({ ...selectedProject!, start_date: e.target.value })
                    }
                />
                <label>End Date</label>
                <Input
                    type="date"
                    value={selectedProject?.end_date}
                    onChange={(e) =>
                        setSelectedProject({ ...selectedProject!, end_date: e.target.value })
                    }
                />
                <label>Status</label>
                <select
                    value={selectedProject?.status}
                    onChange={(e) =>
                        setSelectedProject({ ...selectedProject!, status: e.target.value })
                    }
                    required
                >
                    <option value="" disabled>Select Status</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                </select>
                {["total_budget", "allocated_budget", "remaining_budget", "employee_budget", "technical_budget", "additional_budget"].map((field) => (
                    <div key={field}>
                        <label>{field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                        <Input
                            type="number"
                            placeholder={field.replace('_', ' ')}
                            value={selectedProject?.[field as keyof IProject]}
                            onChange={(e) =>
                                setSelectedProject({
                                    ...selectedProject!,
                                    [field]: Number(e.target.value),
                                })
                            }
                        />
                    </div>
                ))}
            </>
        );
    };

    return (
        <div>
            <NavBar />
            <div style={styles.pageContainer}>
                <div style={styles.headerContainer}>
                    <div style={styles.searchContainer}>
                        <input
                            type="text"
                            value={search}
                            placeholder="Search project name"
                            onChange={handleFilter}
                            style={styles.searchInput}
                        />
                    </div>
                </div>
                {projectList.length === 0 ? (
                    <div style={styles.noProjectsContainer}>
                        <h1 style={styles.noProjectsMessage}>Oops! There are no projects</h1>
                    </div>
                ) : (
                    <div style={styles.projectGridContainer}>
                        {filterList.map((project) => (
                            <div key={project.project_id} style={styles.projectGridItem}>
                                <ProjectCard
                                    project={project}
                                    onView={handleView}
                                    onUpdate={() => handleUpdate(project.project_id)}
                                    onDelete={() => handleDelete(project.project_id)}
                                />
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
                                {renderInputFields()}
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
    headerContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
    },
    searchContainer: {
        flex: 1,
        maxWidth: "300px",
        marginRight: "1rem",
    },
    searchInput: {
        width: "100%",
        padding: "12px",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
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
        gap: "1rem",
        justifyItems: "center",
    },
    projectGridItem: {
        width: "100%",
        maxWidth: "240px",
    },
    button: {
        padding: "12px 24px",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#007BFF",
        color: "#FFF",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
};

export default ProjectDetailsPage;
