import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Box, Heading, Table, Text, Input, IconButton, Flex, Stack, Button } from '@chakra-ui/react';
import { FaSort, FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import TopBar from '../Components/TopBar';
import Footer from '../Components/Footer';
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../Components/ui/dialog";
import { Field } from "../Components/ui/field";
import NavBar from '../Components/NavBar';
import { useNavigate } from 'react-router-dom';


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
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility
  const ref = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      const orgId = Number(sessionStorage.getItem("org_id") || 0);
      const url = `http://localhost:7000/api/organisations/${orgId}/employees`;

      try {
        const token = sessionStorage.getItem("authToken");
        const response = await axios.get(url,{
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the Authorization header
          }
        });
        
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

  const deleteEmployee = async (employee_id: number) => {
    try {
      const token = sessionStorage.getItem("authToken");
      await axios.delete(`http://localhost:7000/api/employees/employees/${employee_id}`,{
        headers: {
          Authorization: `Bearer ${token}` // Add the token to the Authorization header
        }
      });
      
      setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.employee_id !== employee_id));
      setFilteredEmployees((prevFiltered) => prevFiltered.filter((emp) => emp.employee_id !== employee_id));
      
      toast({
        title: "Employee deleted",
        description: `Employee with ID ${employee_id} has been deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast({
        title: "Error",
        description: "Failed to delete employee. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
    setSelectedEmployee(null); // Reset selected employee
  };

  const handleSaveChanges = async () => {
    if (selectedEmployee) {
      try {
        const token = sessionStorage.getItem("authToken");
        await axios.put(`http://localhost:7000/api/employees/employees/${selectedEmployee.employee_id}`, selectedEmployee,{
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the Authorization header
          }
        });
        // Update the local state
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.employee_id === selectedEmployee.employee_id ? selectedEmployee : emp
          )
        );
        setFilteredEmployees((prevFiltered) =>
          prevFiltered.map((emp) =>
            emp.employee_id === selectedEmployee.employee_id ? selectedEmployee : emp
          )
        );
        
        toast({
          title: "Employee updated",
          description: `Employee with ID ${selectedEmployee.employee_id} has been updated.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        handleCloseDialog(); // Close the dialog after saving
      } catch (error) {
        console.error("Error updating employee:", error);
        toast({
          title: "Error",
          description: "Failed to update employee. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      {/* <TopBar /> */}
      <NavBar />
      <Box maxW="1300px" mx="auto" my="3rem" p="6" borderWidth="1px" borderRadius="lg" bg="gray.50" boxShadow="lg">
      <Flex justify="space-between" align="center" mb="6">
        <Heading as="h1" fontSize="2xl" fontWeight="extrabold" color="gray.700">
          Employee Details
        </Heading>
        <Button colorPalette='green' onClick={() => navigate('/EmployeeFormPage')}>
          Add New Employee
        </Button>
      </Flex>
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
                <Table.ColumnHeader onClick={() => handleSort('employee_id')}><Flex align="center"><Text as="span" mr="1">ID</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('name')}><Flex align="center"><Text as="span" mr="1">Name</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('email')}><Flex align="center"><Text as="span" mr="1">Email</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('role')}><Flex align="center"><Text as="span" mr="1">Role</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('employee_type')}><Flex align="center"><Text as="span" mr="1">Employee Type</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('experience')}><Flex align="center"><Text as="span" mr="1">Experience</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('lpa')}><Flex align="center"><Text as="span" mr="1">LPA</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('hourly_rate')}><Flex align="center"><Text as="span" mr="1">Hourly Rate</Text> <FaSort /></Flex></Table.ColumnHeader>
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
                      colorPalette='blue'
                      aria-label="Edit"
                      size="sm"
                      mr="2"
                      onClick={() => {
                        handleEdit(employee);
                      }}
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton
                      colorPalette='red'
                      aria-label="Delete"
                      size="sm"
                      onClick={() => deleteEmployee(employee.employee_id)}
                    >
                      <FaTrash />
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
      <Footer />
      <ToastContainer style={{ top: '5%', left: '50%', transform: 'translateX(-50%)' }} />
      
      {/* Edit Employee Dialog */}
      <DialogRoot open={isDialogOpen} onOpenChange={handleCloseDialog}>
        {selectedEmployee && <DialogTrigger as={Button}>Edit Employee</DialogTrigger>}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee Details</DialogTitle>
          </DialogHeader>
          <DialogBody pb="4">
            {selectedEmployee && (
            <Stack spacing={4}>
              <Field label="Name">
                <Input
                  placeholder="Name"
                  value={selectedEmployee.name}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
                />
              </Field>
              <Field label="Email">
                <Input
                  placeholder="Email"
                  value={selectedEmployee.email}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                />
              </Field>
              <Field label="Role">
                <Input
                  placeholder="Role"
                  value={selectedEmployee.role}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, role: e.target.value })}
                />
              </Field>
              <Field label="Employee Type">
                <select
                  name="employee_type"
                  value={selectedEmployee.employee_type} // Set the value to the employee's current type
                  style={styles.input}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, employee_type: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Employee Type</option>
                  <option value="full">Full</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="intern">Intern</option>
                </select>
              </Field>
              <Field label="Experience">
                <Input
                  placeholder="Experience"
                  value={selectedEmployee.experience}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, experience: Number(e.target.value) })}
                />
              </Field>
              <Field label="LPA">
                <Input
                  placeholder="LPA"
                  value={selectedEmployee.lpa}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, lpa: Number(e.target.value) })}
                />
              </Field>
              <Field label="Hourly Rate">
                <Input
                  placeholder="Hourly Rate"
                  value={selectedEmployee.hourly_rate}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, hourly_rate: Number(e.target.value) })}
                />
              </Field>
            </Stack>
            )}
          </DialogBody>
          <DialogFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSaveChanges}>
              Save Changes
            </Button>
            <Button variant="ghost" onClick={handleCloseDialog}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '1rem',
      border: '1px solid #ccc',
      borderRadius: '5px',
      outline: 'none',
      marginTop: '5px',
    }
  };

export default EmployeeDetailsPage;
