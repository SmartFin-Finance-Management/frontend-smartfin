import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Heading, Table, Text, Input, IconButton, Flex } from '@chakra-ui/react';
import { FaSort, FaEdit, FaTrash } from 'react-icons/fa';
import TopBar from '../Components/TopBar';
import Footer from '../Components/Footer';

interface Employee {
  employee_id: number;
  org_id: number;
  client_id: number;
  name: string;
  email: string;
  role: string;
  employee_type: string;
  experience: number;
  lpa: string | number;
  hourly_rate: string | number;
  project_id: number;
  project_history: number[];
  project_manager_id: number;
  attendance: Record<string, string>;
}

const EmployeeDetailsPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Employee; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      const orgId = Number(sessionStorage.getItem("org_id") || 0);
      const url = `http://localhost:5000/${orgId}/employees`;

      try {
        const response = await axios.get(url);
        
        const convertedEmployees = response.data.map((employee: any) => ({
          ...employee,
          lpa: parseFloat(employee.lpa?.$numberDecimal || employee.lpa),
          hourly_rate: parseFloat(employee.hourly_rate?.$numberDecimal || employee.hourly_rate),
        }));
        
        setEmployees(convertedEmployees);
        setFilteredEmployees(convertedEmployees);
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSort = (key: keyof Employee) => {
    const direction = sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedData = [...filteredEmployees].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredEmployees(sortedData);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = employees.filter((employee) =>
      Object.values(employee).some((val) =>
        String(val).toLowerCase().includes(value)
      )
    );

    setFilteredEmployees(filtered);
  };

  return (
    <>
      <TopBar />
      <Box maxW="1300px" mx="auto" my="3rem" p="6" borderWidth="1px" borderRadius="lg" bg="gray.50" boxShadow="lg">
        <Heading as="h2" size="lg" textAlign="center" color="gray.700" mb="6">
          Employee Details
        </Heading>
        <Flex justifyContent="space-between" mb="4">
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={handleSearch}
            maxW="300px"
          />
        </Flex>
        <Box overflowX="auto">
          <Table.Root size={{ base: 'sm', md: 'md' }}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader onClick={() => handleSort('employee_id')}>ID <FaSort /></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('name')}>Name <FaSort /></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('email')}>Email <FaSort /></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('role')}>Role <FaSort /></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('employee_type')}>Employee Type <FaSort /></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('experience')}>Experience <FaSort /></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('lpa')}>LPA <FaSort /></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('hourly_rate')}>Hourly Rate <FaSort /></Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredEmployees.map((employee) => (
                <Table.Row key={employee.employee_id}>
                  <Table.Cell>{employee.employee_id}</Table.Cell>
                  <Table.Cell>{employee.name}</Table.Cell>
                  <Table.Cell>
                    <Text isTruncated maxW={{ base: "120px", md: "200px" }}>
                      {employee.email}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{employee.role}</Table.Cell>
                  <Table.Cell>{employee.employee_type}</Table.Cell>
                  <Table.Cell>{employee.experience}</Table.Cell>
                  <Table.Cell>{employee.lpa}</Table.Cell>
                  <Table.Cell>{employee.hourly_rate}</Table.Cell>
                  <Table.Cell>
                    <IconButton
                      aria-label="Edit"
                      icon={<FaEdit />}
                      size="sm"
                      mr="2"
                      onClick={() => console.log(`Edit ${employee.employee_id}`)}
                    />
                    <IconButton
                      aria-label="Delete"
                      icon={<FaTrash />}
                      size="sm"
                      onClick={() => console.log(`Delete ${employee.employee_id}`)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default EmployeeDetailsPage;
