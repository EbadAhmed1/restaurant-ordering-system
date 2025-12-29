import React, { useEffect, useState } from 'react';
import apiClient from '../../api/api';
import { toast } from 'react-toastify';
import './AdminPages.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await apiClient.get('/admin/users');
                setUsers(res.data);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch users");
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="admin-page">
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1>User Management</h1>
                    <p className="page-subtitle">Manage customer and admin accounts</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-filter-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by username or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Users Table */}
            <div className="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Join Date</th>
                            <th>Orders</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="user-info">
                                            <span className="user-name">{user.username}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge role-${user.role}`}>
                                        {user.role === 'admin' ? 'Admin' : 'Customer'}
                                    </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>{Math.floor(Math.random() * 50)}</td>
                                <td>
                                    <span className="order-status status-delivered">Active</span>
                                </td>
                                <td>
                                    <button className="action-btn secondary">
                                        ⋮
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredUsers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#7f8c8d' }}>
                    <p>No users found</p>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
