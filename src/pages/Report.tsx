import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import Step2Details from '../report/Step2Details';
import Step3Contact from '../report/Step3Contact';
import Step4Evidence from '../report/Step4Evidence';
import type { ReportFormData } from '../lib/types';
import { generateTrackingId } from '../lib/utils';

const STEP_LABELS = ['Incident Details', 'Your Anonymity', 'Evidence'];

const DEFAULT_FORM: ReportFormData = {
  incidentType: '',
  locationType: '',
  locationDetail: '',
  incidentDate: '',
  narrative: '',
  peopleInvolved: '',
  isAnonymous: true,
  wantsFollowup: false,
  reporterName: '',
  reporterPhone: '',
  reporterEmail: '',
  consentGiven: false,
  files: [],
  skipEvidence: false,
};

export default function Report() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ReportFormData>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const update = (partial: Partial<ReportFormData>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  };

  const canProceed = (): boolean => {
    if (step === 1) return !!form.incidentType && !!form.locationType;
    if (step === 2) return form.consentGiven;
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    setSubmitting(true);
    setError('');

    try {
      const trackingId = generateTrackingId();

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const formData = new FormData();
      formData.append('trackingId', trackingId);
      formData.append('incidentType', form.incidentType);
      formData.append('locationType', form.locationType);
      formData.append('locationDetail', form.locationDetail);
      formData.append('incidentDate', form.incidentDate);
      formData.append('narrative', form.narrative);
      formData.append('peopleInvolved', form.peopleInvolved);
      formData.append('isAnonymous', String(form.isAnonymous));
      formData.append('wantsFollowup', String(form.wantsFollowup));
      formData.append('reporterName', form.reporterName);
      formData.append('reporterPhone', form.reporterPhone);
      formData.append('reporterEmail', form.reporterEmail);
      formData.append('consentGiven', String(form.consentGiven));

      form.files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch(`${supabaseUrl}/functions/v1/submit-report`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${supabaseAnonKey}` },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed. Please try again.');
      }

      navigate('/confirmation', {
        state: {
          trackingId,
          wantsFollowup: form.wantsFollowup,
          isAnonymous: form.isAnonymous,
          reporterEmail: form.reporterEmail,
        },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Report an Incident</h1>
          <p className="text-sm text-slate-500">
            Your report is confidential. You may remain anonymous throughout.
          </p>
        </div>

        <div className="mb-8">
          <ProgressBar currentStep={step} totalSteps={3} labels={STEP_LABELS} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          {step === 1 && <Step2Details data={form} onChange={update} />}
          {step === 2 && <Step3Contact data={form} onChange={update} />}
          {step === 3 && <Step4Evidence data={form} onChange={update} />}

          {error && (
            <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handleBack}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                step === 1
                  ? 'opacity-0 pointer-events-none'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  canProceed()
                    ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm hover:shadow-md'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !form.consentGiven}
                className={`flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all ${
                  !submitting && form.consentGiven
                    ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm hover:shadow-md'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Report
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5 leading-relaxed">
          By submitting, you confirm the report details are truthful. All submissions use HTTPS encryption.
          <br />IP addresses are not stored. Your privacy is protected.
        </p>
      </div>
    </Layout>
  );
}
