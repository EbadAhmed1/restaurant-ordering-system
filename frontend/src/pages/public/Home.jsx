import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="jumbotron text-center bg-light p-5 mt-4 rounded shadow-sm">
            <h1 className="display-4 text-primary">Welcome to Luigi's Pizzeria!</h1>
            <p className="lead">Authentic Italian flavors delivered straight to your door.</p>
            <hr className="my-4" />
            <p>Hungry? Check out our fresh menu and place your order today.</p>
            <Link className="btn btn-primary btn-lg" to="/menu" role="button">
                View Menu
            </Link>
        </div>
    );
};

export default Home; 