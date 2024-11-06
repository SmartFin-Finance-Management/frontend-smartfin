import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../Components/NavBar';
import { jwtDecode } from 'jwt-decode';
import AccessDenied from '../Components/AccessDenied';
import bcrypt from 'bcryptjs';

interface IUser {
  org_id: number;
  username: string;
  role: string;
  email: string;
  password?: string;
}


const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
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
    

    const fetchUsers = async () => {
      try {
        const orgId = sessionStorage.getItem('org_id');
        const response = await axios.get(`http://localhost:7000/api/auth/org/${orgId}`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchEmployeeId();
    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchUsername(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.username && user.username.toLowerCase().includes(searchUsername.toLowerCase())
  );

  const handleEditUser = (user: IUser) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user: IUser) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      const email = userToDelete.email;
      try {
        await axios.delete(`http://localhost:7000/api/auth/get/${email}`);
        setUsers(users.filter(user => user.email !== email));
        setShowDeleteModal(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUpdateUser = async () => {
    if (editUser) {
      try {

        await axios.put(`http://localhost:7000/api/auth/get/${editUser.email}`, editUser);
        setUsers(users.map(user => (user.email === editUser.email ? editUser : user)));
        setShowEditModal(false);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  if(Role !== 'admin') return <AccessDenied />;

  return (
    <div style={{ backgroundColor: '#546a7b', minHeight: '100vh' }}>
      <NavBar />
      <div style={styles.whiteContainer}>
        <div style={styles.container}>
          <h2 style={styles.title}>User Overview</h2>

          {/* Add User Button */}
          <button onClick={() => navigate('/userInput')} style={styles.addButton}>
            Add User
          </button>

          <div style={styles.filterContainer}>
            <input
              type="text"
              placeholder="Search by Username"
              value={searchUsername}
              onChange={handleSearch}
              style={{ ...styles.searchInput, color: 'black' }}
            />
          </div>

          <h3 style={styles.userListTitle}>User List</h3>
          <div style={styles.userList}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div key={user.email} style={styles.userItem}>
                  <FaUser style={styles.userIcon} />
                  <div style={styles.userDetails}>
                    <p style={{ ...styles.username, color: 'white' }}>{user.username}</p>
                    <p style={{ color: 'white' }}>{user.role}</p> {/* Set role text color to white */}
                  </div>
                  <div style={styles.actions}>
                    <FaEdit style={styles.editIcon} onClick={() => handleEditUser(user)} />
                    <FaTrash style={styles.deleteIcon} onClick={() => handleDeleteUser(user)} />
                  </div>
                </div>
              ))
            ) : (
              <p style={styles.noResults}>No users found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />

      {/* Edit User Modal */}
      {showEditModal && editUser && (
        <div style={styles.modal}>
          <h3>Edit User</h3>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={editUser.username}
              onChange={e => setEditUser({ ...editUser, username: e.target.value })}
              placeholder="Enter Username"
              style={styles.inputField}
            />
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Role</label>
            <select
              value={editUser.role}
              onChange={e => setEditUser({ ...editUser, role: e.target.value })}
              style={styles.inputField}
            >
              <option value="Finance Manager">Finance Manager</option>
              <option value="Project Manager">Project Manager</option>
            </select>
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={editUser.email}
              onChange={e => setEditUser({ ...editUser, email: e.target.value })}
              placeholder="Enter Email"
              style={styles.inputField}
              readOnly // Make email read-only to prevent changes
            />
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={editUser.password || ''}
              onChange={e => setEditUser({ ...editUser, password: e.target.value })}
              placeholder="Enter Password"
              style={styles.inputField}
            />
          </div>
          <div style={styles.modalActions}>
            <button onClick={handleUpdateUser} style={styles.updateButton}>Update User</button>
            <button onClick={() => { setShowEditModal(false); setEditUser(null); }} style={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div style={styles.modal}>
          <h3>Delete User</h3>
          <p>Are you sure you want to delete the user:</p>
          <h4>{userToDelete.username}</h4>
          <p>Email: {userToDelete.email}</p>
          <p>Role: {userToDelete.role}</p>
          <div style={styles.modalActions}>
            <button onClick={confirmDeleteUser} style={styles.deleteConfirmButton}>Delete</button>
            <button onClick={() => setShowDeleteModal(false)} style={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  whiteContainer: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    margin: '20px auto',
    maxWidth: '90%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '20px',
    color: 'black',
  },
  addButton: {
    margin: '20px 0',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
    color: 'black',
  },
  userListTitle: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    textAlign: 'center',
    color: 'black',
  },
  userList: {
    backgroundColor: '#4a626e',
    borderRadius: '5px',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ccc',
    cursor: 'default',
  },
  userIcon: {
    fontSize: '2rem',
    marginRight: '10px',
    color: '#4CAF50',
  },
  userDetails: {
    color: 'black',
  },
  username: {
    fontWeight: 'bold',
    margin: 0,
  },
  actions: {
    marginLeft: 'auto',
    display: 'flex',
    gap: '10px',
  },
  editIcon: {
    color: '#4CAF50',
    cursor: 'pointer',
  },
  deleteIcon: {
    color: '#f44336',
    cursor: 'pointer',
  },
  noResults: {
    textAlign: 'center',
    color: 'black',
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    zIndex: 1000,
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    color: 'black',
  },
  inputContainer: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  },
  inputField: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    color: 'black',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteConfirmButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default UserManagement;
