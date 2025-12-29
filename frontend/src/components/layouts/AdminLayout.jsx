import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from '../navigation/Header';
import { 
    FaUtensils, FaTachometerAlt, FaConciergeBell, 
    FaShoppingBag, FaCalendarAlt, FaUsers
} from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/admin/manage-menu', icon: <FaConciergeBell />, label: 'Menu Management' },
        { path: '/admin/manage-orders', icon: <FaShoppingBag />, label: 'Orders' },
        { path: '/admin/manage-reservations', icon: <FaCalendarAlt />, label: 'Reservations' },
        { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
    ];

    return (
        <div className="admin-layout-wrapper">
            <Header />
            <div className="admin-layout">
                {/* Sidebar */}
                <aside className="admin-sidebar">
                    <div className="sidebar-header">
                        <div className="logo">
                            <FaUtensils className="logo-icon" />
                            <span className="logo-text">Admin Panel</span>
                        </div>
                    </div>

                    <nav className="sidebar-nav">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <Link to="/" className="nav-item">
                            <span className="nav-icon">←</span>
                            <span className="nav-label">Back to Site</span>
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="admin-main">
                    {/* Page Content */}
                    <main className="admin-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
