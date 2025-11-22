import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '../../features/menu/menuSlice';
// CRITICAL: Ensure this path matches where you created the file above
import MenuItemCard from '../../features/menu/MenuItemCard';

const Menu = () => {
    const dispatch = useDispatch();
    const { items, status, error } = useSelector((state) => state.menu);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchMenu());
        }
    }, [status, dispatch]);

    let content;

    if (status === 'loading') {
        content = (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    } else if (status === 'failed') {
        content = <div className="alert alert-danger mt-5">Error: {error}</div>;
    } else if (status === 'succeeded') {
        if (items.length > 0) {
            content = (
                <div className="row">
                    {items.map(item => (
                        <MenuItemCard key={item.id} item={item} />
                    ))}
                </div>
            );
        } else {
            content = <div className="text-center mt-5"><h4>No items found in the menu.</h4></div>;
        }
    }

    return (
        <div className="container py-5">
            <h1 className="text-center mb-5 display-4">Our Menu</h1>
            {content}
        </div>
    );
};

export default Menu; // CRITICAL: Must be default export