import React, { useEffect, useMemo, useRef, useState } from 'react';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const App: React.FC = () => {
  const [screen, setScreen] = useState<'login' | 'admin' | 'app'>('login');
  const [activePage, setActivePage] = useState<'dashboard' | 'inventory' | 'orders' | 'customers' | 'analytics' | 'settings'>(
    'dashboard'
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [businessName, setBusinessName] = useState('Nexus Mart');
  const [clients, setClients] = useState([
    { name: 'Raj Electronics', email: 'raj@electronics.com', plan: 'Monthly', id: 'raj-electronics-8k3z' },
    { name: 'Metro Superstore', email: 'ops@metrostore.in', plan: 'One-time', id: 'metro-superstore-4f7q' },
  ]);
  const [inventory, setInventory] = useState([
    {
      id: 'inv-1',
      name: 'Wireless Keyboard',
      sku: 'KB-102',
      category: 'Accessories',
      quantity: 28,
      costPrice: 850,
      sellingPrice: 1299,
      supplier: 'Nexus Imports',
      minStockAlert: 10,
    },
    {
      id: 'inv-2',
      name: 'Smart LED Bulb',
      sku: 'LB-230',
      category: 'Lighting',
      quantity: 12,
      costPrice: 220,
      sellingPrice: 399,
      supplier: 'Glow Electric',
      minStockAlert: 15,
    },
    {
      id: 'inv-3',
      name: 'Bluetooth Speaker',
      sku: 'SP-410',
      category: 'Audio',
      quantity: 5,
      costPrice: 1350,
      sellingPrice: 1999,
      supplier: 'Soundify',
      minStockAlert: 8,
    },
  ]);
  const [customers, setCustomers] = useState([
    {
      id: 'cust-1',
      name: 'Aditi Sharma',
      phone: '+91 98765 43210',
      email: 'aditi@domain.com',
      address: 'Delhi NCR',
      totalSpent: 18500,
      orderCount: 6,
    },
    {
      id: 'cust-2',
      name: 'Rahul Mehta',
      phone: '+91 91234 56789',
      email: 'rahul@domain.com',
      address: 'Mumbai',
      totalSpent: 24100,
      orderCount: 9,
    },
  ]);
  const [orderItems, setOrderItems] = useState([
    { id: 'inv-1', name: 'Wireless Keyboard', qty: 1, price: 1299, cost: 850 },
  ]);
  const [orderMeta, setOrderMeta] = useState({ taxRate: 12, discount: 0, paymentMethod: 'Cash' });
  const [salesFilter, setSalesFilter] = useState('7');
  const [settings, setSettings] = useState({ taxRate: 12, currency: 'INR', categoryTags: 'Accessories,Lighting,Audio' });

  const salesChartRef = useRef<HTMLCanvasElement | null>(null);
  const analyticsChartRef = useRef<HTMLCanvasElement | null>(null);
  const salesChartInstance = useRef<any | null>(null);
  const analyticsChartInstance = useRef<any | null>(null);

  const inventoryValue = useMemo(
    () => inventory.reduce((sum, item) => sum + item.quantity * item.costPrice, 0),
    [inventory]
  );

  const lowStockCount = useMemo(
    () => inventory.filter(item => item.quantity <= item.minStockAlert).length,
    [inventory]
  );

  const subtotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.qty * item.price, 0),
    [orderItems]
  );

  const totalCost = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.qty * item.cost, 0),
    [orderItems]
  );

  const taxAmount = useMemo(() => (subtotal * orderMeta.taxRate) / 100, [subtotal, orderMeta.taxRate]);
  const total = useMemo(() => subtotal + taxAmount - orderMeta.discount, [subtotal, taxAmount, orderMeta.discount]);

  const orders = useMemo(
    () => [
      {
        id: 'ORD-1001',
        customer: 'Aditi Sharma',
        total: 2598,
        status: 'Completed',
        date: '2024-07-09',
      },
      {
        id: 'ORD-1002',
        customer: 'Rahul Mehta',
        total: 1999,
        status: 'Pending',
        date: '2024-07-10',
      },
      {
        id: 'ORD-1003',
        customer: 'Walk-in',
        total: 399,
        status: 'Cancelled',
        date: '2024-07-10',
      },
    ],
    []
  );

  useEffect(() => {
    if (!salesChartRef.current) return;
    const Chart = (window as any).Chart;
    if (!Chart) return;
    if (salesChartInstance.current) {
      salesChartInstance.current.destroy();
    }
    salesChartInstance.current = new Chart(salesChartRef.current, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Sales',
            data: [12000, 14500, 9800, 17500, 21000, 18600, 24500],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102,126,234,0.2)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        },
      },
    });
  }, []);

  useEffect(() => {
    if (!analyticsChartRef.current) return;
    const Chart = (window as any).Chart;
    if (!Chart) return;
    if (analyticsChartInstance.current) {
      analyticsChartInstance.current.destroy();
    }
    analyticsChartInstance.current = new Chart(analyticsChartRef.current, {
      type: 'bar',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [
          {
            label: 'Revenue',
            data: [240000, 210000, 260000, 280000, 300000, 350000],
            backgroundColor: 'rgba(16,185,129,0.5)',
            borderRadius: 8,
          },
          {
            label: 'Cost',
            data: [150000, 135000, 170000, 185000, 198000, 210000],
            backgroundColor: 'rgba(239,68,68,0.4)',
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top', labels: { color: '#e2e8f0' } },
        },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        },
      },
    });
  }, [salesFilter]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = () => {
    setScreen('app');
  };

  const handleCreateBusiness = () => {
    const newClient = {
      name: businessName,
      email: `${businessName.toLowerCase().replace(/\s+/g, '')}@nexus.com`,
      plan: 'Monthly',
      id: `${businessName.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 9999)}`,
    };
    setClients(prev => [newClient, ...prev]);
  };

  const handleAddItem = () => {
    setInventory(prev => [
      {
        id: `inv-${Date.now()}`,
        name: 'New Product',
        sku: `SKU-${Math.floor(Math.random() * 999)}`,
        category: 'Accessories',
        quantity: 0,
        costPrice: 0,
        sellingPrice: 0,
        supplier: 'Supplier',
        minStockAlert: 5,
      },
      ...prev,
    ]);
    setIsItemModalOpen(false);
  };

  const handleAddCustomer = () => {
    setCustomers(prev => [
      {
        id: `cust-${Date.now()}`,
        name: 'New Customer',
        phone: '+91 90000 00000',
        email: 'new@customer.com',
        address: 'India',
        totalSpent: 0,
        orderCount: 0,
      },
      ...prev,
    ]);
    setIsCustomerModalOpen(false);
  };

  const updateOrderQty = (id: string, delta: number) => {
    setOrderItems(prev =>
      prev.map(item => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
    );
  };

  const handleRemoveOrderItem = (id: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };

  const navigateTo = (page: typeof activePage) => {
    setActivePage(page);
    setIsSidebarOpen(false);
  };

  return (
    <div>
      {screen === 'login' && (
        <div id="login-screen" className="login-screen">
          <div className="login-bg"></div>
          <div className="login-bg-2"></div>

          <div className="glass login-card">
            <div className="login-logo">📦</div>
            <h2 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '8px' }}>Nexus Business Pro</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>
              Complete Inventory & Sales Management
            </p>

            <div className="form-group mb-4">
              <label>Business ID</label>
              <input type="text" className="input" placeholder="e.g., raj-electronics-8k3z" />
            </div>

            <div className="form-group mb-4">
              <label>Email Address</label>
              <input type="email" className="input" placeholder="owner@business.com" />
            </div>

            <div className="form-group mb-6">
              <label>Password</label>
              <input type="password" className="input" placeholder="••••••••" />
            </div>

            <button className="btn btn-primary w-full" onClick={handleLogin} style={{ justifyContent: 'center', padding: '16px' }}>
              <i className="fas fa-sign-in-alt"></i> Access My Business
            </button>

            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <button
                onClick={() => setScreen('admin')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px' }}
              >
                <i className="fas fa-shield-alt"></i> Admin Access
              </button>
            </div>
          </div>
        </div>
      )}

      {screen === 'admin' && (
        <div id="admin-screen" className="login-screen">
          <div className="glass login-card" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2>
                <i className="fas fa-shield-alt"></i> Admin Dashboard
              </h2>
              <button className="btn btn-secondary" onClick={() => setScreen('login')}>
                <i className="fas fa-arrow-left"></i> Back
              </button>
            </div>

            <div className="card glass" style={{ marginBottom: '24px' }}>
              <h3 className="card-title mb-4">
                <i className="fas fa-plus-circle text-success"></i> Create New Business
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={event => setBusinessName(event.target.value)}
                    className="input"
                    placeholder="Raj Electronics"
                  />
                </div>
                <div className="form-group">
                  <label>Client Email</label>
                  <input type="email" className="input" placeholder="client@email.com" />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="input" placeholder="Min 6 characters" />
                </div>
                <div className="form-group">
                  <label>Plan</label>
                  <select className="select">
                    <option value="monthly">₹200/month</option>
                    <option value="onetime">₹10,000 one-time + ₹50/month</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-success" onClick={handleCreateBusiness}>
                <i className="fas fa-plus"></i> Create Account & Generate ID
              </button>
            </div>

            <div className="card glass">
              <div className="card-header">
                <h3 className="card-title">Your Clients</h3>
                <button className="btn btn-secondary btn-sm">
                  <i className="fas fa-sync"></i> Refresh
                </button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Business</th>
                      <th>Email</th>
                      <th>Plan</th>
                      <th>ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(client => (
                      <tr key={client.id}>
                        <td>{client.name}</td>
                        <td>{client.email}</td>
                        <td>{client.plan}</td>
                        <td>{client.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === 'app' && (
        <div id="app-screen">
          <aside className={`sidebar glass-panel ${isSidebarOpen ? 'open' : ''}`} id="sidebar">
            <div className="logo">
              <div className="logo-icon">📦</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '18px' }}>Nexus Pro</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Business Suite</div>
              </div>
            </div>

            <nav style={{ flex: 1 }}>
              <button className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => navigateTo('dashboard')}>
                <i className="fas fa-chart-line"></i>
                <span>Dashboard</span>
              </button>
              <button className={`nav-item ${activePage === 'inventory' ? 'active' : ''}`} onClick={() => navigateTo('inventory')}>
                <i className="fas fa-boxes"></i>
                <span>Inventory</span>
                <span className="nav-badge">{inventory.length}</span>
              </button>
              <button className={`nav-item ${activePage === 'orders' ? 'active' : ''}`} onClick={() => navigateTo('orders')}>
                <i className="fas fa-shopping-cart"></i>
                <span>Sales & Orders</span>
              </button>
              <button className={`nav-item ${activePage === 'customers' ? 'active' : ''}`} onClick={() => navigateTo('customers')}>
                <i className="fas fa-users"></i>
                <span>Customers</span>
              </button>
              <button className={`nav-item ${activePage === 'analytics' ? 'active' : ''}`} onClick={() => navigateTo('analytics')}>
                <i className="fas fa-chart-pie"></i>
                <span>Analytics</span>
              </button>
              <button className={`nav-item ${activePage === 'settings' ? 'active' : ''}`} onClick={() => navigateTo('settings')}>
                <i className="fas fa-gear"></i>
                <span>Settings</span>
              </button>
            </nav>

            <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, var(--success) 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <i className="fas fa-store" style={{ color: 'white' }}></i>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {businessName}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--success)' }}>
                    <span
                      className="pulse"
                      style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        background: 'var(--success)',
                        borderRadius: '50%',
                        marginRight: '6px',
                      }}
                    ></span>
                    Online
                  </div>
                </div>
              </div>
              <button className="btn btn-secondary w-full" onClick={() => setScreen('login')} style={{ justifyContent: 'center' }}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </aside>

          <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(prev => !prev)}>
            <i className="fas fa-bars"></i>
          </button>

          <nav className="bottom-nav">
            <button className={activePage === 'dashboard' ? 'active' : ''} onClick={() => navigateTo('dashboard')}>
              <i className="fas fa-chart-line"></i>
              <span>Home</span>
            </button>
            <button className={activePage === 'inventory' ? 'active' : ''} onClick={() => navigateTo('inventory')}>
              <i className="fas fa-boxes"></i>
              <span>Stock</span>
            </button>
            <button className={activePage === 'orders' ? 'active' : ''} onClick={() => navigateTo('orders')}>
              <i className="fas fa-receipt"></i>
              <span>Sales</span>
            </button>
            <button className={activePage === 'analytics' ? 'active' : ''} onClick={() => navigateTo('analytics')}>
              <i className="fas fa-chart-pie"></i>
              <span>Reports</span>
            </button>
          </nav>

          <main className="main-content">
            {activePage === 'dashboard' && (
              <section id="page-dashboard" className="page">
                <div className="page-header">
                  <div className="page-title">
                    <h1>Dashboard</h1>
                    <p>Overview of your business performance</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-success">
                      <i className="fas fa-plus"></i> New Sale
                    </button>
                    <button className="btn btn-primary" onClick={() => setIsItemModalOpen(true)}>
                      <i className="fas fa-plus"></i> Add Inventory
                    </button>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="glass stat-card stat-purple">
                    <div className="stat-icon">💰</div>
                    <div className="stat-value">{currencyFormatter.format(45800)}</div>
                    <div className="stat-label">Today's Sales</div>
                  </div>
                  <div className="glass stat-card stat-green">
                    <div className="stat-icon">📈</div>
                    <div className="stat-value">{currencyFormatter.format(15600)}</div>
                    <div className="stat-label">Today's Profit</div>
                  </div>
                  <div className="glass stat-card stat-blue">
                    <div className="stat-icon">📦</div>
                    <div className="stat-value">{currencyFormatter.format(inventoryValue)}</div>
                    <div className="stat-label">Inventory Value</div>
                  </div>
                  <div className="glass stat-card stat-orange">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-value">{lowStockCount}</div>
                    <div className="stat-label">Low Stock Items</div>
                  </div>
                </div>

                <div className="split-grid">
                  <div className="glass card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <i className="fas fa-chart-line"></i> Sales Trend (Last 7 Days)
                      </h3>
                    </div>
                    <div className="chart-container">
                      <canvas ref={salesChartRef}></canvas>
                    </div>
                  </div>

                  <div className="glass card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <i className="fas fa-clock"></i> Recent Orders
                      </h3>
                    </div>
                    <div className="list-stack">
                      {orders.map(order => (
                        <div key={order.id} className="list-item">
                          <div>
                            <div className="font-bold">{order.customer}</div>
                            <div className="text-muted text-sm">{order.id}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="font-bold">{currencyFormatter.format(order.total)}</div>
                            <div className={`badge ${order.status === 'Completed' ? 'badge-success' : order.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                              {order.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activePage === 'inventory' && (
              <section id="page-inventory" className="page">
                <div className="page-header">
                  <div className="page-title">
                    <h1>Inventory</h1>
                    <p>Manage your products and stock</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary">
                      <i className="fas fa-download"></i> Export
                    </button>
                    <button className="btn btn-primary" onClick={() => setIsItemModalOpen(true)}>
                      <i className="fas fa-plus"></i> Add Item
                    </button>
                  </div>
                </div>

                <div className="glass card" style={{ padding: '16px' }}>
                  <div className="filter-row">
                    <input type="text" className="input" placeholder="🔍 Search items..." />
                    <select className="select">
                      <option value="">All Categories</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Audio">Audio</option>
                    </select>
                    <select className="select">
                      <option value="">Stock Status</option>
                      <option value="instock">In Stock</option>
                      <option value="low">Low Stock</option>
                      <option value="out">Out of Stock</option>
                    </select>
                    <button className="btn btn-secondary">
                      <i className="fas fa-file-excel"></i> Bulk Import
                    </button>
                  </div>
                </div>

                <div className="glass card">
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>SKU</th>
                          <th>Category</th>
                          <th>Stock</th>
                          <th>Cost</th>
                          <th>Price</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventory.map(item => {
                          const isLow = item.quantity <= item.minStockAlert;
                          const isOut = item.quantity === 0;
                          return (
                            <tr key={item.id}>
                              <td>
                                <div className="item-cell">
                                  <div className="item-avatar">{item.name.charAt(0)}</div>
                                  <div>
                                    <div className="font-bold">{item.name}</div>
                                    <div className="text-muted text-sm">{item.supplier}</div>
                                  </div>
                                </div>
                              </td>
                              <td>{item.sku}</td>
                              <td>
                                <span className="category-pill">{item.category}</span>
                              </td>
                              <td>{item.quantity}</td>
                              <td>{currencyFormatter.format(item.costPrice)}</td>
                              <td>{currencyFormatter.format(item.sellingPrice)}</td>
                              <td>
                                <span className={`badge ${isOut ? 'badge-danger' : isLow ? 'badge-warning' : 'badge-success'}`}>
                                  {isOut ? 'Out' : isLow ? 'Low' : 'In Stock'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {activePage === 'orders' && (
              <section id="page-orders" className="page">
                <div className="page-header">
                  <div className="page-title">
                    <h1>Sales & Orders</h1>
                    <p>Create and manage customer orders</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary">
                      <i className="fas fa-filter"></i> Filters
                    </button>
                    <button className="btn btn-primary">
                      <i className="fas fa-print"></i> Print Invoice
                    </button>
                  </div>
                </div>

                <div className="orders-grid">
                  <div className="glass card">
                    <div className="card-header">
                      <h3 className="card-title">Create New Order</h3>
                      <span className="badge badge-info">Invoice #NX-1004</span>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Customer</label>
                        <select className="select">
                          <option value="">Search or select customer</option>
                          {customers.map(customer => (
                            <option key={customer.id}>{customer.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Payment Method</label>
                        <select
                          className="select"
                          value={orderMeta.paymentMethod}
                          onChange={event => setOrderMeta(prev => ({ ...prev, paymentMethod: event.target.value }))}
                        >
                          <option>Cash</option>
                          <option>Card</option>
                          <option>UPI</option>
                          <option>Credit</option>
                        </select>
                      </div>
                    </div>

                    <div className="order-items">
                      {orderItems.map(item => (
                        <div key={item.id} className="order-item">
                          <div style={{ flex: 1 }}>
                            <div className="font-bold">{item.name}</div>
                            <div className="text-muted text-sm">SKU: {item.id}</div>
                          </div>
                          <div className="qty-controls">
                            <button className="btn btn-secondary btn-xs" onClick={() => updateOrderQty(item.id, -1)}>
                              -
                            </button>
                            <span>{item.qty}</span>
                            <button className="btn btn-secondary btn-xs" onClick={() => updateOrderQty(item.id, 1)}>
                              +
                            </button>
                          </div>
                          <div className="font-bold">{currencyFormatter.format(item.price)}</div>
                          <button className="icon-btn" onClick={() => handleRemoveOrderItem(item.id)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Tax Rate (%)</label>
                        <input
                          type="number"
                          className="input"
                          value={orderMeta.taxRate}
                          onChange={event => setOrderMeta(prev => ({ ...prev, taxRate: Number(event.target.value) }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Discount (₹)</label>
                        <input
                          type="number"
                          className="input"
                          value={orderMeta.discount}
                          onChange={event => setOrderMeta(prev => ({ ...prev, discount: Number(event.target.value) }))}
                        />
                      </div>
                    </div>

                    <div className="order-total">
                      <div className="total-row">
                        <span>Subtotal</span>
                        <span>{currencyFormatter.format(subtotal)}</span>
                      </div>
                      <div className="total-row">
                        <span>Tax</span>
                        <span>{currencyFormatter.format(taxAmount)}</span>
                      </div>
                      <div className="total-row">
                        <span>Discount</span>
                        <span>- {currencyFormatter.format(orderMeta.discount)}</span>
                      </div>
                      <div className="total-row grand">
                        <span>Total</span>
                        <span>{currencyFormatter.format(total)}</span>
                      </div>
                    </div>

                    <div className="action-row">
                      <button className="btn btn-primary">
                        <i className="fas fa-check"></i> Complete Order
                      </button>
                      <button className="btn btn-secondary">
                        <i className="fas fa-file-pdf"></i> Download Invoice
                      </button>
                    </div>
                  </div>

                  <div className="glass card">
                    <div className="card-header">
                      <h3 className="card-title">Order History</h3>
                      <select className="select" style={{ width: '180px' }}>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Month</option>
                      </select>
                    </div>
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Order</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(order => (
                            <tr key={order.id}>
                              <td>{order.id}</td>
                              <td>{order.customer}</td>
                              <td>{order.date}</td>
                              <td>{currencyFormatter.format(order.total)}</td>
                              <td>
                                <span className={`badge ${order.status === 'Completed' ? 'badge-success' : order.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
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
              </section>
            )}

            {activePage === 'customers' && (
              <section id="page-customers" className="page">
                <div className="page-header">
                  <div className="page-title">
                    <h1>Customers</h1>
                    <p>View customer profiles and purchase history</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary">
                      <i className="fas fa-download"></i> Export
                    </button>
                    <button className="btn btn-primary" onClick={() => setIsCustomerModalOpen(true)}>
                      <i className="fas fa-user-plus"></i> Add Customer
                    </button>
                  </div>
                </div>

                <div className="glass card">
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Contact</th>
                          <th>Total Spent</th>
                          <th>Orders</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map(customer => (
                          <tr key={customer.id}>
                            <td>
                              <div className="item-cell">
                                <div className="item-avatar">{customer.name.charAt(0)}</div>
                                <div>
                                  <div className="font-bold">{customer.name}</div>
                                  <div className="text-muted text-sm">{customer.address}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="text-sm">{customer.phone}</div>
                              <div className="text-muted text-sm">{customer.email}</div>
                            </td>
                            <td>{currencyFormatter.format(customer.totalSpent)}</td>
                            <td>{customer.orderCount}</td>
                            <td>
                              <span className="badge badge-success">Active</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {activePage === 'analytics' && (
              <section id="page-analytics" className="page">
                <div className="page-header">
                  <div className="page-title">
                    <h1>Analytics</h1>
                    <p>Profit & performance insights</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <select className="select" value={salesFilter} onChange={event => setSalesFilter(event.target.value)}>
                      <option value="7">Last 7 Days</option>
                      <option value="30">Last 30 Days</option>
                      <option value="90">Quarter</option>
                    </select>
                    <button className="btn btn-secondary">
                      <i className="fas fa-download"></i> Export Report
                    </button>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="glass stat-card stat-green">
                    <div className="stat-icon">💹</div>
                    <div className="stat-value">{currencyFormatter.format(312000)}</div>
                    <div className="stat-label">Total Revenue</div>
                  </div>
                  <div className="glass stat-card stat-red">
                    <div className="stat-icon">📉</div>
                    <div className="stat-value">{currencyFormatter.format(185000)}</div>
                    <div className="stat-label">Total Cost</div>
                  </div>
                  <div className="glass stat-card stat-blue">
                    <div className="stat-icon">🧾</div>
                    <div className="stat-value">{currencyFormatter.format(22000)}</div>
                    <div className="stat-label">Expenses</div>
                  </div>
                  <div className="glass stat-card stat-purple">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-value">{currencyFormatter.format(105000)}</div>
                    <div className="stat-label">Net Profit</div>
                  </div>
                </div>

                <div className="grid analytics-grid">
                  <div className="glass card">
                    <div className="card-header">
                      <h3 className="card-title">Revenue vs Cost</h3>
                    </div>
                    <div className="chart-container">
                      <canvas ref={analyticsChartRef}></canvas>
                    </div>
                  </div>
                  <div className="glass card profit-card">
                    <div className="card-header">
                      <h3 className="card-title">Profit Calculator</h3>
                    </div>
                    <div className="profit-amount">{currencyFormatter.format(total - totalCost)}</div>
                    <p className="text-muted">
                      Net Profit = Revenue ({currencyFormatter.format(total)}) - Cost ({currencyFormatter.format(totalCost)}) -
                      Expenses ({currencyFormatter.format(22000)})
                    </p>
                    <div className="list-stack">
                      <div className="list-item">
                        <span>Inventory Turnover</span>
                        <span className="badge badge-info">3.6x</span>
                      </div>
                      <div className="list-item">
                        <span>Top Product</span>
                        <span className="badge badge-success">Wireless Keyboard</span>
                      </div>
                      <div className="list-item">
                        <span>Top Customer</span>
                        <span className="badge badge-success">Rahul Mehta</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activePage === 'settings' && (
              <section id="page-settings" className="page">
                <div className="page-header">
                  <div className="page-title">
                    <h1>Settings</h1>
                    <p>Manage business details, taxes, and categories</p>
                  </div>
                </div>

                <div className="settings-grid">
                  <div className="glass card">
                    <div className="card-header">
                      <h3 className="card-title">Business Details</h3>
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Business Name</label>
                        <input
                          type="text"
                          className="input"
                          value={businessName}
                          onChange={event => setBusinessName(event.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Owner</label>
                        <input type="text" className="input" placeholder="Owner name" />
                      </div>
                      <div className="form-group">
                        <label>Contact Email</label>
                        <input type="email" className="input" placeholder="owner@business.com" />
                      </div>
                      <div className="form-group">
                        <label>Business Phone</label>
                        <input type="text" className="input" placeholder="+91 90000 00000" />
                      </div>
                    </div>
                  </div>

                  <div className="glass card">
                    <div className="card-header">
                      <h3 className="card-title">Tax & Currency</h3>
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Default Tax Rate (%)</label>
                        <input
                          type="number"
                          className="input"
                          value={settings.taxRate}
                          onChange={event => setSettings(prev => ({ ...prev, taxRate: Number(event.target.value) }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Currency</label>
                        <select
                          className="select"
                          value={settings.currency}
                          onChange={event => setSettings(prev => ({ ...prev, currency: event.target.value }))}
                        >
                          <option>INR</option>
                          <option>USD</option>
                          <option>EUR</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="glass card">
                    <div className="card-header">
                      <h3 className="card-title">Categories</h3>
                    </div>
                    <div className="form-group">
                      <label>Category Tags</label>
                      <input
                        type="text"
                        className="input"
                        value={settings.categoryTags}
                        onChange={event => setSettings(prev => ({ ...prev, categoryTags: event.target.value }))}
                      />
                      <p className="text-muted text-sm" style={{ marginTop: '8px' }}>
                        Separate categories by commas. Colors are auto-assigned.
                      </p>
                    </div>
                    <div className="category-preview">
                      {settings.categoryTags.split(',').map(tag => (
                        <span key={tag} className="category-pill">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </main>

          {isItemModalOpen && (
            <div className="modal">
              <div className="modal-content glass">
                <div className="modal-header">
                  <div className="modal-title">Add New Inventory Item</div>
                  <button className="close-btn" onClick={() => setIsItemModalOpen(false)}>
                    ×
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Item Name</label>
                    <input className="input" placeholder="e.g., Smart Bulb" />
                  </div>
                  <div className="form-group">
                    <label>SKU</label>
                    <input className="input" placeholder="SKU-001" />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select className="select">
                      <option>Accessories</option>
                      <option>Lighting</option>
                      <option>Audio</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input className="input" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="action-row">
                  <button className="btn btn-secondary" onClick={() => setIsItemModalOpen(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddItem}>
                    Save Item
                  </button>
                </div>
              </div>
            </div>
          )}

          {isCustomerModalOpen && (
            <div className="modal">
              <div className="modal-content glass">
                <div className="modal-header">
                  <div className="modal-title">Add New Customer</div>
                  <button className="close-btn" onClick={() => setIsCustomerModalOpen(false)}>
                    ×
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Customer Name</label>
                    <input className="input" placeholder="Customer name" />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input className="input" placeholder="+91 90000 00000" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input className="input" placeholder="customer@email.com" />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input className="input" placeholder="City" />
                  </div>
                </div>
                <div className="action-row">
                  <button className="btn btn-secondary" onClick={() => setIsCustomerModalOpen(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddCustomer}>
                    Save Customer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
