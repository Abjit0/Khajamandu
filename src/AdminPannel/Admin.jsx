import React, { useState } from 'react';

// --- ICONS ---
// Using inline SVGs for icons as they are self-contained and reliable.
const EyeIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l7.293-7.293a1.012 1.012 0 0 1 1.433 0l7.293 7.293c.39.39.39 1.023 0 1.414l-7.293 7.293a1.012 1.012 0 0 1-1.433 0l-7.293-7.293a1.012 1.012 0 0 1 0-.639Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeSlashIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.996 0 1.953-.138 2.863-.401M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const ChartBarIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const ShoppingBagIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
  </svg>
);

const UserGroupIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0-9.094-9.094H7.071m0-2.929A9.095 9.095 0 0 1 12.071 3v2.929m0 0A9.094 9.094 0 0 1 9.094 9.094H7.071m0 0a9.095 9.095 0 0 0-5.004 8.773 9.095 9.095 0 0 0 17.226 0A9.095 9.095 0 0 0 12.071 9.094H7.071m4.004 0a4.5 4.5 0 0 0 0 8.992M12 17.992a4.5 4.5 0 0 0 0-8.992m0 0a4.5 4.5 0 0 0-4.5 4.5m0 0a4.5 4.5 0 0 0 4.5 4.5m0 0a4.5 4.5 0 0 0 4.5-4.5m0 0a4.5 4.5 0 0 0-4.5-4.5" />
  </svg>
);

// --- Reusable Input Component ---
const FormInput = ({ id, label, type, placeholder, value, onChange, icon, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative mt-1">
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
      )}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5`}
      />
      {children}
    </div>
  </div>
);

// --- Login Page Component ---
const Login = ({ onPageChange, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    // In a real app, you'd make an API call here.
    // For this prototype, we'll simulate a successful login.
    console.log('Logging in with:', { email, password });
    onLoginSuccess(); // This will switch the page to the dashboard
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50">
      <div className="mx-auto w-full max-w-md px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-700">Khajamandu</h1>
          <p className="mt-2 text-lg text-gray-600">Admin & Cafe Dashboard</p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-8 shadow rounded-lg">
          <form className="space-y-6" onSubmit={handleLogin}>
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>}
            />
            
            <FormInput
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>}
            >
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
              </button>
            </FormInput>

            {error && (
              <p className="text-center text-sm text-red-600">{error}</p>
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-green-500 to-blue-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <button
            onClick={() => onPageChange('signup')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

// --- Signup Page Component ---
const Signup = ({ onPageChange, onSignupSuccess }) => {
  const [email, setEmail] = useState('');
  const [cafeName, setCafeName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !cafeName || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    // In a real app, you'd make an API call to register the user.
    console.log('Signing up with:', { email, cafeName, password });
    
    // On success, switch to the login page
    onSignupSuccess();
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50">
      <div className="mx-auto w-full max-w-md px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-700">Khajamandu</h1>
          <p className="mt-2 text-lg text-gray-600">Create Your Admin Account</p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-8 shadow rounded-lg">
          <form className="space-y-6" onSubmit={handleSignup}>
            <FormInput
              id="cafeName"
              label="Cafe Name"
              type="text"
              placeholder="e.g., Himalayan Java"
              value={cafeName}
              onChange={(e) => setCafeName(e.target.value)}
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" /></svg>}
            />

            <FormInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>}
            />
            
            <FormInput
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>}
            />

            <FormInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>}
            />

            {error && (
              <p className="text-center text-sm text-red-600">{error}</p>
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-green-500 to-blue-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button
            onClick={() => onPageChange('login')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

// --- Dashboard Page Component ---
const Dashboard = () => {
  const stats = [
    { name: 'Total Revenue', value: 'Rs 405,000', icon: ChartBarIcon, color: 'text-green-600' },
    { name: 'Total Orders', value: '12,580', icon: ShoppingBagIcon, color: 'text-blue-600' },
    { name: 'New Customers', value: '845', icon: UserGroupIcon, color: 'text-indigo-600' },
  ];

  const recentOrders = [
    { id: 'ORD-1254', customer: 'Rohan Shrestha', time: '5 mins ago', total: 'Rs 850', status: 'Pending' },
    { id: 'ORD-1253', customer: 'Anjali Tamang', time: '12 mins ago', total: 'Rs 1,200', status: 'Delivered' },
    { id: 'ORD-1252', customer: 'Bikash Rai', time: '30 mins ago', total: 'Rs 600', status: 'Delivered' },
    { id: 'ORD-1251', customer: 'Sunita Gurung', time: '1 hour ago', total: 'Rs 2,400', status: 'Cancelled' },
    { id: 'ORD-1250', customer: 'Prabin Karki', time: '2 hours ago', total: 'Rs 750', status: 'Delivered' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold text-gray-900">Welcome, Admin!</h1>
      <p className="mt-1 text-gray-600">Here's what's happening with Khajamandu today.</p>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${item.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{item.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
        <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Time</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-col
semibold text-gray-900">Total</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{order.id}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.customer}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.time}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.total}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component (Controls Routing) ---
const App = () => {
  const [page, setPage] = useState('login'); // 'login', 'signup', 'dashboard'

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLoginSuccess = () => {
    setPage('dashboard');
  };
  
  const handleSignupSuccess = () => {
    setPage('login');
  };

  const handleLogout = () => {
    setPage('login');
  };

  // This renders the correct "page" component based on state
  const renderPage = () => {
    switch (page) {
      case 'login':
        return <Login onPageChange={handlePageChange} onLoginSuccess={handleLoginSuccess} />;
      case 'signup':
        return <Signup onPageChange={handlePageChange} onSignupSuccess={handleSignupSuccess} />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Login onPageChange={handlePageChange} onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Show Navbar only when logged in (i.e., on dashboard page) */}
      {page === 'dashboard' && (
        <nav className="bg-gradient-to-r from-green-600 to-blue-700 shadow-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">Khajamandu</span>
                <span className="ml-3 text-sm font-medium text-blue-100">Admin Panel</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      
      {/* Render the current page */}
      <main className={page === 'dashboard' ? 'mx-auto max-w-7xl py-6 sm:px-6 lg:px-8' : ''}>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;