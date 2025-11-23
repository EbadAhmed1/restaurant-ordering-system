import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '../../features/menu/menuSlice';
import apiClient from '../../api/api'; // Direct API call for Admin actions (or create a thunk)
import { toast } from 'react-toastify';

const ManageMenu = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.menu);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Pizza',
        isAvailable: true
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        dispatch(fetchMenu());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Use FormData for file upload
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('isAvailable', formData.isAvailable);
        if (imageFile) {
            data.append('imageUrl', imageFile); // Matches backend 'uploadSingleImage("imageUrl")'
        }

        try {
            await apiClient.post('/menu', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Menu Item Added Successfully!');
            dispatch(fetchMenu()); // Refresh list
            // Reset form
            setFormData({ name: '', description: '', price: '', category: 'Pizza', isAvailable: true });
            setImageFile(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add item');
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this item?")) {
            try {
                await apiClient.delete(`/menu/${id}`);
                toast.success("Item deleted");
                dispatch(fetchMenu());
            } catch (error) {
                toast.error("Failed to delete item");
            }
        }
    }

    return (
        <div className="container py-5">
            <h2>Manage Menu</h2>
            
            {/* Add Item Form */}
            <div className="card mb-5 p-4 shadow-sm">
                <h4>Add New Item</h4>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <input type="text" className="form-control" name="name" placeholder="Item Name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <input type="number" className="form-control" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-12 mb-3">
                            <textarea className="form-control" name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <select className="form-control" name="category" value={formData.category} onChange={handleInputChange}>
                                <option value="Pizza">Pizza</option>
                                <option value="Pasta">Pasta</option>
                                <option value="Drinks">Drinks</option>
                                <option value="Dessert">Dessert</option>
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <input type="file" className="form-control" onChange={handleFileChange} />
                        </div>
                        <div className="col-md-12 mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="avail" name="isAvailable" checked={formData.isAvailable} onChange={handleInputChange} />
                            <label className="form-check-label" htmlFor="avail">Available?</label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success">Add Item</button>
                </form>
            </div>

            {/* Items List */}
            <h4>Current Menu Items</h4>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>€{item.price}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageMenu;