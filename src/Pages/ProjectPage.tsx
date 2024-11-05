import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Button } from "@chakra-ui/react";

ChartJS.register(ArcElement, Tooltip, Legend);

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
    const [project, setProject] = useState<IProject | null>(null);
    const [employees, setEmployees] = useState<any[]>([]);

    const navigate = useNavigate();


    useEffect(() => {
        const fetchProject = async () => {
            try {
                const id = Number(projectId);
                const getById = await axios.get(`http://localhost:4000/projects/${id}`);
                setProject(getById.data);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        };
        fetchProject();
    }, [projectId]);

    useEffect(() => {
        const fetchEmployees = async () => {
            if (project && project.employees_list) {
                try {
                    const employeePromises = project.employees_list.map(employeeId =>
                        axios.get(`http://localhost:3000/employees/${employeeId}`)
                    );
                    const employeeResponses = await Promise.all(employeePromises);
                    const employeeData = employeeResponses.map(response => response.data);
                    setEmployees(employeeData);
                } catch (error) {
                    console.error("Error fetching employees:", error);
                }
            }
        };
        fetchEmployees();
    }, [project]);

    if (!project) {
        return <div><h1>Project Not Found</h1></div>;
    }

    const pieData = {
        labels: ["Employee Budget", "Technical Budget", "Additional Budget", "Remaining Budget"],
        datasets: [
            {
                data: [
                    project.employee_budget,
                    project.technical_budget,
                    project.additional_budget,
                    project.remaining_budget,
                ],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#66BB6A"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#66BB6A"],
            },
        ],
    };

    const handleRedirect = () => {
      const projectId = project.project_id; 
      const clientId = project.client_id;
  
      // Navigate to FinanceFormPage with project_id and client_id in state
      navigate('/FinanceForm', {
        state: { project_id: projectId, client_id: clientId },
      });
    };

    return (
        <div>
            <NavBar />
            <div style={styles.container}>
                <div style={styles.projectNameBox}>
                    <h1>{project.project_name}</h1>
                    <Button 
                    colorPalette='blue'
                    onClick={handleRedirect}>
                      invoice
                    </Button>
                    <Button colorScheme='green' onClick={() => navigate(`/InvoiceDetailsPage/${projectId}`)}>
                      View Invoice
                    </Button>
                </div>
                <div style={styles.metricsBox}>
                    <h1 style={styles.keyMetricsHeading}>Key Metrics</h1>
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
                        {employees.map((employee) => (
                            <div key={employee.id} style={styles.employeeIdBox}>
                                <img
                                    src={"/manager.png"} // Adjust the path as necessary
                                    alt={employee.name}
                                    style={styles.employeeImage}
                                />
                                <h1>{employee.name}</h1>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h1 style={styles.budgetTrackingHeading}>Budget and Expense Tracking</h1>
                    <Pie data={pieData} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "20px",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
    },
    projectNameBox: {
        width: "100%",
        textAlign: "center",
        padding: "10px",
        borderBottom: "2px solid #ccc",
        fontSize: "2.5rem",
        fontWeight: "bold",
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
        gridTemplateColumns: "repeat(3, 1fr)",
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
        flex: "1",
        textAlign: "center",
        fontSize: "1.8rem", // Increased font size for better visibility
        fontWeight: "bold",
    },
    employeesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
        flex: "2",
    },
    employeeIdBox: {
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "10px",
        textAlign: "center",
    },
    employeeImage: {
        width: "100px", // Adjust size as necessary
        height: "100px", // Adjust size as necessary
        borderRadius: "50%", // Makes the image circular
        objectFit: "cover", // Ensures the image covers the entire circular area
        marginBottom: "10px", // Space between image and name
    },
    budgetTrackingHeading: {
        fontSize: "1.8rem", // Increased font size
        fontWeight: "bold",
        textAlign: "center",
    },
    keyMetricsHeading: {
        fontSize: "1.8rem", // Increased font size
        fontWeight: "bold",
        textAlign: "center",
    },
};
