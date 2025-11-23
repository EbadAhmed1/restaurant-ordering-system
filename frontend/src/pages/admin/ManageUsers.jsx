import React, { useEffect, useState } from 'react';
import apiClient from '../../api/api';
import { toast } from 'react-toastify';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch users from the backend
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

    if (loading) return <div className="container py-5">Loading Users...</div>;

    return (
        <div className="container py-5">
            <h2 className="mb-4">User Management</h2>
            
            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-3 ps-4">ID</th>
                                    <th className="py-3">Username</th>
                                    <th className="py-3">Email</th>
                                    <th className="py-3">Role</th>
                                    <th className="py-3">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} style={{ verticalAlign: 'middle' }}>
                                        <td className="ps-4">#{user.id}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '35px', height: '35px' }}>
                                                    <i className="fa-regular fa-user text-secondary"></i>
                                                </div>
                                                <span className="fw-bold">{user.username}</span>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge rounded-pill ${user.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;