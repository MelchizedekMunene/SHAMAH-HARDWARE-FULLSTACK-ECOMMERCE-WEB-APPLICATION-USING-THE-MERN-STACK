import React from 'react';
import './AdminSidebar.css';

const AdminSidebar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'add-product', label: 'Add Product', icon: '➕' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'inventory', label: 'Inventory', icon: '📈' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h1>SHAMAH ADMIN</h1>
      </div>
      <nav className="sidebar-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>v1.0 - Admin Panel</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
