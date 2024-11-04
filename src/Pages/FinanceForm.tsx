// FinanceForm.tsx
import React, { useState } from 'react';
import axios from 'axios';

const FinanceForm: React.FC = () => {
  const [projectID, setProjectID] = useState('');
  const [clientID, setClientID] = useState('');
  const [financeUserID, setFinanceUserID] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [bankPayeeName, setBankPayeeName] = useState('');
  const [bankIFSC, setBankIFSC] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const financeData = {
      project_id: Number(projectID),
      client_id: Number(clientID),
      finance_user_id: Number(financeUserID),
      invoice_number: invoiceNumber,
      amount: Number(amount),
      status,
      transaction_date: transactionDate,
      bank_name: bankName,
      bank_account_no: bankAccountNo,
      bank_payee_name: bankPayeeName,
      bank_ifsc: bankIFSC,
    };

    try {
      const response = await axios.post('http://localhost:3001/api/finance', financeData, {
        responseType: 'blob',
      });

      const fileURL = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `finance_transaction_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error generating finance transaction PDF', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Project ID:
        <input type="number" value={projectID} onChange={(e) => setProjectID(e.target.value)} />
      </label>
      <label>
        Client ID:
        <input type="number" value={clientID} onChange={(e) => setClientID(e.target.value)} />
      </label>
      <label>
        Finance User ID:
        <input type="number" value={financeUserID} onChange={(e) => setFinanceUserID(e.target.value)} />
      </label>
      <label>
        Invoice Number:
        <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
      </label>
      <label>
        Amount:
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </label>
      <label>
        Status:
        <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
      </label>
      <label>
        Transaction Date:
        <input type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} />
      </label>
      <label>
        Bank Name:
        <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} />
      </label>
      <label>
        Bank Account No:
        <input type="text" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} />
      </label>
      <label>
        Bank Payee Name:
        <input type="text" value={bankPayeeName} onChange={(e) => setBankPayeeName(e.target.value)} />
      </label>
      <label>
        Bank IFSC:
        <input type="text" value={bankIFSC} onChange={(e) => setBankIFSC(e.target.value)} />
      </label>
      <button type="submit" style={styles.button} onSubmit={handleSubmit}>Generate PDF</button>
    </form>
  );
};

export default FinanceForm;


const styles: Record<string, React.CSSProperties> = {
    button: {
      padding: '10px',
      background: '#2222fd',
    },
};