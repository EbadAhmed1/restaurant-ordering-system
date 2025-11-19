import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="jumbotron text-center bg-light p-5 mt-4 rounded shadow-sm">
            {/* CHANGED: Updated Title */}
            <h1 className="display-4 text-primary">Welcome to OrderHub!</h1>
            
            {/* CHANGED: Updated Tagline to be generic */}
            <p className="lead">Your favorite meals delivered fast and fresh to your doorstep.</p>
            
            <hr className="my-4" />
            <p>Hungry? Check out our fresh menu and place your order today.</p>
            <Link className="btn btn-primary btn-lg" to="/menu" role="button">
                View Menu
            </Link>
        </div>
    );
};

export default Home;