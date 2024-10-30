import React from 'react';
import Footer from '../Components/Footer';


const ClientInput: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* Navigation Bar */}
      <div style={styles.navBar}>
        <h2 style={styles.title}>Client Input Form</h2>
        <div style={styles.navButtons}>
          <button style={styles.navButton}>Project</button>
          <button style={styles.navButton}>Employee</button>
          <button style={styles.navButton}>Client</button>
          <button style={styles.searchButton}>Search</button>
        </div>
      </div>

      {/* Client Input Form */}
      <div style={styles.formContainer}>
        <form style={styles.form}>
          <label style={styles.label}>
            Client Name:
            <input type="text" placeholder="Enter client name" style={styles.input} required />
          </label>

          <label style={styles.label}>
            Organization:
            <input type="text" placeholder="Enter organization name" style={styles.input} required />
          </label>

          <label style={styles.label}>
            Phone:
            <input type="tel" placeholder="Enter phone number" style={styles.input} required />
          </label>

          <label style={styles.label}>
            Email:
            <input type="email" placeholder="Enter email address" style={styles.input} required />
          </label>

          <label style={styles.label}>
            Address:
            <input type="text" placeholder="Enter address" style={styles.input} required />
          </label>

          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Status</legend>
            <label style={styles.radioLabel}>
              <input type="radio" name="status" value="active" defaultChecked /> Active
            </label>
            <label style={styles.radioLabel}>
              <input type="radio" name="status" value="inactive" /> Inactive
            </label>
          </fieldset>

          <div style={styles.buttonContainer}>
            <button type="button" style={styles.cancelButton}>Cancel</button>
            <button type="submit" style={styles.saveButton}>Save</button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div style={styles.footerContainer}>
        <Footer />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '110vh', // Reduced height to 90% of viewport height
    width: '100vw', // Full width of the viewport
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Space between nav, form, and footer
    alignItems: 'center',
    backgroundColor: '#4a626e', // Set to a darker background color
    padding: '20px',
    boxSizing: 'border-box', // Include padding in height/width
  },
  navBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '20px',
    borderBottom: '1px solid #ddd',
    paddingBottom: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff', // Set title color to white
  },
  navButtons: {
    display: 'flex',
    gap: '10px',
  },
  navButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff', // Set button color to white
    cursor: 'pointer',
    fontSize: '16px',
    textDecoration: 'underline',
  },
  searchButton: {
    backgroundColor: '#008080',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  formContainer: {
    width: '100%', // Ensure form takes full width
    maxWidth: '600px', // Optional max width
    flex: 1, // Allow form to grow and occupy available space
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Center the form
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%', // Full width of the form container
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '16px',
    color: '#333',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginTop: '5px',
  },
  fieldset: {
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '10px',
  },
  legend: {
    fontSize: '16px',
    color: '#333',
  },
  radioLabel: {
    fontSize: '16px',
    color: '#333',
    marginRight: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center', // Center the buttons
    gap: '10px',
    marginTop: '15px',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '16px',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '16px',
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'center', // Center the footer
    width: '100%', // Full width of the container
    marginTop: '20px',
  },
};

export default ClientInput;
