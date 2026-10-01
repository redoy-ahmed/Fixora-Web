import React, { useEffect, useState } from 'react';
import { Package, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { Header } from '../components/Header';
import { apiClient } from '../api/client';

export const Inventory: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    brand: 'Apple',
    category: 'Display',
    costPrice: '45.00',
    sellingPrice: '90.00',
    stockQuantity: 10,
    minimumStock: 2,
    supplierName: '',
  });

  const fetchInventory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/v1/staff/inventory');
      setItems(response.data);
    } catch (err: any) {
      console.warn('Failed to fetch inventory from database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddStockItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.sku) return;

    try {
      const costCents = Math.round((parseFloat(newItem.costPrice) || 0) * 100);
      const sellingCents = Math.round((parseFloat(newItem.sellingPrice) || 0) * 100);

      const response = await apiClient.post('/api/v1/staff/inventory', {
        sku: newItem.sku,
        name: newItem.name,
        brand: newItem.brand,
        category: newItem.category,
        costPriceCents: costCents,
        sellingPriceCents: sellingCents,
        stockQuantity: Number(newItem.stockQuantity),
        minimumStock: Number(newItem.minimumStock),
        supplierName: newItem.supplierName || 'Official Distributor',
      });

      setItems([...items, response.data]);
      setNewItem({
        name: '',
        sku: '',
        brand: 'Apple',
        category: 'Display',
        costPrice: '45.00',
        sellingPrice: '90.00',
        stockQuantity: 10,
        minimumStock: 2,
        supplierName: '',
      });
      setShowAddModal(false);
    } catch (err: any) {
      setError('Failed to save stock item to PostgreSQL database.');
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 pb-12">
      <Header title="Spare Parts Inventory" subtitle="Stock management and automatic reorder thresholds" />

      <main className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Inventory Stock ({items.length})</h2>
            <p className="text-xs text-slate-400">Fetched directly from PostgreSQL database (`inventory_parts` table)</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchInventory}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors flex items-center gap-2 text-xs font-semibold"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stock Item</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-cyan-400">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No Inventory Items</h3>
            <p className="text-sm text-slate-400">
              No spare parts recorded in the PostgreSQL database yet.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
            >
              Add First Stock Item
            </button>
          </div>
        )}

        {items.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 rounded-l-xl">Part Name</th>
                  <th className="px-4 py-3.5">SKU</th>
                  <th className="px-4 py-3.5">Stock Quantity</th>
                  <th className="px-4 py-3.5">Cost Price</th>
                  <th className="px-4 py-3.5">Selling Price</th>
                  <th className="px-4 py-3.5 rounded-r-xl">Brand / Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4 font-semibold text-white">{item.name}</td>
                    <td className="px-4 py-4 font-mono text-xs text-cyan-400">{item.sku}</td>
                    <td className="px-4 py-4 font-bold text-white">
                      {item.stockQuantity <= (item.minimumStock || 2) ? (
                        <span className="text-amber-400 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {item.stockQuantity} (Low Stock)
                        </span>
                      ) : (
                        <span>{item.stockQuantity} pcs</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-400">${((item.costPriceCents || 0) / 100).toFixed(2)}</td>
                    <td className="px-4 py-4 font-bold text-emerald-400">
                      ${((item.sellingPriceCents || 0) / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-400">
                      {item.brand} — {item.category}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Stock Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5">
              <h3 className="text-xl font-bold text-white">Add Spare Part to Stock</h3>
              <form onSubmit={handleAddStockItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Part Name</label>
                  <input
                    type="text"
                    required
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                    placeholder="e.g. iPhone 14 Pro Screen Assembly"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">SKU Code</label>
                    <input
                      type="text"
                      required
                      value={newItem.sku}
                      onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none font-mono"
                      placeholder="e.g. SCR-IP14P-01"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Brand</label>
                    <input
                      type="text"
                      required
                      value={newItem.brand}
                      onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                      placeholder="e.g. Apple / Samsung"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                      placeholder="Display"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Cost Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newItem.costPrice}
                      onChange={(e) => setNewItem({ ...newItem, costPrice: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Selling Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newItem.sellingPrice}
                      onChange={(e) => setNewItem({ ...newItem, sellingPrice: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none font-bold text-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Quantity On Hand</label>
                    <input
                      type="number"
                      required
                      value={newItem.stockQuantity}
                      onChange={(e) => setNewItem({ ...newItem, stockQuantity: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none font-bold text-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Reorder Alert Stock</label>
                    <input
                      type="number"
                      required
                      value={newItem.minimumStock}
                      onChange={(e) => setNewItem({ ...newItem, minimumStock: parseInt(e.target.value) || 2 })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold shadow-lg shadow-cyan-500/20"
                  >
                    Save Stock Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
