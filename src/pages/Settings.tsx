import React, { useEffect, useState } from 'react';
import { Save, Store, Receipt, RefreshCw, AlertCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { apiClient } from '../api/client';
import { ShopConfig } from '../types';

export const Settings: React.FC = () => {
  const [config, setConfig] = useState<ShopConfig>({
    shopName: 'TechCare Fixora Main',
    tagline: 'Professional Electronics Repair & Digital Passport',
    primaryPhone: '+880 1711 000000',
    primaryEmail: 'support@techcare.com',
    currencySymbol: '$',
    taxRatePercent: 5.0,
    defaultWarrantyDays: 90,
    receiptFooterText: 'Thank you for choosing TechCare Fixora. Track repair record via QR code.',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/v1/staff/settings');
      if (response.data) {
        setConfig(response.data);
      }
    } catch (err: any) {
      console.warn('Failed to fetch shop settings from database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await apiClient.post('/api/v1/staff/settings', config);
      setConfig(response.data);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setError('Failed to save shop settings to database.');
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 pb-12">
      <Header title="Global Shop Settings" subtitle="Configure shop identity, currency, warranty defaults, and receipts" />

      <main className="p-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">System Settings Config</h2>
            <p className="text-xs text-slate-400">Persisted in PostgreSQL database (`shop_config` table)</p>
          </div>
          <button
            onClick={fetchSettings}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Reload Settings</span>
          </button>
        </div>

        {isSaved && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center justify-between shadow-lg">
            <span>Shop configuration saved to PostgreSQL database successfully!</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Shop Branding & Identity</h3>
              <p className="text-xs text-slate-400">Displayed on invoices, customer app, and receipts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Shop Name</label>
              <input
                type="text"
                value={config.shopName}
                onChange={(e) => setConfig({ ...config, shopName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3.5 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Tagline / Motto</label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3.5 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Primary Phone</label>
              <input
                type="text"
                value={config.primaryPhone}
                onChange={(e) => setConfig({ ...config, primaryPhone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3.5 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Primary Email</label>
              <input
                type="email"
                value={config.primaryEmail}
                onChange={(e) => setConfig({ ...config, primaryEmail: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3.5 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-slate-800 pb-4 pt-4">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Financial & Warranty Defaults</h3>
              <p className="text-xs text-slate-400">Currency symbols, tax calculations, and warranty period</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Currency Symbol</label>
              <input
                type="text"
                value={config.currencySymbol}
                onChange={(e) => setConfig({ ...config, currencySymbol: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3.5 text-sm text-white outline-none font-bold text-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={config.taxRatePercent}
                onChange={(e) => setConfig({ ...config, taxRatePercent: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3.5 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Default Warranty (Days)</label>
              <input
                type="number"
                value={config.defaultWarrantyDays}
                onChange={(e) => setConfig({ ...config, defaultWarrantyDays: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3.5 text-sm text-white outline-none font-bold text-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Receipt & Invoice Footer Text</label>
            <textarea
              rows={2}
              value={config.receiptFooterText}
              onChange={(e) => setConfig({ ...config, receiptFooterText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3.5 text-sm text-white outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
