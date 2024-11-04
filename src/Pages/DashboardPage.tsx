import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, Heading, Text, VStack, HStack, Button, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

export interface Project  {
  project_id: number;
  project_name: string;
  start_date: string;
  end_date: string;
  status: string;
}

const DashboardPage = () => {
  const [organization, setOrganization] = useState(null);
  const [budgetDetails, setBudgetDetails] = useState(null);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [activeProjects, setActiveProjects] = useState<number>(0);
  const [projectDates, setProjectDates] = useState<Project[]>([]);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const orgId = sessionStorage.getItem('org_id');
        const response = await axios.get(`http://localhost:5000/Org/${orgId}`);
        setOrganization(response.data);
      } catch (error) {
        console.error("Failed to fetch organization data", error);
      }
    };

    const fetchProjectDates = async () => {
      try {
        const orgId = sessionStorage.getItem('org_id');
        const response = await axios.get<Project[]>(`http://localhost:5000/${orgId}/projects`);
        setProjectDates(response.data);
        setTotalProjects(response.data.length);
        setActiveProjects(response.data.filter(project => project.status === 'ongoing').length);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    fetchOrganization();
    fetchProjectDates();
  }, []);

  // Prepare data for the project timeline chart
  const projectTimelineData = {
    labels: projectDates.map(project => project.project_name),
    datasets: [
      {
        label: 'Project Duration',
        data: projectDates.map(project => ({
          x: project.start_date,
          y: project.end_date,
        })),
        backgroundColor: '#3182ce',
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
            
            {/* Add Doughnut chart for budget summary here */}
          </GridItem>

          {/* Project Timeline Chart */}
          <GridItem colSpan={{ base: 3, md: 1 }} p={6} bg="white" borderRadius="md" boxShadow="sm">
            <Heading size="md" mb={4} color="teal.500">Project Timeline</Heading>
            <Bar
              data={projectTimelineData}
              options={{
                responsive: true,
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      unit: 'month'
                    },
                    title: {
                      display: true,
                      text: 'Project Start and End Dates'
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Projects'
                    }
                  }
                }
              }}
            />
          </GridItem>
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default DashboardPage;
