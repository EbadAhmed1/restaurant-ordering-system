import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center py-3 mt-auto">
            <div className="container">
                {/* CHANGED: Updated Copyright Name */}
                <p className="mb-0">&copy; {new Date().getFullYear()} OrderHub. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;