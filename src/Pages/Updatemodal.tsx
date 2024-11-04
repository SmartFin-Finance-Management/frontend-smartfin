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
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h2>Update Organization</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Type:
                        <input
                            type="text"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Address:
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Contact Info:
                        <input
                            type="text"
                            name="contact_info"
                            value={formData.contact_info}
                            onChange={handleChange}
                        />
                    </label>
                    <div>
                        <button type="submit">Update</button>
                        <button type="button" onClick={onClose}>Cancel</button>
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
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        background: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        width: '400px',
    },
};

export default UpdateModal;
