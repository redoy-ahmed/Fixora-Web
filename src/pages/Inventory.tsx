import React, { useEffect, useState } from 'react';
import { Package, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { Header } from '../components/Header';
import { apiClient } from '../api/client';

export const Inventory: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2">
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
      </main>
    </div>
  );
};
