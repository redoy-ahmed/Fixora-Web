import React, { useState } from 'react';
import { Package, Plus, AlertCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { InventoryItem } from '../types';

export const Inventory: React.FC = () => {
  const [items] = useState<InventoryItem[]>([
    {
      id: '1',
      partName: 'iPhone 14 Pro OLED Screen Assembly',
      sku: 'SCR-IP14P-01',
      quantityOnHand: 12,
      reorderThreshold: 5,
      unitCostCents: 4500,
      sellingPriceCents: 9000,
      compatibleModels: 'iPhone 14 Pro / 14 Pro Max',
    },
    {
      id: '2',
      partName: 'Samsung S23 Ultra Battery 5000mAh',
      sku: 'BAT-S23U-02',
      quantityOnHand: 3,
      reorderThreshold: 5,
      unitCostCents: 1500,
      sellingPriceCents: 3500,
      compatibleModels: 'Samsung S23 Ultra',
    },
  ]);

  return (
    <div className="flex-1 min-h-screen bg-slate-950 pb-12">
      <Header title="Spare Parts Inventory" subtitle="Stock management and automatic reorder thresholds" />

      <main className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Inventory Stock ({items.length})</h2>
            <p className="text-xs text-slate-400">Unit prices stored in integer cents (financial precision)</p>
          </div>
          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-lg shadow-cyan-500/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Stock Item</span>
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5 rounded-l-xl">Part Name</th>
                <th className="px-4 py-3.5">SKU</th>
                <th className="px-4 py-3.5">Quantity On Hand</th>
                <th className="px-4 py-3.5">Unit Cost</th>
                <th className="px-4 py-3.5">Selling Price</th>
                <th className="px-4 py-3.5 rounded-r-xl">Compatible Models</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4 font-semibold text-white">{item.partName}</td>
                  <td className="px-4 py-4 font-mono text-xs text-cyan-400">{item.sku}</td>
                  <td className="px-4 py-4 font-bold text-white">
                    {item.quantityOnHand <= item.reorderThreshold ? (
                      <span className="text-amber-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        {item.quantityOnHand} (Low Stock)
                      </span>
                    ) : (
                      <span>{item.quantityOnHand} pcs</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-slate-400">${(item.unitCostCents / 100).toFixed(2)}</td>
                  <td className="px-4 py-4 font-bold text-emerald-400">${(item.sellingPriceCents / 100).toFixed(2)}</td>
                  <td className="px-4 py-4 text-xs text-slate-400">{item.compatibleModels}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};