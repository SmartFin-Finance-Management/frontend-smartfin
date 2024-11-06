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
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AccessDenied from '../Components/AccessDenied';


interface IUser {
    org_id: number;  
    username: string; 
    role: string;     
    email: string;    
    password?: string; 
  }

  
interface Finance {
  transaction_id: number;
  project_id: number;
  client_id: number;
  finance_user_id: number;
  invoice_number: string;
  amount: number;
  status: string;
  transaction_date: Date;
  bank_name: string;
  bank_account_no: string;
  bank_payee_name: string;
  bank_ifsc: string;
}

const InvoiceDetailsPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Finance[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Finance[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Finance; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Finance | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [Role, setRole] = useState<string>("");

  useEffect(() => {
    const fetchEmployeeId = async () => {
        try {
          const token = sessionStorage.getItem('authToken');
          if (!token) {
            throw new Error('No auth token found');
          }
  
          // Decode the token
          const decodedToken = jwtDecode<IUser>(token);
  
          // Access the role from the decoded token
          const userRole = decodedToken.role; // Ensure `role` exists in your JWT payload
  
          // Set the role state
          setRole(userRole);
  
        } catch (error) {
          console.error('Failed to fetch role from token:', error);
        }
      };
  
      const fetchInvoices = async () => {
          const url = `http://localhost:8000/finance/project/${projectId}`;
          
          try {
              const response = await axios.get(url);
              setInvoices(response.data);
              setFilteredInvoices(response.data);
            } catch (error) {
                console.error("Failed to fetch invoice data:", error);
            }
        };
        
        fetchEmployeeId();
    fetchInvoices();
  }, [projectId]);

  const handleSort = (key: keyof Finance) => {
    const direction = sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedData = [...filteredInvoices].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredInvoices(sortedData);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = invoices.filter((invoice) =>
      Object.values(invoice).some((val) =>
        String(val).toLowerCase().includes(value)
      )
    );

    setFilteredInvoices(filtered);
  };

  const deleteInvoice = async (transaction_id: number) => {
    try {
      const res = await axios.delete(`http://localhost:8000/finance/${transaction_id}`);
      setInvoices((prevInvoices) => prevInvoices.filter((inv) => inv.transaction_id !== transaction_id));
      setFilteredInvoices((prevFiltered) => prevFiltered.filter((inv) => inv.transaction_id !== transaction_id));
console.log(res);

      toast({
        title: "Invoice deleted",
        description: `Invoice with ID ${transaction_id} has been deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting invoice:"+error, error);
      toast({
        title: "Error",
        description: "Failed to delete invoice. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (invoice: Finance) => {
    setSelectedInvoice(invoice);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedInvoice(null);
  };

  const handleSaveChanges = async () => {
    if (selectedInvoice) {
      try {
        await axios.put(`http://localhost:8000/finance/${selectedInvoice.transaction_id}`, selectedInvoice);
        setInvoices((prevInvoices) =>
          prevInvoices.map((inv) =>
            inv.transaction_id === selectedInvoice.transaction_id ? selectedInvoice : inv
          )
        );
        setFilteredInvoices((prevFiltered) =>
          prevFiltered.map((inv) =>
            inv.transaction_id === selectedInvoice.transaction_id ? selectedInvoice : inv
          )
        );

        toast({
          title: "Invoice updated",
          description: `Invoice with ID ${selectedInvoice.transaction_id} has been updated.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        handleCloseDialog();
      } catch (error) {
        console.error("Error updating invoice:", error);
        toast({
          title: "Error",
          description: "Failed to update invoice. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  if(Role !== 'Finance Manager' && Role !== 'admin' ) return <AccessDenied />;

  return (
    <>
      <NavBar />
      <Box maxW="1300px" mx="auto" my="3rem" p="6" borderWidth="1px" borderRadius="lg" bg="gray.50" boxShadow="lg">
        <Flex justify="space-between" align="center" mb="6">
          <Heading as="h1" fontSize="2xl" fontWeight="extrabold" color="gray.700">
            Invoice Details
          </Heading>
        </Flex>
        <Flex justifyContent="space-between" mb="4">
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={handleSearch}
            maxW="300px"
          />
        </Flex>
        <Box overflowX="auto">
          <Table.Root size={{ base: 'sm', md: 'md' }}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader onClick={() => handleSort('transaction_id')}><Flex align="center"><Text as="span" mr="1">Transaction ID</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('invoice_number')}><Flex align="center"><Text as="span" mr="1">Invoice Number</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('amount')}><Flex align="center"><Text as="span" mr="1">Amount</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('status')}><Flex align="center"><Text as="span" mr="1">Status</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('transaction_date')}><Flex align="center"><Text as="span" mr="1">Transaction Date</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('bank_name')}><Flex align="center"><Text as="span" mr="1">Bank Name</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('bank_account_no')}><Flex align="center"><Text as="span" mr="1">Bank Account No</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('bank_payee_name')}><Flex align="center"><Text as="span" mr="1">Bank Payee Name</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader onClick={() => handleSort('bank_ifsc')}><Flex align="center"><Text as="span" mr="1">Bank IFSC</Text> <FaSort /></Flex></Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredInvoices.map((invoice) => (
                <Table.Row key={invoice.transaction_id}>
                  <Table.Cell>{invoice.transaction_id}</Table.Cell>
                  <Table.Cell>{invoice.invoice_number}</Table.Cell>
                  <Table.Cell>{invoice.amount}</Table.Cell>
                  <Table.Cell>{invoice.status}</Table.Cell>
                  <Table.Cell>{new Date(invoice.transaction_date).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{invoice.bank_name}</Table.Cell>
                  <Table.Cell>{invoice.bank_account_no}</Table.Cell>
                  <Table.Cell>{invoice.bank_payee_name}</Table.Cell>
                  <Table.Cell>{invoice.bank_ifsc}</Table.Cell>
                  <Table.Cell>
                    <IconButton
                      colorPalette='blue'
                      aria-label="Edit"
                      size="sm"
                      mr="2"
                      onClick={() => handleEdit(invoice)}
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton
                      colorPalette='red'
                      aria-label="Delete"
                      size="sm"
                      onClick={() => deleteInvoice(invoice.transaction_id)}
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

      {/* Edit Invoice Dialog */}
      <DialogRoot open={isDialogOpen} onOpenChange={handleCloseDialog}>
        {/* {selectedInvoice && <DialogTrigger as={Button}>Edit Invoice</DialogTrigger>} */}
        <DialogContent>
          <DialogHeader>
            {selectedInvoice && <DialogTitle>Edit Invoice Details</DialogTitle>}
          </DialogHeader>
          <DialogBody pb="4">
              {selectedInvoice && (
                <Stack spacing={4}>
                  <Field label="Invoice Number">
                    <Input
                      placeholder="Invoice Number"
                      value={selectedInvoice.invoice_number}
                      onChange={(e) => setSelectedInvoice({ ...selectedInvoice, invoice_number: e.target.value })}
                    />
                  </Field>
                  <Field label="Amount">
                    <Input
                      placeholder="Amount"
                      type="number"
                      value={selectedInvoice.amount}
                      onChange={(e) => setSelectedInvoice({ ...selectedInvoice, amount: +e.target.value })}
                    />
                  </Field>
                  <Field label="Status">
                    <Input
                      placeholder="Status"
                      value={selectedInvoice.status}
                      onChange={(e) => setSelectedInvoice({ ...selectedInvoice, status: e.target.value })}
                    />
                  </Field>
                  {/* New Fields */}
                  <Field label="Bank Name">
                    <Input
                      placeholder="Bank Name"
                      value={selectedInvoice.bank_name}
                      onChange={(e) => setSelectedInvoice({ ...selectedInvoice, bank_name: e.target.value })}
                    />
                  </Field>
                  <Field label="Bank Account No">
                    <Input
                      placeholder="Bank Account No"
                      value={selectedInvoice.bank_account_no}
                      onChange={(e) => setSelectedInvoice({ ...selectedInvoice, bank_account_no: e.target.value })}
                    />
                  </Field>
                  <Field label="Bank Payee Name">
                    <Input
                      placeholder="Bank Payee Name"
                      value={selectedInvoice.bank_payee_name}
                      onChange={(e) => setSelectedInvoice({ ...selectedInvoice, bank_payee_name: e.target.value })}
                    />
                  </Field>
                  <Field label="Bank IFSC">
                    <Input
                      placeholder="Bank IFSC"
                      value={selectedInvoice.bank_ifsc}
                      onChange={(e) => setSelectedInvoice({ ...selectedInvoice, bank_ifsc: e.target.value })}
                    />
                  </Field>
                </Stack>
              )}
            </DialogBody>
          <DialogFooter>
            <Button colorPalette='red' onClick={handleCloseDialog}>Cancel</Button>
            <Button colorPalette="blue" onClick={handleSaveChanges}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default InvoiceDetailsPage;
