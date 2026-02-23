import type { ReportFormData, IncidentType, LocationType } from '../lib/types';

interface Props {
  data: ReportFormData;
  onChange: (data: Partial<ReportFormData>) => void;
}

const INCIDENT_TYPES: { value: IncidentType; label: string; desc: string }[] = [
  { value: 'sexual_harassment', label: 'Sexual Harassment', desc: 'Unwanted sexual advances, comments, or conduct' },
  { value: 'attempted_assault', label: 'Attempted Assault', desc: 'Attempted physical sexual violence' },
  { value: 'assault', label: 'Assault', desc: 'Physical sexual violence' },
  { value: 'intimidation_retaliation', label: 'Intimidation / Retaliation', desc: 'Threats, coercion, or reprisals' },
  { value: 'other', label: 'Other SGBV', desc: 'Other form of gender-based violence' },
];

const LOCATION_TYPES: { value: LocationType; label: string }[] = [
  { value: 'on_campus', label: 'On Campus' },
  { value: 'off_campus', label: 'Off Campus' },
  { value: 'online', label: 'Online / Digital' },
  { value: 'other', label: 'Other' },
];

export default function Step2Details({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">Describe the incident</h2>
        <p className="text-sm text-slate-500 mb-5">
          Share as much or as little as you are comfortable with. All fields except incident type are optional.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Type of incident <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 gap-2">
          {INCIDENT_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange({ incidentType: t.value })}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-150 ${
                data.incidentType === t.value
                  ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200'
                  : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 transition-colors ${
                  data.incidentType === t.value ? 'border-teal-600 bg-teal-600' : 'border-slate-300'
                }`}
              />
              <div>
                <p className="text-sm font-medium text-slate-800">{t.label}</p>
                <p className="text-xs text-slate-500">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Where did it happen? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LOCATION_TYPES.map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => onChange({ locationType: l.value })}
              className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
                data.locationType === l.value
                  ? 'border-teal-500 bg-teal-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Optional: Specific location (e.g., Faculty of Law, Block C)"
          value={data.locationDetail}
          onChange={(e) => onChange({ locationDetail: e.target.value })}
          className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          When did it happen? <span className="text-slate-400 font-normal">(approximate is fine)</span>
        </label>
        <input
          type="text"
          placeholder="e.g., 'Last week', 'June 2025', 'Around 3pm on a Friday'"
          value={data.incidentDate}
          onChange={(e) => onChange({ incidentDate: e.target.value })}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          What happened? <span className="text-slate-400 font-normal">(describe in your own words)</span>
        </label>
        <textarea
          rows={5}
          placeholder="Please describe the incident. Include any details you feel comfortable sharing..."
          value={data.narrative}
          onChange={(e) => onChange({ narrative: e.target.value })}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-slate-400 mt-1">
          This is sent directly to the designated officer. It is not stored in a database by default.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          People involved <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={2}
          placeholder="If you know names, roles, or departments of those involved, you may include them here."
          value={data.peopleInvolved}
          onChange={(e) => onChange({ peopleInvolved: e.target.value })}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
}
