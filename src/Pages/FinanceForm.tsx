import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

interface IFinanceForm {
  transaction_id: number;
  project_id: number;
  client_id: number;
  finance_user_id: number;
  invoice_number: string;
  amount: number;
  status: string;
  transaction_date: string;
  bank_name: string;
  bank_account_no: string;
  bank_payee_name: string;
  bank_ifsc: string;
}

const FinanceForm: React.FC = () => {
  const location = useLocation();
  const { project_id = 0, client_id = 0 } = location.state || {};

  const [formData, setFormData] = useState<IFinanceForm>({
    transaction_id: 0,
    project_id,
    client_id,
    finance_user_id: 0,
    invoice_number: '',
    amount: 0,
    status: '',
    transaction_date: '',
    bank_name: '',
    bank_account_no: '',
    bank_payee_name: '',
    bank_ifsc: '',
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    // Bank account number validation (example: must be 10-16 digits)
    if (!/^\d{10,16}$/.test(formData.bank_account_no)) {
      newErrors.bank_account_no = 'Bank Account Number must be between 10-16 digits.';
    }

    // IFSC validation (standard 11 characters, alphanumeric)
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bank_ifsc)) {
      newErrors.bank_ifsc = 'Invalid IFSC code. It should be 11 characters (e.g., ABCD0123456).';
    }

    // Set errors state
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' || name === 'transaction_id' || name === 'project_id' || name === 'client_id' || name === 'finance_user_id'
        ? Number(value)
        : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    const url = `http://localhost:8000/finance`;

    try {
      const response = await axios.post(url, formData, {
        responseType: 'blob',
      });
  
      const fileURL = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `finance_transaction_${formData.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      toast.success("Finance record successfully created!");

      // Clear form after successful submission
      setFormData({
        ...formData,
        transaction_id: formData.transaction_id + 1,
        project_id: 0,
        client_id: 0,
        finance_user_id: 0,
        invoice_number: '',
        amount: 0,
        status: '',
        transaction_date: '',
        bank_name: '',
        bank_account_no: '',
        bank_payee_name: '',
        bank_ifsc: '',
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create finance record');
    }
  };

  return (
    <div style={styles.page}>
      <NavBar />
      <div style={styles.container}>
        <h2 style={styles.title}>Finance Management Form</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <label style={styles.label}>
              Transaction ID:
              <input
                type="number"
                name="transaction_id"
                value={formData.transaction_id}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Project ID:
              <input
                type="number"
                name="project_id"
                value={formData.project_id}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Client ID:
              <input
                type="number"
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Finance User ID:
              <input
                type="number"
                name="finance_user_id"
                value={formData.finance_user_id}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Invoice Number:
              <input
                type="text"
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Amount:
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Status:
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Transaction Date:
              <input
                type="date"
                name="transaction_date"
                value={formData.transaction_date}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Bank Name:
              <input
                type="text"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Bank Account Number:
              <input
                type="text"
                name="bank_account_no"
                value={formData.bank_account_no}
                onChange={handleChange}
                style={styles.input}
                required
              />
              {errors.bank_account_no && <p style={styles.error}>{errors.bank_account_no}</p>}
            </label>
            <label style={styles.label}>
              Bank Payee Name:
              <input
                type="text"
                name="bank_payee_name"
                value={formData.bank_payee_name}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Bank IFSC:
              <input
                type="text"
                name="bank_ifsc"
                value={formData.bank_ifsc}
                onChange={handleChange}
                style={styles.input}
                required
              />
              {errors.bank_ifsc && <p style={styles.error}>{errors.bank_ifsc}</p>}
            </label>
          </div>
          <div style={styles.buttons}>
            <button type="button" style={styles.cancelButton} onClick={() => window.history.back()}>Cancel</button>
            <button type="submit" style={styles.submitButton}>Submit</button>
          </div>
        </form>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    color: '#343a40',
    textAlign: 'center' as const,
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  label: {
    fontWeight: 'bold' as const,
    color: '#495057',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  input: {
    padding: '0.5rem',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  cancelButton: {
    padding: '0.5rem 1.5rem',
    fontSize: '16px',
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
    border: '1px solid #6c757d',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '0.5rem 1.5rem',
    fontSize: '16px',
    color: '#ffffff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '4px',
  },
};

export default FinanceForm;
