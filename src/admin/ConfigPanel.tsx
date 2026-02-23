import { useState, useEffect } from 'react';
import { Save, CheckCircle, Info, Mail, Database, Globe, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

type ConfigMap = Record<string, string>;

export default function ConfigPanel() {
  const [config, setConfig] = useState<ConfigMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('app_config').select('key, value').then(({ data }) => {
      if (data) {
        const map: ConfigMap = {};
        data.forEach((row) => { map[row.key] = row.value; });
        setConfig(map);
      }
      setLoading(false);
    });
  }, []);

  const set = (key: string, value: string) => setConfig((prev) => ({ ...prev, [key]: value }));

  const saveAll = async () => {
    setSaving(true);
    const updates = Object.entries(config).map(([key, value]) =>
      supabase.from('app_config').update({ value }).eq('key', key)
    );
    await Promise.all(updates);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-5">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <div className="text-slate-500">{icon}</div>
        <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );

  const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Platform Configuration</h2>
          <p className="text-sm text-slate-500">Configure storage, email routing, and deployment settings.</p>
        </div>
        <button
          onClick={saveAll}
          disabled={saving}
          className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-60"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : saved ? (
            <><CheckCircle className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-2.5 text-sm text-amber-800">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p>Changes take effect immediately. Ensure email settings are correct before saving to avoid missed reports.</p>
      </div>

      <Section title="General" icon={<Globe className="w-4 h-4" />}>
        <Field label="Platform Name" hint="Shown in the header and emails.">
          <input type="text" value={config.platform_name || ''} onChange={e => set('platform_name', e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </Field>
        <Field label="Support Email" hint="Shown in the footer for platform support queries.">
          <input type="email" value={config.support_email || ''} onChange={e => set('support_email', e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </Field>
        <Field label="Institution Name" hint="Shown in emails and on the confirmation page.">
          <input type="text" value={config.institution_name || ''} onChange={e => set('institution_name', e.target.value)}
            placeholder="University of Example" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </Field>
      </Section>

      <Section title="Data Storage" icon={<Database className="w-4 h-4" />}>
        <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 mb-3">
          <Info className="w-3.5 h-3.5 inline-block mr-1" />
          Default is "Minimal Metadata" — narrative text is emailed but not stored in the database. Choose "None" for maximum privacy.
        </div>
        <Field label="Storage Mode">
          <select value={config.storage_mode || 'minimal_metadata'} onChange={e => set('storage_mode', e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="none">None (email only, no database storage)</option>
            <option value="minimal_metadata">Minimal Metadata (timestamp, uni, type, Tracking ID)</option>
            <option value="full">Full (includes narrative)</option>
          </select>
        </Field>
        <Field label="Store Narrative Text" hint="Only applies if storage mode is not 'None'.">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => set('store_narrative', config.store_narrative === 'true' ? 'false' : 'true')}
              className={`relative w-10 h-5 rounded-full transition-colors ${config.store_narrative === 'true' ? 'bg-teal-600' : 'bg-slate-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${config.store_narrative === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm text-slate-600">{config.store_narrative === 'true' ? 'Enabled (narrative stored)' : 'Disabled (narrative not stored)'}</span>
          </div>
        </Field>
        <Field label="Max Submissions Per Hour (per session)" hint="Rate limiting to prevent spam.">
          <input type="number" min={1} max={50} value={config.rate_limit_per_hour || '5'} onChange={e => set('rate_limit_per_hour', e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </Field>
      </Section>

      <Section title="Email (SMTP) Configuration" icon={<Mail className="w-4 h-4" />}>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 mb-3">
          Configure your SMTP settings for report delivery emails. If using Resend or SendGrid, set the API key as the SMTP password and use their SMTP host/port.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="SMTP Host">
            <input type="text" value={config.smtp_host || ''} onChange={e => set('smtp_host', e.target.value)}
              placeholder="smtp.gmail.com" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </Field>
          <Field label="SMTP Port">
            <input type="text" value={config.smtp_port || '587'} onChange={e => set('smtp_port', e.target.value)}
              placeholder="587" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </Field>
          <Field label="SMTP Username">
            <input type="text" value={config.smtp_user || ''} onChange={e => set('smtp_user', e.target.value)}
              placeholder="noreply@uni-sgbv.org" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </Field>
          <Field label="SMTP Password">
            <input type="password" value={config.smtp_pass || ''} onChange={e => set('smtp_pass', e.target.value)}
              placeholder="••••••••••" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </Field>
        </div>
        <Field label="Sender Email (From address)">
          <input type="email" value={config.smtp_from || ''} onChange={e => set('smtp_from', e.target.value)}
            placeholder="noreply@uni-sgbv.org" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </Field>
      </Section>

      <Section title="Report Routing" icon={<Mail className="w-4 h-4" />}>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 mb-3">
          Reports are emailed to these addresses when submitted. At least one address is required for delivery.
        </div>
        <Field label="Primary Routing Email" hint="Designated officer or Gender Center address.">
          <input type="email" value={config.routing_email_1 || ''} onChange={e => set('routing_email_1', e.target.value)}
            placeholder="gendercenter@institution.edu.ng" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </Field>
        <Field label="Secondary Routing Email (optional)" hint="Backup recipient — e.g. Dean of Students office.">
          <input type="email" value={config.routing_email_2 || ''} onChange={e => set('routing_email_2', e.target.value)}
            placeholder="deanofstudents@institution.edu.ng" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </Field>
      </Section>

      <Section title="Google Sheets Logging (Optional)" icon={<Database className="w-4 h-4" />}>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 mb-3">
          Enable lightweight logging to Google Sheets. Only minimal metadata is logged (no narrative unless enabled above).
          Requires a Google Service Account with Editor access to the spreadsheet.
        </div>
        <Field label="Enable Google Sheets Logging">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => set('sheets_enabled', config.sheets_enabled === 'true' ? 'false' : 'true')}
              className={`relative w-10 h-5 rounded-full transition-colors ${config.sheets_enabled === 'true' ? 'bg-teal-600' : 'bg-slate-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${config.sheets_enabled === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm text-slate-600">{config.sheets_enabled === 'true' ? 'Enabled' : 'Disabled'}</span>
          </div>
        </Field>
        {config.sheets_enabled === 'true' && (
          <>
            <Field label="Google Sheets ID" hint="The ID from the spreadsheet URL: /d/{SHEET_ID}/edit">
              <input type="text" value={config.sheets_id || ''} onChange={e => set('sheets_id', e.target.value)}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </Field>
            <Field label="Service Account Credentials (JSON)" hint="Paste the full JSON content of your service account key file.">
              <textarea rows={4} value={config.sheets_credentials || ''} onChange={e => set('sheets_credentials', e.target.value)}
                placeholder='{"type": "service_account", "project_id": "...", "private_key": "...", ...}'
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
            </Field>
          </>
        )}
      </Section>
    </div>
  );
}
