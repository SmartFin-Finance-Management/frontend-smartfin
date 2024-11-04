import React, { useState } from 'react';

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    orgData: { org_id: number; name: string; type?: string; address?: string; contact_info?: string };
    onUpdate: (updatedData: any) => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, orgData, onUpdate }) => {
    const [formData, setFormData] = useState({ ...orgData });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
    };

    if (!isOpen) return null;

    return (
        <div style ={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h2 style={styles.modalTitle}>Update Organization</h2>
                <form onSubmit={handleSubmit}>
                    <label style={styles.label}>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </label>
                    <label style={styles.label}>
                        Type:
                        <input
                            type="text"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </label>
                    <label style={styles.label}>
                        Address:
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </label>
                    <label style={styles.label}>
                        Contact Info:
                        <input
                            type="text"
                            name="contact_info"
                            value={formData.contact_info}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </label>
                    <div style={styles.buttonContainer}>
                        <button type="submit" style={styles.submitButton}>Update</button>
                        <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000, // Ensure the modal is on top
    },
    modalContent: {
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        width: '400px',
        maxWidth: '90%', // Responsive width
    },
    modalTitle: {
        fontSize: '24px',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center',
    },
    label: {
        display: 'block',
        marginBottom: '10px',
        fontSize: '16px',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginBottom: '20px',
        fontSize: '14px',
        transition: 'border-color 0.3s',
    },
    inputFocus: {
        borderColor: '#007bff',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    submitButton: {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    cancelButton: {
        padding: '10px 15px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default UpdateModal;
