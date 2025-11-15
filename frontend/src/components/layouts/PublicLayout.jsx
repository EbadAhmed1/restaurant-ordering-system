import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../navigation/Header';
import Footer from '../navigation/Footer'; // will create this later

const PublicLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="container-fluid flex-grow-1 mt-5 pt-3">
                <Outlet /> {/* Renders the current child route component (Home, Menu, etc.) */}
            </main>
            {/* <Footer /> */} 
        </div>
    );
};

export default PublicLayout;