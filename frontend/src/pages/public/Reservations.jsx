import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReservation, fetchMyReservations, cancelReservation } from '../../features/reservations/reservationSlice';
import { toast } from 'react-toastify';

const Reservations = () => {
    const dispatch = useDispatch();
    const { reservations, status } = useSelector((state) => state.reservations);
    const [formData, setFormData] = useState({
        numberOfGuests: 2,
        reservationTime: '',
        notes: ''
    });

    useEffect(() => {
        dispatch(fetchMyReservations());
    }, [dispatch]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createReservation(formData)).unwrap();
            toast.success('Reservation created successfully!');
            setFormData({ numberOfGuests: 2, reservationTime: '', notes: '' });
        } catch (error) {
            toast.error(error || 'Failed to create reservation');
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm('Cancel this reservation?')) {
            try {
                await dispatch(cancelReservation(id)).unwrap();
                toast.success('Reservation cancelled');
            } catch (error) {
                toast.error('Failed to cancel reservation');
            }
        }
    };

    const getMinDateTime = () => {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Table Reservations</h2>
            
            <div className="row">
                <div className="col-md-5">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Make a Reservation</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label className="form-label">Number of Guests</label>
                                    <select 
                                        className="form-select" 
                                        name="numberOfGuests"
                                        value={formData.numberOfGuests}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-group mb-3">
                                    <label className="form-label">Date & Time</label>
                                    <input 
                                        type="datetime-local" 
                                        className="form-control"
                                        name="reservationTime"
                                        value={formData.reservationTime}
                                        onChange={handleInputChange}
                                        min={getMinDateTime()}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group mb-4">
                                    <label className="form-label">Special Requests (Optional)</label>
                                    <textarea 
                                        className="form-control" 
                                        name="notes"
                                        rows="3"
                                        placeholder="Any dietary restrictions or special occasions?"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100"
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? 'Creating...' : 'Reserve Table'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-7">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-4">My Reservations</h5>
                            
                            {reservations.length === 0 ? (
                                <p className="text-muted text-center py-4">No reservations yet</p>
                            ) : (
                                <div className="list-group">
                                    {reservations.map(reservation => (
                                        <div key={reservation.id} className="list-group-item">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className="mb-1">
                                                        <i className="fa-solid fa-users me-2"></i>
                                                        {reservation.numberOfGuests} {reservation.numberOfGuests === 1 ? 'Guest' : 'Guests'}
                                                    </h6>
                                                    <p className="mb-1">
                                                        <i className="fa-solid fa-calendar me-2"></i>
                                                        {new Date(reservation.reservationTime).toLocaleString()}
                                                    </p>
                                                    {reservation.notes && (
                                                        <p className="mb-1 small text-muted">
                                                            <i className="fa-solid fa-note-sticky me-2"></i>
                                                            {reservation.notes}
                                                        </p>
                                                    )}
                                                    <span className={`badge ${
                                                        reservation.status === 'Confirmed' ? 'bg-success' :
                                                        reservation.status === 'Seated' ? 'bg-info' :
                                                        'bg-secondary'
                                                    }`}>
                                                        {reservation.status}
                                                    </span>
                                                </div>
                                                {reservation.status === 'Confirmed' && (
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleCancel(reservation.id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reservations;
