import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '../../features/menu/menuSlice';
import apiClient from '../../api/api';
import { toast } from 'react-toastify';

// Fallback image
const PLACEHOLDER_IMAGE = 'https://placehold.co/100x100?text=No+Image';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All Categories');

    // Helper for images
    const getImageUrl = (imagePath) => {
        if (!imagePath) return PLACEHOLDER_IMAGE;
        let cleanPath = imagePath.replace(/\\/g, '/');
        if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;
        if (!cleanPath.startsWith('/public')) cleanPath = `/public${cleanPath}`;
        return `http://localhost:5000${cleanPath}`;
    };

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
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('isAvailable', formData.isAvailable);
        if (imageFile) data.append('imageUrl', imageFile);

        try {
            await apiClient.post('/menu', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Item Added Successfully');
            dispatch(fetchMenu());
            setFormData({ name: '', description: '', price: '', category: 'Pizza', isAvailable: true });
            setImageFile(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add item');
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this item?")) {
            try {
                await apiClient.delete(`/menu/${id}`);
                toast.success("Item deleted");
                dispatch(fetchMenu());
            } catch (error) {
                toast.error("Failed to delete");
            }
        }
    };

    // Filter Logic
    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All Categories' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container py-5">
            
            <h2 className="mb-4 fw-bold text-dark">Manage Menu</h2>
            {/* --- SECTION 1: ADD NEW ITEM --- */}
            <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                    <h4 className="mb-4 fw-bold text-dark">Add New Item</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">Item Name</label>
                                <input type="text" className="form-control" name="name" placeholder="Item Name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">Price (€)</label>
                                <div className="input-group">
                                    <span className="input-group-text">€</span>
                                    <input type="number" className="form-control" name="price" placeholder="0.00" value={formData.price} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="form-label text-muted small fw-bold">Description</label>
                                <textarea className="form-control" name="description" rows="3" placeholder="Description" value={formData.description} onChange={handleInputChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">Category</label>
                                <select className="form-select" name="category" value={formData.category} onChange={handleInputChange}>
                                    <option value="Pizza">Pizza</option>
                                    <option value="Burger">Burger</option>
                                    <option value="Pasta">Pasta</option>
                                    <option value="Salad">Salad</option>
                                    <option value="Sides">Sides</option>
                                    <option value="Drinks">Drinks</option>
                                    <option value="Dessert">Dessert</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">Image</label>
                                <input type="file" className="form-control" onChange={handleFileChange} />
                            </div>
                            <div className="col-12 mt-3">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="avail" name="isAvailable" checked={formData.isAvailable} onChange={handleInputChange} />
                                    <label className="form-check-label" htmlFor="avail">Available?</label>
                                </div>
                            </div>
                            <div className="col-12 mt-4">
                                <button type="submit" className="btn btn-success px-4 fw-bold">
                                    <i className="fa-solid fa-plus me-2"></i> Add Item
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* --- SECTION 2: CURRENT ITEMS LIST --- */}
            <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                    <h4 className="mb-4 fw-bold text-dark">Current Menu Items</h4>
                    
                    {/* Search and Filter Bar */}
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0"><i className="fa-solid fa-search text-muted"></i></span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0 ps-0" 
                                    placeholder="Search menu items..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select 
                                className="form-select" 
                                value={filterCategory} 
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <option>All Categories</option>
                                <option value="Pizza">Pizza</option>
                                <option value="Burger">Burger</option>
                                <option value="Pasta">Pasta</option>
                                <option value="Salad">Salad</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-3 ps-3 text-muted" style={{width: '100px'}}>Image</th>
                                    <th className="py-3 text-muted">Name</th>
                                    <th className="py-3 text-muted text-center">Category</th>
                                    <th className="py-3 text-muted text-end">Price</th>
                                    <th className="py-3 text-muted text-end pe-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map(item => (
                                    <tr key={item.id}>
                                        <td className="ps-3">
                                            <img 
                                                src={getImageUrl(item.imageUrl)} 
                                                alt={item.name} 
                                                className="rounded"
                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                referrerPolicy="no-referrer"
                                                crossOrigin="anonymous"
                                            />
                                        </td>
                                        <td className="fw-bold text-dark">{item.name}</td>
                                        <td className="text-center">
                                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="text-end fw-bold">€{parseFloat(item.price).toFixed(2)}</td>
                                        <td className="text-end pe-4">
                                            <button 
                                                className="btn btn-danger btn-sm px-3" 
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <i className="fa-solid fa-trash-can me-1"></i> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredItems.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">No items found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageMenu;