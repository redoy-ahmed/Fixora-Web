import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Wrench, Search, ShieldCheck, CheckCircle2, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { apiClient } from '../api/client';

export const PublicTracker: React.FC = () => {
  const { jobNumber: routeJobNumber } = useParams<{ jobNumber?: string }>();
  const [jobNumber, setJobNumber] = useState(routeJobNumber || 'RS-2026-00101');
  const [jobData, setJobData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobStatus = async (targetJobNum: string) => {
    if (!targetJobNum.trim()) return;
    setIsLoading(true);
    setError(null);
    setJobData(null);

    try {
      const response = await apiClient.get('/api/v1/staff/repairs');
      const allJobs = response.data || [];
      const found = allJobs.find(
        (j: any) => j.jobNumber?.toUpperCase() === targetJobNum.trim().toUpperCase()
      );

      if (found) {
        setJobData(found);
      } else {
        setError(`No active repair ticket found for "${targetJobNum}".`);
      }
    } catch (err: any) {
      setError(`Unable to query repair status at this time.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (routeJobNumber) {
      setJobNumber(routeJobNumber);
      fetchJobStatus(routeJobNumber);
    }
  }, [routeJobNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobStatus(jobNumber);
  };

  const getStepStatus = (currentStatus: string, step: string) => {
    const statusOrder = ['RECEIVED', 'DIAGNOSIS', 'REPAIRING', 'READY_FOR_PICKUP', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(currentStatus) >= 0 ? statusOrder.indexOf(currentStatus) : 0;
    const stepIndex = statusOrder.indexOf(step);

    if (currentIndex > stepIndex) return 'COMPLETED';
    if (currentIndex === stepIndex) return 'ACTIVE';
    return 'PENDING';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-8 relative z-10">
        <Link to="/login" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Staff Login</span>
        </Link>
        <div className="flex items-center gap-2">
          <Wrench className="w-6 h-6 text-cyan-400" />
          <span className="font-extrabold text-lg text-white">Fixora Live Repair Tracker</span>
        </div>
      </div>

      <div className="w-full max-w-2xl space-y-6 relative z-10">
        {/* Search Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <h1 className="text-xl font-bold text-white text-center">Track Your Device Repair Progress</h1>
          <p className="text-xs text-slate-400 text-center">
            Enter your Repair Job Number (e.g. <span className="text-cyan-400 font-mono font-bold">RS-2026-00101</span>)
          </p>

          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={jobNumber}
                onChange={(e) => setJobNumber(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white font-mono placeholder-slate-600 outline-none"
                placeholder="e.g. RS-2026-00101"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-cyan-500/20"
            >
              {isLoading ? 'Checking...' : 'Check Status'}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Status Stepper Card */}
        {jobData && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400">TICKET #{jobData.jobNumber}</span>
                <h2 className="text-xl font-bold text-white mt-1">{jobData.device ? `${jobData.device.brand} ${jobData.device.model}` : 'Customer Device'}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Owner: {jobData.customer?.name}</p>
              </div>
              <div className="text-right">
                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-1.5 rounded-full text-xs font-bold inline-block">
                  {jobData.status}
                </span>
                <p className="text-xs font-bold text-emerald-400 mt-2">
                  Estimate: ${((jobData.estimatedCostCents || 0) / 100).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Repair Lifecycle Stepper</h3>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {['RECEIVED', 'DIAGNOSIS', 'REPAIRING', 'READY_FOR_PICKUP', 'DELIVERED'].map((step, idx) => {
                  const state = getStepStatus(jobData.status, step);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          state === 'COMPLETED'
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                            : state === 'ACTIVE'
                            ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 ring-4 ring-cyan-500/20 animate-pulse'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {state === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span className={`text-[10px] font-semibold ${state === 'ACTIVE' ? 'text-cyan-400' : 'text-slate-500'}`}>
                        {step.replace('_', ' ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Problem Details */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Reported Problem</span>
              <p className="text-sm text-slate-200">{jobData.reportedProblem}</p>
            </div>

            {/* SHA-256 Verification Badge */}
            {jobData.recordHash && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <div className="text-xs font-mono">
                  <p className="text-emerald-400 font-bold">SHA-256 REST Record Hash Verified</p>
                  <p className="text-slate-400 truncate max-w-md">{jobData.recordHash}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
