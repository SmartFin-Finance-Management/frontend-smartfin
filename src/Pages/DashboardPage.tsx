import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, Heading, Text, VStack, HStack, Button, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

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

export interface Project  {
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
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [activeProjects, setActiveProjects] = useState<number>(0);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const orgId = sessionStorage.getItem('org_id');
        const response = await axios.get<Organisation>(`http://localhost:5000/Org/${orgId}`);
        setOrganization(response.data);
      } catch (error) {
        console.error("Failed to fetch organization data", error);
      }
    };

    const fetchBudgetDetails = async () => {
      try {
        const orgId = sessionStorage.getItem('org_id');
        const response = await axios.get<BudgetDetails>(`http://localhost:5000/${orgId}/projects/budget_details`);
        setBudgetDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch budget details", error);
      }
    };

    const fetchTotalEmployees = async () => {
      try {
        const orgId = sessionStorage.getItem('org_id');
        const response = await axios.get<Employee[]>(`http://localhost:5000/${orgId}/employees`);
        setTotalEmployees(response.data.length);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      }
    };

    const fetchTotalProjects = async () => {
      try {
        const orgId = sessionStorage.getItem('org_id');
        const response = await axios.get<Project[]>(`http://localhost:5000/${orgId}/projects`);
        const projects = response.data;
        setTotalProjects(projects.length);
        setActiveProjects(projects.filter((project) => project.status === 'ongoing').length);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    

    fetchOrganization();
    fetchTotalEmployees();
    fetchTotalProjects();

    fetchOrganization();
    fetchBudgetDetails();
  }, []);

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
            <Heading size="md" mb={4} color="teal.500">General Stats</Heading>
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
          <GridItem colSpan={{ base: 3, md: 1 }} p={6} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={4} color="teal.500">Budget Summary</Heading>
            
            <Flex justifyContent="space-between" alignItems="center">
              {/* Budget Text Summary */}
              <VStack spacing={4} align="stretch" flex="1">
                <HStack justify="space-between" borderBottom="1px solid" borderColor="gray.200" pb={2}>
                  <Text>Total Budget</Text>
                  <Text fontWeight="bold">₹{budgetDetails?.total_budget?.toLocaleString() || '0'}</Text>
                </HStack>
                <HStack justify="space-between" borderBottom="1px solid" borderColor="gray.200" pb={2}>
                  <Text>Spent</Text>
                  <Text fontWeight="bold">₹{budgetDetails?.spent?.toLocaleString() || '0'}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Remaining</Text>
                  <Text fontWeight="bold">₹{budgetDetails?.remaining?.toLocaleString() || '0'}</Text>
                </HStack>
              </VStack>

              {/* Donut Chart */}
              <Box width="150px" height="150px" ml={6}>
                <Doughnut data={budgetData} />
              </Box>
            </Flex>
          </GridItem>

          <GridItem colSpan={{ base: 3, md: 1 }} p={6} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={4} color="teal.500">Project Overview</Heading>
            <VStack spacing={4} align="stretch">
              <Text>Project A: 80% Complete</Text>
              <Text>Project B: 50% Complete</Text>
              <Text>Project C: 30% Complete</Text>
            </VStack>
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {/* Employees List */}
          <GridItem colSpan={{ base: 2, md: 1 }} p={6} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={4} color="teal.500">Employees</Heading>
            <VStack spacing={3} align="stretch">
              <Text>John Doe - Project Manager</Text>
              <Text>Jane Smith - Developer</Text>
              <Text>Samuel Green - Designer</Text>
              <Text>Anna White - QA Engineer</Text>
            </VStack>
            <Button mt={4} colorScheme="teal" variant="outline" size="sm">
              View All Employees
            </Button>
          </GridItem>

          {/* Financial Reports */}
          <GridItem colSpan={{ base: 2, md: 1 }} p={6} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={4} color="teal.500">Financial Reports</Heading>
            <VStack spacing={3} align="stretch">
              <Text>Monthly Expenses: $50,000</Text>
              <Text>Profit/Loss: $25,000</Text>
              <Text>Projected Profit: $100,000</Text>
            </VStack>
            <Button mt={4} colorScheme="teal" variant="outline" size="sm">
              View Financial Reports
            </Button>
          </GridItem>
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default DashboardPage;

