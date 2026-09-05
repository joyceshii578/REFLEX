import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [healthStatus, setHealthStatus] = useState('Checking...');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [orders, setOrders] = useState([]);

  const [drivers, setDrivers] = useState([
    { id: 'DRV-01', name: 'John Kamau', vehicle: 'Motorcycle (KMD 123A)', status: 'Available', location: 'CBD' },
    { id: 'DRV-02', name: 'Peter Njoroge', vehicle: 'Van (KCE 456B)', status: 'On Delivery', location: 'Westlands' },
    { id: 'DRV-03', name: 'Grace Wambui', vehicle: 'Motorcycle (KMF 789C)', status: 'Offline', location: 'Industrial Area' },
  ]);

  const [newOrder, setNewOrder] = useState({ customer_name: '', phone_number: '', delivery_address: '', order_details: '' });

  useEffect(() => {
    api.checkHealth()
      .then(data => setHealthStatus(data.status === 'Live' ? 'Connected (Vercel Live)' : 'Offline'))
      .catch(() => setHealthStatus('Offline'));

    api.get('/api/orders')
      .then(res => setOrders(res.data.data || []))
      .catch(() => setOrders([]));
  }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrder.customer_name || !newOrder.delivery_address) return;

    try {
      const res = await api.post('/api/orders', newOrder);
      setOrders([res.data.data, ...orders]);
      setNewOrder({ customer_name: '', phone_number: '', delivery_address: '', order_details: '' });
      setShowNewOrderModal(false);
    } catch (err) {
      console.error('Failed to create order:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Project Reflex Dispatch Hub</h1>
          <p className="text-sm text-slate-400">Real-time order monitoring & driver dispatching</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Backend API:</span>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
            healthStatus.includes('Live')
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {healthStatus}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800">
          <p className="text-xs font-medium text-slate-400">Total Orders</p>
          <p className="text-2xl font-bold mt-1">{orders.length}</p>
        </div>
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800">
          <p className="text-xs font-medium text-slate-400">Active Drivers</p>
          <p className="text-2xl font-bold mt-1 text-sky-400">
            {drivers.filter(d => d.status !== 'Offline').length}
          </p>
        </div>
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800">
          <p className="text-xs font-medium text-slate-400">Pending Dispatches</p>
          <p className="text-2xl font-bold mt-1 text-amber-400">
            {orders.filter(o => o.status === 'REQUESTED').length}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700/50">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Orders List
          </button>
          <button
            onClick={() => setActiveTab('dispatch')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'dispatch' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Driver Dispatch
          </button>
        </div>

        {activeTab === 'orders' && (
          <button
            onClick={() => setShowNewOrderModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-md"
          >
            + Create New Order
          </button>
        )}
      </div>

      {activeTab === 'orders' && (
        <div className="bg-slate-800/40 rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-xs text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Details</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono text-indigo-400 font-medium">{order.order_id}</td>
                  <td className="p-4 font-medium text-white">{order.customer_name}</td>
                  <td className="p-4 text-slate-400">{order.phone_number}</td>
                  <td className="p-4">{order.delivery_address}</td>
                  <td className="p-4 text-slate-400">{order.order_details}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-400' :
                      order.status === 'PICKED_UP' ? 'bg-sky-500/10 text-sky-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'dispatch' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {drivers.map((driver) => (
            <div key={driver.id} className="bg-slate-800/50 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-white">{driver.name}</h3>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                    driver.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300' :
                    driver.status === 'On Delivery' ? 'bg-sky-500/20 text-sky-300' :
                    'bg-slate-700 text-slate-400'
                  }`}>
                    {driver.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-1">Vehicle: {driver.vehicle}</p>
                <p className="text-xs text-slate-400">Current Zone: {driver.location}</p>
              </div>
              <button
                disabled={driver.status !== 'Available'}
                className="mt-5 w-full bg-slate-700 hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-slate-700 text-white text-xs font-medium py-2 rounded-lg transition-colors"
              >
                {driver.status === 'Available' ? 'Assign Pending Order' : 'Currently Busy'}
              </button>
            </div>
          ))}
        </div>
      )}

      {showNewOrderModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl max-w-md w-full p-6 border border-slate-700 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Create New Delivery Order</h2>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newOrder.customer_name}
                  onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newOrder.phone_number}
                  onChange={(e) => setNewOrder({ ...newOrder, phone_number: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. +254712345678"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={newOrder.delivery_address}
                  onChange={(e) => setNewOrder({ ...newOrder, delivery_address: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Lavington, Nairobi"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Order Details</label>
                <input
                  type="text"
                  required
                  value={newOrder.order_details}
                  onChange={(e) => setNewOrder({ ...newOrder, order_details: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. 2 blue shirts, size M"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 rounded-lg font-medium"
                >
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
