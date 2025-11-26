import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReservations, updateReservationStatus } from '../../features/reservations/reservationSlice';
import { toast } from 'react-toastify';

const ManageReservations = () => {
    const dispatch = useDispatch();
    const { reservations, status } = useSelector((state) => state.reservations);

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

    if (status === 'loading') {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="mb-4">Manage Reservations</h2>
            
            <div className="card shadow-sm">
                <div className="card-body">
                    {reservations.length === 0 ? (
                        <p className="text-muted text-center py-4">No reservations found</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Guests</th>
                                        <th>Date & Time</th>
                                        <th>Notes</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.map(reservation => (
                                        <tr key={reservation.id}>
                                            <td>#{reservation.id}</td>
                                            <td>
                                                <div>
                                                    <div className="fw-bold">{reservation.User?.username}</div>
                                                    <small className="text-muted">{reservation.User?.email}</small>
                                                </div>
                                            </td>
                                            <td>{reservation.numberOfGuests}</td>
                                            <td>{new Date(reservation.reservationTime).toLocaleString()}</td>
                                            <td>
                                                {reservation.notes ? (
                                                    <small className="text-muted">{reservation.notes}</small>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`badge ${
                                                    reservation.status === 'Confirmed' ? 'bg-success' :
                                                    reservation.status === 'Seated' ? 'bg-info' :
                                                    'bg-secondary'
                                                }`}>
                                                    {reservation.status}
                                                </span>
                                            </td>
                                            <td>
                                                {reservation.status === 'Confirmed' && (
                                                    <>
                                                        <button 
                                                            className="btn btn-sm btn-info me-2"
                                                            onClick={() => handleStatusChange(reservation.id, 'Seated')}
                                                        >
                                                            Mark Seated
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleStatusChange(reservation.id, 'Cancelled')}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {reservation.status === 'Seated' && (
                                                    <span className="text-muted">No actions available</span>
                                                )}
                                                {reservation.status === 'Cancelled' && (
                                                    <span className="text-muted">Cancelled</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageReservations;
