import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center py-3 mt-auto">
            <div className="container">
                <p className="mb-0">&copy; {new Date().getFullYear()} Luigi's Pizzeria. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;