import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        // CHANGED: Removed 'align-items-center', added 'align-items-start' and 'pt-5' to move content up
        <div className="container-fluid position-relative d-flex align-items-start justify-content-center bg-white" style={{ minHeight: '90vh', overflow: 'hidden', paddingTop: '8rem' }}>
            
            {/* --- Decorative Background Icons (Watermarks) --- */}
            <div className="position-absolute text-primary" style={{ top: '15%', left: '10%', opacity: 0.05, fontSize: '6rem', transform: 'rotate(-15deg)' }}>
                <i className="fa-solid fa-pizza-slice"></i>
            </div>
            <div className="position-absolute text-info" style={{ top: '20%', right: '15%', opacity: 0.05, fontSize: '7rem' }}>
                <i className="fa-solid fa-mug-hot"></i>
            </div>
            <div className="position-absolute text-secondary" style={{ bottom: '10%', left: '15%', opacity: 0.05, fontSize: '5rem', transform: 'rotate(15deg)' }}>
                <i className="fa-solid fa-utensils"></i>
            </div>
            <div className="position-absolute text-success" style={{ bottom: '15%', right: '10%', opacity: 0.05, fontSize: '6rem' }}>
                <i className="fa-solid fa-bowl-food"></i>
            </div>

            {/* --- Main Center Content --- */}
            <div className="text-center position-relative fade-in-up" style={{ zIndex: 10, maxWidth: '700px' }}>
                {/* Title */}
                <h1 className="display-3 fw-bold text-primary mb-3">
                    Welcome to OrderHub!
                </h1>
                
                {/* Subtitle */}
                <p className="lead text-secondary mb-5" style={{ fontSize: '1.25rem' }}>
                    Your favorite meals delivered fast and fresh to your doorstep.
                </p>
                
                {/* Divider Line */}
                <hr className="my-5 mx-auto" style={{ width: '60%', opacity: 0.1 }} />
                
                {/* Call to Action Text */}
                <p className="text-muted mb-4">
                    Hungry? Check out our fresh menu and place your order today.
                </p>
                
                {/* Button */}
                <Link 
                    to="/menu" 
                    className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow fw-bold"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    View Menu
                </Link>
            </div>
        </div>
    );
};

export default Home;