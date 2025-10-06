import React, { useState, useEffect } from 'react';
import { Users, BarChart3, Trophy, Ticket, DollarSign, Calendar, QrCode, Send, MessageCircle, Smartphone, Settings, Plus, Edit, Trash2, CheckCircle, AlertCircle, Clock, Lock } from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tickets, setTickets] = useState([]);
  const [vendors, setVendors] = useState([
    { id: 1, name: 'Vendedor 1', email: 'vendedor1@example.com', commission: 10, active: true },
    { id: 2, name: 'Vendedor 2', email: 'vendedor2@example.com', commission: 15, active: true }
  ]);
  const [lotteries] = useState([
    { id: 1, name: 'Lotería de Bogotá', time: '20:00', active: true, closed: false },
    { id: 2, name: 'Lotería de Medellín', time: '19:30', active: true, closed: false },
    { id: 3, name: 'Lotería del Cauca', time: '21:00', active: true, closed: false },
    { id: 4, name: 'Lotería de Manizales', time: '18:00', active: false, closed: true }
  ]);
  const [betForm, setBetForm] = useState({
    digits: '2',
    number: '',
    amount: '',
    selectedLotteries: []
  });
  const [winningNumbers, setWinningNumbers] = useState({});

  // Mock authentication
  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'AdminPro123!') {
      setCurrentUser({ role: 'admin', name: 'Administrador' });
      setCurrentView('admin');
    } else if ((username === 'vendedor1' && password === 'Vendedor123!') || 
               (username === 'vendedor2' && password === 'Vendedor456!')) {
      setCurrentUser({ role: 'vendor', name: username === 'vendedor1' ? 'Vendedor 1' : 'Vendedor 2' });
      setCurrentView('vendor');
    }
  };

  // Generate ticket
  const generateTicket = () => {
    const ticketId = `TICKET-${Date.now().toString().slice(-6)}`;
    const newTicket = {
      id: ticketId,
      vendor: currentUser.name,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      digits: betForm.digits,
      number: betForm.number,
      amount: parseFloat(betForm.amount),
      lotteries: betForm.selectedLotteries.map(id => lotteries.find(l => l.id === id)?.name).filter(Boolean),
      total: parseFloat(betForm.amount) * betForm.selectedLotteries.length,
      isWinner: false
    };
    
    setTickets(prev => [...prev, newTicket]);
    setBetForm({ digits: '2', number: '', amount: '', selectedLotteries: [] });
    
    // Show success message
    alert('¡Ticket generado con éxito! 🎟️');
  };

  // Handle lottery selection
  const toggleLottery = (lotteryId) => {
    setBetForm(prev => ({
      ...prev,
      selectedLotteries: prev.selectedLotteries.includes(lotteryId)
        ? prev.selectedLotteries.filter(id => id !== lotteryId)
        : [...prev.selectedLotteries, lotteryId]
    }));
  };

  // Calculate total amount
  const totalAmount = betForm.amount ? parseFloat(betForm.amount) * betForm.selectedLotteries.length : 0;

  // Mock data for admin dashboard
  const adminStats = {
    totalSales: 1250000,
    totalTickets: 47,
    totalCommissions: 125000,
    topVendors: [
      { name: 'Vendedor 1', sales: 750000 },
      { name: 'Vendedor 2', sales: 500000 }
    ]
  };

  // Vendor dashboard stats
  const vendorStats = {
    dailySales: tickets.filter(t => t.vendor === currentUser?.name).reduce((sum, t) => sum + t.total, 0),
    commission: tickets.filter(t => t.vendor === currentUser?.name).reduce((sum, t) => sum + (t.total * (currentUser?.name === 'Vendedor 1' ? 0.1 : 0.15)), 0)
  };

  // Login Component
  const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">LoteríaPRO</h1>
            <p className="text-gray-600">Sistema de gestión de loterías</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ingrese su usuario"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ingrese su contraseña"
              />
            </div>
            
            <button
              onClick={() => handleLogin(username, password)}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Iniciar Sesión ✨
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Admin Dashboard
  const AdminDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ventas Totales</p>
                <p className="text-2xl font-bold text-gray-800">${adminStats.totalSales.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tickets Totales</p>
                <p className="text-2xl font-bold text-gray-800">{adminStats.totalTickets}</p>
              </div>
              <Ticket className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Comisiones</p>
                <p className="text-2xl font-bold text-gray-800">${adminStats.totalCommissions.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Vendedores</p>
                <p className="text-2xl font-bold text-gray-800">{vendors.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Vendedores</h3>
            <div className="space-y-3">
              {adminStats.topVendors.map((vendor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{vendor.name}</span>
                  <span className="text-emerald-600 font-bold">${vendor.sales.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Gestión de Loterías</h3>
            <div className="space-y-2">
              {lotteries.map(lottery => (
                <div key={lottery.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${lottery.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium">{lottery.name}</span>
                    <span className="text-sm text-gray-500">{lottery.time}</span>
                  </div>
                  {lottery.closed && <Lock className="w-4 h-4 text-red-500" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Vendor Dashboard
  const VendorDashboard = () => {
    const vendorTickets = tickets.filter(t => t.vendor === currentUser.name);
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ventas del Día</p>
                <p className="text-2xl font-bold text-gray-800">${vendorStats.dailySales.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Comisión</p>
                <p className="text-2xl font-bold text-gray-800">${vendorStats.commission.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total a Entregar</p>
                <p className="text-2xl font-bold text-gray-800">${(vendorStats.dailySales - vendorStats.commission).toLocaleString()}</p>
              </div>
              <Ticket className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial de Ventas</h3>
          <div className="space-y-3">
            {vendorTickets.length > 0 ? (
              vendorTickets.slice(-5).map(ticket => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium">ID: {ticket.id}</p>
                    <p className="text-sm text-gray-600">Número: {ticket.number} | Loterías: {ticket.loterias.join(', ')}</p>
                    <p className="text-sm text-gray-500">{ticket.date} - {ticket.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">${ticket.total.toLocaleString()}</p>
                    {ticket.isWinner && <span className="text-yellow-600 font-bold">🏆 Ganador!</span>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay tickets registrados</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Bet Creation Form
  const BetForm = () => {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Crear Nueva Apuesta ✨</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Apuesta</label>
            <div className="flex space-x-4">
              {['2', '3', '4'].map(digits => (
                <button
                  key={digits}
                  onClick={() => setBetForm(prev => ({ ...prev, digits }))}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    betForm.digits === digits
                      ? 'bg-yellow-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {digits} cifras
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
              <input
                type="text"
                value={betForm.number}
                onChange={(e) => setBetForm(prev => ({ ...prev, number: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder={`Ingrese ${betForm.digits} dígitos`}
                maxLength={parseInt(betForm.digits)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monto por Lotería ($)</label>
              <input
                type="number"
                value={betForm.amount}
                onChange={(e) => setBetForm(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Monto"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Loterías</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lotteries
                .filter(lottery => lottery.active && !lottery.closed)
                .map(lottery => (
                  <label key={lottery.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={betForm.selectedLotteries.includes(lottery.id)}
                      onChange={() => toggleLottery(lottery.id)}
                      className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium">{lottery.name}</span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {lottery.time}
                      </div>
                    </div>
                  </label>
                ))}
            </div>
          </div>

          {totalAmount > 0 && (
            <div className="bg-gradient-to-r from-emerald-50 to-yellow-50 p-4 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Total a Pagar:</span>
                <span className="text-2xl font-bold text-emerald-600">${totalAmount.toLocaleString()}</span>
              </div>
            </div>
          )}

          <button
            onClick={generateTicket}
            disabled={!betForm.number || !betForm.amount || betForm.selectedLotteries.length === 0}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
          >
            ¡Generar Ticket! 🎟️
          </button>
        </div>
      </div>
    );
  };

  // Admin Navigation
  const AdminNav = () => {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <span className="ml-2 text-xl font-bold text-gray-800">LoteríaPRO Admin</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('login')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  // Vendor Navigation
  const VendorNav = () => {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Ticket className="h-8 w-8 text-emerald-500" />
                <span className="ml-2 text-xl font-bold text-gray-800">LoteríaPRO - {currentUser?.name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('login')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  // Main Layout
  const MainLayout = ({ children, nav }) => {
    return (
      <div className="min-h-screen bg-gray-50">
        {nav}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    );
  };

  // Render based on current view
  if (currentView === 'login') {
    return <Login />;
  }

  if (currentView === 'admin') {
    return (
      <MainLayout nav={<AdminNav />}>
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'dashboard'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'vendors'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vendedores
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'reports'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reportes
            </button>
          </div>
        </div>
        
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'vendors' && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Gestión de Vendedores</h3>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Agregar Vendedor</span>
              </button>
            </div>
            <div className="space-y-4">
              {vendors.map(vendor => (
                <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{vendor.name}</p>
                    <p className="text-sm text-gray-600">{vendor.email}</p>
                    <p className="text-sm text-emerald-600">Comisión: {vendor.commission}%</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className={`p-2 ${vendor.active ? 'text-green-600' : 'text-gray-400'} hover:bg-gray-50 rounded-lg`}>
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Reportes y Liquidación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendedor</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                    <option>Vendedor 1</option>
                    <option>Vendedor 2</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                    <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                    <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-all">
                  Generar Reporte
                </button>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-4">Resumen del Reporte</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Vendido:</span>
                    <span className="font-bold">$1,250,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comisión (10%):</span>
                    <span className="font-bold text-emerald-600">$125,000</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Monto a Liquidar:</span>
                    <span className="font-bold text-yellow-600">$1,125,000</span>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Exportar CSV</span>
                  </button>
                  <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2">
                    <QrCode className="w-4 h-4" />
                    <span>Exportar PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </MainLayout>
    );
  }

  if (currentView === 'vendor') {
    return (
      <MainLayout nav={<VendorNav />}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <VendorDashboard />
          </div>
          <div className="space-y-6">
            <BetForm />
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Enviar Ticket</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all">
                  <MessageCircle className="w-5 h-5" />
                  <span>Enviar por WhatsApp</span>
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all">
                  <Smartphone className="w-5 h-5" />
                  <span>Enviar por SMS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return null;
};

export default App;