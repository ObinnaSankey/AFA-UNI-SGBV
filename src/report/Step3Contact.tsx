import { EyeOff, UserCheck, Lock, AlertTriangle } from 'lucide-react';
import type { ReportFormData } from '../lib/types';

interface Props {
  data: ReportFormData;
  onChange: (data: Partial<ReportFormData>) => void;
}

export default function Step3Contact({ data, onChange }: Props) {
  const handleAnonymousChange = (isAnon: boolean) => {
    if (isAnon) {
      onChange({
        isAnonymous: true,
        wantsFollowup: false,
        reporterName: '',
        reporterPhone: '',
        reporterEmail: '',
      });
    } else {
      onChange({ isAnonymous: false });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">Your anonymity & contact details</h2>
        <p className="text-sm text-slate-500 mb-5">
          By default, your report is anonymous. You choose what, if anything, to share.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleAnonymousChange(true)}
          className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 ${
            data.isAnonymous
              ? 'border-teal-500 bg-teal-50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <EyeOff className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Stay anonymous</p>
            <p className="text-xs text-slate-500 mt-0.5">No personal details required. Recommended.</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleAnonymousChange(false)}
          className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 ${
            !data.isAnonymous
              ? 'border-teal-500 bg-teal-50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Provide my details</p>
            <p className="text-xs text-slate-500 mt-0.5">Share contact info for possible follow-up.</p>
          </div>
        </button>
      </div>

      {!data.isAnonymous && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.wantsFollowup}
                onChange={(e) => onChange({ wantsFollowup: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm font-medium text-slate-700">I want a follow-up from the designated officer</span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Full name (optional)</label>
              <input
                type="text"
                placeholder="Your name"
                value={data.reporterName}
                onChange={(e) => onChange({ reporterName: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email address (optional)</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={data.reporterEmail}
                onChange={(e) => onChange({ reporterEmail: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Phone number (optional)</label>
              <input
                type="tel"
                placeholder="e.g., 08012345678"
                value={data.reporterPhone}
                onChange={(e) => onChange({ reporterPhone: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <label
          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
            data.consentGiven ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white'
          }`}
        >
          <input
            type="checkbox"
            checked={data.consentGiven}
            onChange={(e) => onChange({ consentGiven: e.target.checked })}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <div>
            <p className="text-sm font-medium text-slate-800">
              I consent to this report being processed <span className="text-red-500">*</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              I understand that the information I provide will be used to route this report to the designated institutional
              authority, and that I can choose to remain anonymous. I acknowledge that making a false report is a serious
              matter.
            </p>
          </div>
        </label>
      </div>

      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Important:</strong> Deliberately making a false report can have serious consequences. Please ensure
          the information you provide is truthful to the best of your knowledge.
        </p>
      </div>

      <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
        <Lock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          Your contact details (if provided) will only be shared with the designated officer at your institution and
          will not be stored in a public database. All data is transmitted securely.
        </p>
      </div>
    </div>
  );
}
