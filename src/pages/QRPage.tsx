import { Link } from 'react-router-dom';
import { Shield, ArrowRight, AlertTriangle } from 'lucide-react';

export default function QRPage() {
  const reportUrl = typeof window !== 'undefined' ? `${window.location.origin}/report` : '/report';

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-5">
        <Shield className="w-9 h-9 text-white" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-2">
        Uni SGBV Reporting Platform
      </h1>
      <p className="text-slate-500 text-center text-sm mb-8 max-w-xs">
        For students and staff of this institution. Your report is confidential.
      </p>

      <Link
        to="/report"
        className="inline-flex items-center gap-3 bg-teal-600 hover:bg-teal-700 text-white font-bold px-10 py-5 rounded-2xl text-xl transition-all duration-200 shadow-xl hover:shadow-2xl mb-6"
      >
        Report Now
        <ArrowRight className="w-6 h-6" />
      </Link>

      <div className="bg-slate-50 border border-slate-200 rounded-xl px-6 py-3 mb-8">
        <p className="text-slate-600 text-sm font-mono text-center">{reportUrl}</p>
      </div>

      <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 max-w-sm">
        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-red-700">
          In immediate danger? Call <strong>112</strong> (Emergency) or campus security.
        </p>
      </div>

      <p className="text-xs text-slate-400 mt-8 text-center max-w-xs">
        Anonymous by default. No personal information required. Reports are routed securely to your institution.
      </p>
    </div>
  );
}
