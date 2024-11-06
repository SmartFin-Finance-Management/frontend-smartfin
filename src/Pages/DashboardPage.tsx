import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, Heading, Text, VStack, HStack, Button, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Import necessary components
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import dayjs from 'dayjs';
import { Navigate, useNavigate } from 'react-router-dom';

export interface Organisation {
  org_id: number;
  name: string;
  type: string;
  address: string;
  contact_info: string;
}

export interface BudgetDetails {
  total_budget: number;
  spent: number;
  remaining: number;
  projects: Array<{
    _id: string;
    project_id: number;
    org_id: number;
    client_id: number;
  }>;
}

export interface Project {
  project_id: number;
  org_id: number;
  client_id: number;
  project_name: string;
  start_date: Date;
  end_date: Date;
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

export interface Client {
  org_id: number;
  name: string;
  contact_info: string;
}

export interface Employee {
  employee_id: number;
  org_id: number;
  client_id: number;
  name: string;
  email: string;
  role: string;
  employee_type: string;
  experience: number;
  lpa: number;
  hourly_rate: number;
  project_id: number;
  project_history: number[];
  project_manager_id: number;
  attendance: Record<string, string>;
}

const DashboardPage = () => {
  const [organization, setOrganization] = useState<Organisation | null>(null);
  const [budgetDetails, setBudgetDetails] = useState<BudgetDetails | null>(null);
  const [employee, setEmployee] = useState<Employee[] | null>(null);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [activeProjects, setActiveProjects] = useState<number>(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const orgId = sessionStorage.getItem('org_id');
        const token = sessionStorage.getItem('authToken'); // Retrieve the token from the session storage
        const response = await axios.get<Organisation>(`http://localhost:7000/api/organisations/Org/${orgId}`,{
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the Authorization header
          }
        });
        setOrganization(response.data);
      } catch (error) {
        console.error("Failed to fetch organization data", error);
      }
    };

    const fetchBudgetDetails = async () => {
      try {
        const orgId = sessionStorage.getItem('org_id');
        const token = sessionStorage.getItem('authToken'); // Retrieve the token from the session storage
        const response = await axios.get<BudgetDetails>(`http://localhost:7000/api/organisations/${orgId}/projects/budget_details`,{
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the Authorization header
          }
        });
        setBudgetDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch budget details", error);
      }
    };

    const fetchTotalEmployees = async () => {
      try {
        const orgId = sessionStorage.getItem('org_id');
        const token = sessionStorage.getItem('authToken');
        const response = await axios.get<Employee[]>(`http://localhost:7000/api/organisations/${orgId}/employees`,{
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the Authorization header
          }
        });
        setTotalEmployees(response.data.length);
        setEmployee(response.data);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      }
    };

    const fetchTotalProjects = async () => {
      try {
        const orgId = sessionStorage.getItem('org_id');
        const token = sessionStorage.getItem('authToken'); // Retrieve the token from the session storage
        const response = await axios.get<Project[]>(`http://localhost:7000/api/organisations/${orgId}/projects`,{
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the Authorization header
          }
        });
        const projects = response.data;
        setTotalProjects(projects.length);
        setActiveProjects(projects.filter((project) => project.status === 'ongoing').length);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const orgId = sessionStorage.getItem('org_id');
        const token = sessionStorage.getItem('authToken'); // Retrieve the token from the session storage
        const response = await axios.get(`http://localhost:7000/api/organisations/${orgId}/projects`,{
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the Authorization header
          }
        });
        setProjects(response.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
    fetchOrganization();
    fetchTotalEmployees();
    fetchTotalProjects();
    fetchBudgetDetails();
  }, []);
  
  // Registering Chart.js components
  Chart.register(LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend); // Register required components

  const budgetData = {
    labels: ['Spent', 'Remaining'],
    datasets: [
      {
        data: [
          budgetDetails?.spent || 0,
          budgetDetails?.remaining || 0,
        ],
        backgroundColor: ['#e53e3e', '#38a169'],
        hoverBackgroundColor: ['#fc8181', '#68d391'],
      },
    ],
  };

  const chartData = {
    labels: projects.map((project) => project.project_name),
    datasets: [
      {
        label: 'Project Duration',
        data: projects.map((project) => {
          const start = dayjs(project.start_date);
          const end = dayjs(project.end_date);
          return end.diff(start, 'day'); // Calculate duration in days
        }),
        backgroundColor: '#4A90E2',
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y' as const, // Horizontal bar chart
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const project = projects[context.dataIndex];
            return `Duration: ${context.raw} days (${dayjs(project.start_date).format('MMM D, YYYY')} - ${dayjs(project.end_date).format('MMM D, YYYY')})`;
          },
        },
      },
      title: {
        display: true,
        text: 'Project Timelines',
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Duration (Days)',
        },
      },
      y: {
        type: 'category', // Use category for the Y axis
      },
    },
  };

  return (
    <>
      <NavBar />
      <Box p={8} bg="gray.50" minH="100vh">
        <Heading as="h1" size="xl" textAlign="center" mb={6} color="teal.600">
          Welcome {organization?.name || "Organization"} Dashboard
        </Heading>

        <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={6}>
          {/* General Stats */}
          <GridItem colSpan={{ base: 3, md: 1 }} p={6} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="xl" mb={4} color="teal.500">General Stats</Heading>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between" borderBottom="1px solid" borderColor="gray.200" pb={2}>
                <Text>Total Employees</Text>
                <Text fontWeight="bold">{totalEmployees}</Text>
              </HStack>
              <HStack justify="space-between" borderBottom="1px solid" borderColor="gray.200" pb={2}>
                <Text>Total Projects</Text>
                <Text fontWeight="bold">{totalProjects}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Active Projects</Text>
                <Text fontWeight="bold">{activeProjects}</Text>
              </HStack>
            </VStack>
          </GridItem>

          {/* Budget Summary */}
          <GridItem colSpan={{ base: 3, md: 2 }} p={6} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="xl" mb={4} color="teal.500">Budget Summary</Heading>
            
            <Flex justifyContent="space-between" alignItems="center">
              {/* Budget Text Summary */}
              <VStack spacing={4} align="stretch" flex="1">
                <HStack justify="space-between" borderBottom="1px solid" borderColor="gray.200" pb={2}>
                  <Text>Total Budget</Text>
                  <Text fontWeight="bold">{budgetDetails?.total_budget || 0}</Text>
                </HStack>
                <HStack justify="space-between" borderBottom="1px solid" borderColor="gray.200" pb={2}>
                  <Text>Spent</Text>
                  <Text fontWeight="bold">{budgetDetails?.spent || 0}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Remaining</Text>
                  <Text fontWeight="bold">{budgetDetails?.remaining || 0}</Text>
                </HStack>
              </VStack>

              {/* Doughnut Chart */}
              <Box width="350px" height="350px">
                <Doughnut data={budgetData} />
              </Box>
            </Flex>
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(1, 1fr)" gap={6} mb={6}>
           {/* Project Chart */}
           <GridItem colSpan={{ base: 3, md: 1 }} p={6} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="xl" mb={4} color="teal.500">Project Duration</Heading>
            <Box width="100%" height="100%">
              <Bar data={chartData} options={chartOptions} />
            </Box>
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(1, 1fr)" gap={6} mb={6}>
          {/* Employee List */}
{/* Employee List */}
<GridItem colSpan={{ base: 3, md: 1 }} p={6} bg="white" borderRadius="md" boxShadow="sm">
  <Heading size="xl" mb={4} color="teal.500">Employees</Heading>
  <VStack align="stretch" spacing={2}>
  {employee && employee.length > 0 ? (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
        <th style={{ padding: '8px' }}>Name</th>
        <th style={{ padding: '8px' }}>Salary (LPA)</th>
        <th style={{ padding: '8px' }}>Role</th>
        <th style={{ padding: '8px' }}>Action</th>
      </tr>
    </thead>
    <tbody>
      {employee
        .sort((a, b) => parseFloat(b.lpa.$numberDecimal) - parseFloat(a.lpa.$numberDecimal)) // Sorting in descending order by LPA
        .slice(0, 5) // Only top 5 employees
        .map((emp) => (
          <tr key={emp.employee_id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '8px' }}>{emp.name}</td>
            <td style={{ padding: '8px' }}>{parseFloat(emp.lpa.$numberDecimal)}</td>
            <td style={{ padding: '8px' }}>{emp.role}</td>
            <td style={{ padding: '8px' }}>
              <button style={{ padding: '4px 8px', color: 'white', backgroundColor: '#3182ce', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              onClick={()=>{  navigate('/EmployeeDetailsPage')
              }}
              >
                View
              </button>
            </td>
          </tr>
        ))}
    </tbody>
  </table>
) : (
  <p>No employees found.</p>
)}

  </VStack>
</GridItem>


          {/* Financial Reports */}
          {/* <GridItem colSpan={{ base: 2, md: 1 }} p={6} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={4} color="teal.500">Financial Reports</Heading>
            <VStack spacing={3} align="stretch">
              <Text>Monthly Expenses: $50,000</Text>
              <Text>Profit/Loss: $25,000</Text>
              <Text>Projected Profit: $100,000</Text>
            </VStack>
            <Button mt={4} colorScheme="teal" variant="outline" size="sm">
              View Financial Reports
            </Button>
          </GridItem>*/}
        </Grid> 

      </Box>
      <Footer />
    </>
  );
};

export default DashboardPage;