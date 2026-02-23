import { useState, useEffect } from 'react';
import { Search, Building2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { University, ReportFormData } from '../lib/types';

interface Props {
  data: ReportFormData;
  onChange: (data: Partial<ReportFormData>) => void;
}

export default function Step1University({ data, onChange }: Props) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('universities')
      .select('*')
      .eq('is_active', true)
      .order('name')
      .then(({ data: unis, error: err }) => {
        if (err) setError('Could not load faculties. Please refresh and try again.');
        else setUniversities(unis || []);
        setLoading(false);
      });
  }, []);

  const filtered = universities.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.short_code.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (u: University) => {
    onChange({
      universityId: u.id,
      universityName: u.name,
      universityShortCode: u.short_code,
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800 mb-1">Select your faculty</h2>
      <p className="text-sm text-slate-500 mb-5">
        Your report will be securely routed to the designated officer for your faculty.
      </p>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or abbreviation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-sm text-slate-500">Loading faculties...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
      )}

      {!loading && !error && (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No faculties found matching "{query}".</p>
          ) : (
            filtered.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleSelect(u)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-150 ${
                  data.universityId === u.id
                    ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200'
                    : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/50'
                }`}
              >
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.short_code}</p>
                </div>
                {data.universityId === u.id && (
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                )}
              </button>
            ))
          )}
        </div>
      )}

      {!data.universityId && (
        <p className="text-xs text-slate-400 mt-3 text-center">
          Can't find your faculty?{' '}
          <a href="mailto:support@uni-sgbv.org" className="text-teal-600 hover:underline">
            Contact support to add it.
          </a>
        </p>
      )}
    </div>
  );
}
