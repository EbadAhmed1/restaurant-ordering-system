import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container-fluid position-relative d-flex align-items-center justify-content-center bg-white" style={{ minHeight: '85vh', overflow: 'hidden' }}>
            
            {/* --- Decorative Background Icons (Watermarks) --- */}
            <div className="position-absolute text-primary" style={{ top: '10%', left: '10%', opacity: 0.05, fontSize: '6rem', transform: 'rotate(-15deg)' }}>
                <i className="fa fa-pizza-slice"></i>
            </div>
            <div className="position-absolute text-info" style={{ top: '15%', right: '15%', opacity: 0.05, fontSize: '7rem' }}>
                <i className="fa fa-coffee"></i>
            </div>
            <div className="position-absolute text-secondary" style={{ bottom: '10%', left: '15%', opacity: 0.05, fontSize: '5rem', transform: 'rotate(15deg)' }}>
                <i className="fa fa-cutlery"></i>
            </div>
            <div className="position-absolute text-success" style={{ bottom: '15%', right: '10%', opacity: 0.05, fontSize: '6rem' }}>
                <i className="fa fa-leaf"></i>
            </div>

            {/* --- Main Center Content --- */}
            <div className="text-center position-relative" style={{ zIndex: 10, maxWidth: '700px' }}>
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
                    className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-sm fw-bold"
                    style={{ transition: 'transform 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    View Menu
                </Link>
            </div>
        </div>
    );
};

export default Home;