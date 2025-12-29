import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '../../features/menu/menuSlice';
import apiClient from '../../api/api';
import { toast } from 'react-toastify';
import { FaHeart, FaStar, FaTrash, FaTimes } from 'react-icons/fa';
import './AdminPages.css';

const PLACEHOLDER_IMAGE = 'https://placehold.co/400x300?text=No+Image';

const ManageMenu = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.menu);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All Items');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Pizza',
        isAvailable: true
    });
    const [imageFile, setImageFile] = useState(null);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return PLACEHOLDER_IMAGE;
        let cleanPath = imagePath.replace(/\\/g, '/');
        if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;
        if (!cleanPath.startsWith('/public')) cleanPath = `/public${cleanPath}`;
        return `http://localhost:4500${cleanPath}`;
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
            setShowAddModal(false);
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

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All Items' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1>Menu Management</h1>
                    <p className="page-subtitle">Manage your restaurant menu items</p>
                </div>
                <button className="add-btn" onClick={() => setShowAddModal(true)}>
                    + Add New Item
                </button>
            </div>

            {/* Search and Filter */}
            <div className="search-filter-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    className="filter-select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option>All Items</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Burger">Burger</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Salad">Salad</option>
                    <option value="Sides">Sides</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Dessert">Dessert</option>
                </select>
            </div>

            {/* Menu Grid */}
            <div className="menu-grid">
                {filteredItems.map(item => (
                    <div key={item.id} className="menu-card">
                        <div className="menu-card-actions">
                            <button className="icon-btn" style={{ background: 'white' }}>
                                <FaHeart color="#e74c3c" />
                            </button>
                        </div>
                        
                        <img 
                            src={getImageUrl(item.imageUrl)} 
                            alt={item.name}
                            className="menu-card-image"
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                        />
                        
                        <div className="menu-card-content">
                            <div className="menu-card-header">
                                <h3 className="menu-card-title">{item.name}</h3>
                                <span className={`menu-card-category ${item.isAvailable ? '' : 'unavailable'}`}>
                                    {item.isAvailable ? 'Available' : 'Unavailable'}
                                </span>
                            </div>
                            
                            <p className="menu-card-description">
                                {item.description || 'Main Course'}
                            </p>
                            
                            <div className="menu-card-footer">
                                <span className="menu-card-price">${parseFloat(item.price).toFixed(2)}</span>
                                <div className="menu-card-rating">
                                    <FaStar />
                                    <span>4.{Math.floor(Math.random() * 9)} ({Math.floor(Math.random() * 500) + 100})</span>
                                </div>
                            </div>
                            
                            <button 
                                className="action-btn primary"
                                style={{ width: '100%', marginTop: '12px' }}
                                onClick={() => handleDelete(item.id)}
                            >
                                <FaTrash style={{ marginRight: '8px' }} />
                                Delete Item
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#7f8c8d' }}>
                    <p>No menu items found</p>
                </div>
            )}

            {/* Add Item Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '30px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setShowAddModal(false)}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#7f8c8d'
                            }}
                        >
                            <FaTimes />
                        </button>

                        <h2 style={{ marginBottom: '24px', color: '#2c3e50' }}>Add New Menu Item</h2>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="search-input"
                                    placeholder="e.g., Margherita Pizza"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    className="search-input"
                                    placeholder="Describe the item..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    style={{ width: '100%', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        className="search-input"
                                        placeholder="0.00"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        className="filter-select"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        style={{ width: '100%' }}
                                    >
                                        <option value="Pizza">Pizza</option>
                                        <option value="Burger">Burger</option>
                                        <option value="Pasta">Pasta</option>
                                        <option value="Salad">Salad</option>
                                        <option value="Sides">Sides</option>
                                        <option value="Drinks">Drinks</option>
                                        <option value="Dessert">Dessert</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                                    Image
                                </label>
                                <input
                                    type="file"
                                    className="search-input"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="isAvailable"
                                        checked={formData.isAvailable}
                                        onChange={handleInputChange}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontWeight: '600', color: '#2c3e50' }}>Available for order</span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    className="action-btn secondary"
                                    onClick={() => setShowAddModal(false)}
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="action-btn primary"
                                    style={{ flex: 1 }}
                                >
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMenu;
