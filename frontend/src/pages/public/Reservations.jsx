import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReservation, fetchMyReservations } from '../../features/reservations/reservationSlice';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaUsers, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Header from '../../components/navigation/Header';
import './Reservations.css';

const Reservations = () => {
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.reservations);
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(2);
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        dispatch(fetchMyReservations());
    }, [dispatch]);

    // Generate calendar days
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const days = [];
        
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        
        return days;
    };

    const timeSlots = [
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
        '20:00', '20:30', '21:00', '21:30', '22:00'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedTime) {
            toast.error('Please select a time slot');
            return;
        }

        const [hours, minutes] = selectedTime.split(':');
        const reservationDateTime = new Date(selectedDate);
        reservationDateTime.setHours(parseInt(hours), parseInt(minutes), 0);

        const formData = {
            numberOfGuests,
            reservationTime: reservationDateTime.toISOString(),
            notes: specialRequests
        };

        try {
            await dispatch(createReservation(formData)).unwrap();
            toast.success('Reservation created successfully!');
            setSelectedTime('');
            setSpecialRequests('');
        } catch (error) {
            toast.error(error || 'Failed to create reservation');
        }
    };

    const isDateSelected = (date) => {
        if (!date) return false;
        return date.toDateString() === selectedDate.toDateString();
    };

    const isDatePast = (date) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    return (
        <>
            <Header />
            <div className="reservations-page">
                <div className="container">
                    <div className="page-title">
                        <h1>Make a Reservation</h1>
                    </div>

                <div className="reservations-layout">
                    {/* Left Side - Calendar and Time Selection */}
                    <div className="reservation-form-section">
                        {/* Calendar */}
                        <div className="calendar-card">
                            <div className="calendar-header">
                                <FaCalendarAlt className="calendar-icon" />
                                <span>Select Date</span>
                            </div>
                            <div className="calendar-navigation">
                                <button onClick={previousMonth} className="nav-btn">&lt;</button>
                                <span className="month-year">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </span>
                                <button onClick={nextMonth} className="nav-btn">&gt;</button>
                            </div>
                            <div className="calendar-grid">
                                <div className="calendar-weekdays">
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                        <div key={day} className="weekday">{day}</div>
                                    ))}
                                </div>
                                <div className="calendar-days">
                                    {getDaysInMonth(currentMonth).map((date, index) => (
                                        <div
                                            key={index}
                                            className={`calendar-day ${!date ? 'empty' : ''} ${
                                                isDateSelected(date) ? 'selected' : ''
                                            } ${isDatePast(date) ? 'disabled' : ''}`}
                                            onClick={() => date && !isDatePast(date) && setSelectedDate(date)}
                                        >
                                            {date ? date.getDate() : ''}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div className="time-slots-card">
                            <div className="time-slots-header">
                                <FaClock className="time-icon" />
                                <span>Select Time</span>
                            </div>
                            <div className="time-slots-grid">
                                {timeSlots.map(time => (
                                    <button
                                        key={time}
                                        className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                                        onClick={() => setSelectedTime(time)}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Reservation Details Form */}
                        <div className="details-card">
                            <h3>Reservation Details</h3>
                            
                            <div className="form-group">
                                <label>Number of Guests</label>
                                <div className="guest-selector">
                                    <button 
                                        type="button"
                                        onClick={() => setNumberOfGuests(Math.max(1, numberOfGuests - 1))}
                                        className="guest-btn"
                                    >
                                        -
                                    </button>
                                    <span className="guest-count">
                                        <FaUsers /> {numberOfGuests}
                                    </span>
                                    <button 
                                        type="button"
                                        onClick={() => setNumberOfGuests(Math.min(10, numberOfGuests + 1))}
                                        className="guest-btn"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="Enter your phone number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Special Requests (Optional)</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Allergies, dietary restrictions, celebrations, etc."
                                    rows="3"
                                    value={specialRequests}
                                    onChange={(e) => setSpecialRequests(e.target.value)}
                                />
                            </div>

                            <button 
                                className="confirm-btn"
                                onClick={handleSubmit}
                                disabled={status === 'loading' || !selectedTime}
                            >
                                {status === 'loading' ? 'Confirming...' : 'Confirm Reservation'}
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Reservation Summary */}
                    <div className="reservation-summary">
                        <div className="summary-card">
                            <h3>Reservation Summary</h3>
                            
                            <div className="summary-item">
                                <FaCalendarAlt className="summary-icon" />
                                <div>
                                    <div className="summary-label">Date</div>
                                    <div className="summary-value">
                                        {selectedDate.toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="summary-item">
                                <FaClock className="summary-icon" />
                                <div>
                                    <div className="summary-label">Time</div>
                                    <div className="summary-value">
                                        {selectedTime || 'Not selected'}
                                    </div>
                                </div>
                            </div>

                            <div className="summary-item">
                                <FaUsers className="summary-icon" />
                                <div>
                                    <div className="summary-label">Guests</div>
                                    <div className="summary-value">{numberOfGuests} people</div>
                                </div>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="restaurant-info">
                                <h4>Restaurant Info</h4>
                                <div className="info-item">
                                    <FaMapMarkerAlt />
                                    <span>123 Food Street, NY</span>
                                </div>
                                <div className="info-item">
                                    <FaPhone />
                                    <span>(555) 123-4567</span>
                                </div>
                            </div>

                            <div className="cancellation-policy">
                                <h4>Cancellation Policy</h4>
                                <p>Free cancellation up to 2 hours before reservation time.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Reservations;
