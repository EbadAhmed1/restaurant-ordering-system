import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReservations, updateReservationStatus } from '../../features/reservations/reservationSlice';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaPhone, FaClock } from 'react-icons/fa';
import './AdminPages.css';

const ManageReservations = () => {
    const dispatch = useDispatch();
    const { reservations, status } = useSelector((state) => state.reservations);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        dispatch(fetchAllReservations());
    }, [dispatch]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await dispatch(updateReservationStatus({ id, status: newStatus })).unwrap();
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredReservations = reservations.filter(reservation => {
        const matchesStatus = filterStatus === 'All' || reservation.status === filterStatus;
        return matchesStatus;
    });

    const statusTabs = ['All', 'Pending', 'Confirmed', 'Seated', 'Completed', 'Cancelled'];

    if (status === 'loading') {
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
                    <h1>Reservations Management</h1>
                    <p className="page-subtitle">Manage table reservations</p>
                </div>
            </div>

            {/* Date Picker and Status Filter */}
            <div style={{ 
                display: 'flex', 
                gap: '16px', 
                marginBottom: '24px',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FaCalendarAlt color="#7f8c8d" />
                    <input
                        type="date"
                        className="filter-select"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Status Tabs */}
            <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginBottom: '24px',
                borderBottom: '2px solid #ecf0f1',
                paddingBottom: '0',
                flexWrap: 'wrap'
            }}>
                {statusTabs.map(statusTab => (
                    <button
                        key={statusTab}
                        onClick={() => setFilterStatus(statusTab)}
                        style={{
                            padding: '12px 24px',
                            background: 'none',
                            border: 'none',
                            borderBottom: filterStatus === statusTab ? '3px solid #e74c3c' : '3px solid transparent',
                            color: filterStatus === statusTab ? '#e74c3c' : '#7f8c8d',
                            fontWeight: filterStatus === statusTab ? '700' : '500',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {statusTab}
                    </button>
                ))}
            </div>

            {/* Reservations List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredReservations.map(reservation => (
                    <div key={reservation.id} style={{
                        background: reservation.notes ? '#fff9e6' : 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        borderLeft: reservation.notes ? '4px solid #f39c12' : 'none'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <FaClock color="#7f8c8d" />
                                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#2c3e50' }}>
                                        {new Date(reservation.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span style={{ fontSize: '14px', color: '#7f8c8d' }}>
                                        • {reservation.numberOfGuests} guests
                                    </span>
                                </div>
                                
                                <div style={{ marginBottom: '8px' }}>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#2c3e50' }}>
                                        <strong>Customer:</strong> {reservation.User?.username || 'John Doe'}
                                    </p>
                                    <p style={{ margin: '0', fontSize: '14px', color: '#7f8c8d', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaPhone size={12} />
                                        {reservation.User?.email || '(555) 123-4567'}
                                    </p>
                                </div>

                                {reservation.notes && (
                                    <div style={{
                                        marginTop: '12px',
                                        padding: '12px',
                                        background: 'white',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        color: '#2c3e50'
                                    }}>
                                        <strong>Special Requests:</strong> {reservation.notes}
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ textAlign: 'right' }}>
                                <span className={`order-status status-${reservation.status.toLowerCase()}`}>
                                    {reservation.status}
                                </span>
                                <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: '#7f8c8d' }}>
                                    {new Date(reservation.reservationTime).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {reservation.status === 'Confirmed' && (
                            <div style={{ 
                                marginTop: '16px', 
                                paddingTop: '16px', 
                                borderTop: '1px solid #ecf0f1',
                                display: 'flex',
                                gap: '12px'
                            }}>
                                <button 
                                    className="action-btn secondary"
                                    onClick={() => handleStatusChange(reservation.id, 'Cancelled')}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="action-btn primary"
                                    onClick={() => handleStatusChange(reservation.id, 'Seated')}
                                    style={{ marginLeft: 'auto' }}
                                >
                                    Mark as Seated
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredReservations.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#7f8c8d' }}>
                    <p>No reservations found</p>
                </div>
            )}
        </div>
    );
};

export default ManageReservations;
