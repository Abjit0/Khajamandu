import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [preOrders, setPreOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/otp/login`, {
        email,
        password
      });

      if (response.data.status === 'SUCCESS') {
        const userData = response.data.data.user;
        
        if (userData.role !== 'admin') {
          setLoginError('Access denied. Admin account required.');
          setLoading(false);
          return;
        }

        localStorage.setItem('adminToken', response.data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        setToken(response.data.data.token);
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setToken(null);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === 'dashboard') {
        const statsRes = await axios.get(`${API_URL}/admin/stats`, { headers });
        setStats(statsRes.data.data);
        const ordersRes = await axios.get(`${API_URL}/admin/orders?limit=5`, { headers });
        setRecentOrders(ordersRes.data.data);
      } else if (activeTab === 'preorders') {
        const preRes = await axios.get(`${API_URL}/orders/preorders/list`, { headers });
        setPreOrders(preRes.data.data || []);
      } else if (activeTab === 'pending') {
        const pendingRes = await axios.get(`${API_URL}/admin/pending`, { headers });
        setPendingUsers(pendingRes.data.data);
      } else if (activeTab === 'users') {
        const usersRes = await axios.get(`${API_URL}/admin/users`, { headers });
        setAllUsers(usersRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
    setLoading(false);
  };

  const handleApprove = async (userId) => {
    if (!window.confirm('Approve this user?')) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${API_URL}/admin/approve/${userId}`, {}, { headers });
      alert('User approved successfully!');
      fetchDashboardData();
    } catch (error) {
      alert('Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Reject and delete this user? This cannot be undone.')) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_URL}/admin/reject/${userId}`, { headers });
      alert('User rejected and removed');
      fetchDashboardData();
    } catch (error) {
      alert('Failed to reject user');
    }
  };

  // Login Screen
  if (!token) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>🍽️ Khajamandu Admin</h1>
          <p>Admin Dashboard Login</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {loginError && <div className="error">{loginError}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h2>🍽️ Khajamandu</h2>
        <nav>
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>
            ⏳ Pending Approvals
            {pendingUsers.length > 0 && <span className="badge">{pendingUsers.length}</span>}
          </button>
          <button className={activeTab === 'preorders' ? 'active' : ''} onClick={() => setActiveTab('preorders')}>
            📅 Pre-Orders
            {preOrders.length > 0 && <span className="badge">{preOrders.length}</span>}
          </button>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            👥 All Users
          </button>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </nav>
      </div>

      <div className="main-content">
        {loading && <div className="loading">Loading...</div>}

        {activeTab === 'dashboard' && stats && (
          <div>
            <h1>Dashboard Overview</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Restaurants</h3>
                <p className="stat-number">{stats.totalRestaurants}</p>
              </div>
              <div className="stat-card">
                <h3>Riders</h3>
                <p className="stat-number">{stats.totalRiders}</p>
              </div>
              <div className="stat-card">
                <h3>Customers</h3>
                <p className="stat-number">{stats.totalCustomers}</p>
              </div>
              <div className="stat-card warning">
                <h3>Pending Approvals</h3>
                <p className="stat-number">{stats.pendingApprovals}</p>
              </div>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p className="stat-number">{stats.totalOrders}</p>
              </div>
              <div className="stat-card success">
                <h3>Total Revenue</h3>
                <p className="stat-number">Rs {stats.totalRevenue.toLocaleString('en-NP', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="stat-card">
                <h3>Today's Orders</h3>
                <p className="stat-number">{stats.todayOrders}</p>
              </div>
            </div>

            <h2>Recent Orders</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>{order.customerName || 'Guest'}</td>
                    <td>Rs {order.totalAmount}</td>
                    <td><span className={`status ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'preorders' && (
          <div>
            <h1>Pre-Orders ({preOrders.length})</h1>
            {preOrders.length === 0 ? (
              <p className="empty-state">No upcoming pre-orders</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Restaurant</th>
                    <th>Scheduled Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preOrders.map(order => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6)}</td>
                      <td>{order.customerName || 'Guest'}</td>
                      <td>{order.restaurantName || order.restaurantId}</td>
                      <td>{new Date(order.scheduledTime).toLocaleString([], {
                        weekday: 'short', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}</td>
                      <td>Rs {order.totalAmount}</td>
                      <td>
                        <span className={`status ${order.orderStatus.toLowerCase()}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'pending' && (
          <div>
            <h1>Pending Approvals ({pendingUsers.length})</h1>
            {pendingUsers.length === 0 ? (
              <p className="empty-state">No pending approvals</p>
            ) : (
              <div className="users-grid">
                {pendingUsers.map(user => (
                  <div key={user._id} className="user-card">
                    <div className="user-header">
                      <h3>{user.profile?.name || 'No Name'}</h3>
                      <span className={`role-badge ${user.role}`}>{user.role}</span>
                    </div>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.profile?.phone || 'N/A'}</p>
                    {user.role === 'restaurant' && (
                      <>
                        <p><strong>Restaurant:</strong> {user.profile?.restaurantName}</p>
                        <p><strong>Cuisine:</strong> {user.profile?.cuisine}</p>
                        <p><strong>Address:</strong> {user.profile?.restaurantAddress}</p>
                      </>
                    )}
                    {user.role === 'rider' && (
                      <>
                        <p><strong>Vehicle:</strong> {user.profile?.vehicleType}</p>
                        <p><strong>License:</strong> {user.profile?.licenseNumber}</p>
                      </>
                    )}
                    <p><strong>Registered:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    <div className="user-actions">
                      <button className="approve-btn" onClick={() => handleApprove(user._id)}>
                        ✅ Approve
                      </button>
                      <button className="reject-btn" onClick={() => handleReject(user._id)}>
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h1>All Users ({allUsers.length})</h1>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map(user => (
                  <tr key={user._id}>
                    <td>{user.profile?.name || 'No Name'}</td>
                    <td>{user.email}</td>
                    <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                    <td>
                      <span className={`status ${user.isApproved ? 'approved' : 'pending'}`}>
                        {user.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
