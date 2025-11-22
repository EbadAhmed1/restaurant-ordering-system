import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="container py-5">
            <h1 className="mb-4">Admin Dashboard</h1>
            
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <div className="card bg-primary text-white h-100">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <h5 className="card-title">Manage Menu</h5>
                            <p className="card-text">Add, edit, or delete items.</p>
                            <Link to="/admin/manage-menu" className="btn btn-light">Go to Menu</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card bg-success text-white h-100">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <h5 className="card-title">Manage Orders</h5>
                            <p className="card-text">View and update order status.</p>
                            <Link to="/admin/manage-orders" className="btn btn-light">Go to Orders</Link>
                        </div>
                    </div>
                </div>
                 <div className="col-md-4 mb-3">
                    <div className="card bg-info text-white h-100">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center">
                            <h5 className="card-title">User Management</h5>
                            <p className="card-text">View registered users.</p>
                            {/* Placeholder for future user management page */}
                            <button className="btn btn-light disabled">Coming Soon</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <hr />
            {/* This Outlet renders the child routes like ManageMenu or ManageOrders if nested */}
            <Outlet />
        </div>
    );
};

export default AdminDashboard;