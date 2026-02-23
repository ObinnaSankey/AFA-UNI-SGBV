import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Copy, ArrowRight, BookOpen, Phone, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import Layout from '../components/Layout';

interface ConfirmationState {
  trackingId: string;
  wantsFollowup: boolean;
  isAnonymous: boolean;
  reporterEmail?: string;
}

export default function Confirmation() {
  const location = useLocation();
  const state = location.state as ConfirmationState | null;
  const [copied, setCopied] = useState(false);

  const trackingId = state?.trackingId || 'UNI-00000000-000000';

  const copyTracking = () => {
    navigator.clipboard.writeText(trackingId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Report submitted successfully</h1>
          <p className="text-slate-500 text-sm">
            Your report has been securely routed to the designated officer at your institution.
          </p>
        </div>

        <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-6 mb-6 text-center">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Your Tracking ID</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl font-mono font-bold text-teal-800 tracking-wide">{trackingId}</span>
            <button
              onClick={copyTracking}
              title="Copy Tracking ID"
              className="p-2 rounded-lg hover:bg-teal-100 text-teal-600 transition-colors"
            >
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-teal-600 mt-2">Save this Tracking ID. You will need it to follow up.</p>
        </div>

        {state?.wantsFollowup && state?.reporterEmail && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
            <ShieldCheck className="w-4 h-4 inline-block mr-1.5 text-blue-600" />
            You may be contacted at <strong>{state.reporterEmail}</strong> for a follow-up by the designated officer.
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-slate-800 mb-4">What to do next</h2>
          <ul className="space-y-3">
            {[
              {
                num: '1',
                text: 'Save your Tracking ID',
                detail: 'Write it down or screenshot it. You will need it to follow up on your report.',
              },
              {
                num: '2',
                text: 'Visit the Gender Center or designated authority',
                detail: 'If you feel comfortable, you can take your Tracking ID to the Gender Center or designated office for in-person support.',
              },
              {
                num: '3',
                text: 'Reach out for support',
                detail: 'Counselling and support services are available. See the EduDeck for contacts and resources.',
              },
              {
                num: '4',
                text: 'Keep records (if safe)',
                detail: 'Preserve any messages, screenshots, or other evidence related to the incident in a safe place.',
              },
            ].map((item) => (
              <li key={item.num} className="flex gap-3">
                <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {item.num}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.text}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 mb-1">Emergency & Support Contacts</p>
              <ul className="text-xs text-red-700 space-y-1">
                <li>Emergency Services: <strong>112</strong></li>
                <li>NAPTIP Hotline (Trafficking & SGBV): <strong>0800 888 0000</strong></li>
                <li>Mirabel Centre (Lagos): <strong>08000 72 4357</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/edudeck"
            className="flex-1 flex items-center justify-center gap-2 bg-teal-50 text-teal-700 font-medium px-5 py-3 rounded-xl hover:bg-teal-100 transition-colors text-sm border border-teal-200"
          >
            <BookOpen className="w-4 h-4" />
            Visit EduDeck
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-700 font-medium px-5 py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm border border-slate-200"
          >
            Return to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
