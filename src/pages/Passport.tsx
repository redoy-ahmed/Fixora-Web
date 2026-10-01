import React, { useState } from 'react';
import { ShieldCheck, Search, QrCode, Smartphone, Wrench, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Header } from '../components/Header';
import { apiClient } from '../api/client';

export const Passport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('DP-83A92F');
  const [passportData, setPassportData] = useState<any | null>(null);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchPassport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setPassportData(null);
    setVerificationResult(null);

    try {
      const query = searchQuery.trim();

      if (query.length > 20) {
        // Search by SHA-256 Record Hash
        const response = await apiClient.get(`/api/v1/public/verify/${query}`);
        setVerificationResult(response.data);
      } else {
        // Search by Public Device ID (e.g. DP-83A92F)
        const response = await apiClient.get(`/api/v1/public/passport/${query}`);
        setPassportData(response.data);
      }
    } catch (err: any) {
      setError(`No device passport or verification record found for "${searchQuery}".`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 pb-12">
      <Header title="Device Passport & Live QR Verification" subtitle="Search device history timeline and verify cryptographic SHA-256 record authenticity" />

      <main className="p-8 max-w-5xl mx-auto space-y-8">
        {/* Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-cyan-400" />
              Digital Passport Lookup
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter Public Device ID (e.g. <span className="text-cyan-400 font-mono">DP-83A92F</span>) or SHA-256 Record Hash
            </p>
          </div>

          <form onSubmit={handleSearchPassport} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white font-mono placeholder-slate-600 outline-none"
                placeholder="e.g. DP-83A92F or a9f4c3d821e0410a9b8c..."
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 shrink-0"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Lookup Passport</span>
                </>
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 shadow-lg">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Device Passport Result View */}
        {passportData && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
            {/* Header Badge */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/20">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-white tracking-wide">{passportData.brand} {passportData.model}</h2>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED PASSPORT
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Public ID: <span className="text-cyan-400 font-bold">{passportData.publicDeviceId}</span> | Serial: <span className="text-slate-300">{passportData.maskedSerialNumber}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Service History Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-cyan-400" />
                Service & Repair Timeline ({passportData.serviceHistory?.length || 0})
              </h3>

              {passportData.serviceHistory && passportData.serviceHistory.length > 0 ? (
                <div className="space-y-4">
                  {passportData.serviceHistory.map((job: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-400 text-sm">{job.jobNumber}</span>
                          <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                            {job.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-200">{job.reportedProblem}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> SHA-256 Hash
                        </p>
                        <p className="text-[11px] font-mono text-slate-500 truncate max-w-[180px]">{job.recordHash}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center text-slate-500 text-sm">
                  No previous repair records logged for this device.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hash Verification Result View */}
        {verificationResult && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center max-w-2xl mx-auto">
            <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${
              verificationResult.isVerified
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {verificationResult.isVerified ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                {verificationResult.isVerified ? 'Cryptographically Verified Record' : 'Record Verification Failed'}
              </h2>
              <p className="text-sm text-slate-400 mt-1">{verificationResult.message}</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-left text-xs space-y-2 font-mono">
              <p className="text-slate-400">Queried Hash: <span className="text-cyan-400">{verificationResult.recordHash}</span></p>
              <p className="text-slate-400">Server Hash: <span className="text-emerald-400">{verificationResult.serverHash || 'None'}</span></p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
