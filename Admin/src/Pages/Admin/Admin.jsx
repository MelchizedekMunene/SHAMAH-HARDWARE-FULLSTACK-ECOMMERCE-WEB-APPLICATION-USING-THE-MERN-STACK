import React, { useState } from 'react'
import './Admin.css'
import AdminSidebar from '../../Components/AdminSidebar/AdminSidebar'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import UsersList from '../../Components/UsersList/UsersList'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('add-product');

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'add-product':
        return <AddProduct />;
      case 'users':
        return <UsersList />;
      case 'inventory':
        return <ListProduct />;
      default:
        return <ListProduct />;
    }
  }

  return (
    <div className='admin'>
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className='admin-content'>
        {renderContent()}
      </div>
    </div>
  )
}

// Simple Dashboard Component
const Dashboard = () => (
  <div className='admin-dashboard'>
    <h1>Dashboard</h1>
    <div className='dashboard-grid'>
      <div className='dashboard-card'>
        <h3>Total Products</h3>
        <p>Loading...</p>
      </div>
      <div className='dashboard-card'>
        <h3>Total Users</h3>
        <p>Loading...</p>
      </div>
      <div className='dashboard-card'>
        <h3>Low Stock Items</h3>
        <p>Loading...</p>
      </div>
      <div className='dashboard-card'>
        <h3>System Status</h3>
        <p style={{color: '#0ed31e'}}>● Online</p>
      </div>
    </div>
  </div>
);

export default Admin

