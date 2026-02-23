import { useState, useEffect } from 'react';
import { RefreshCw, FileText, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatIncidentType, formatLocationType } from '../lib/utils';

interface ReportRow {
  id: string;
  tracking_id: string;
  incident_type: string;
  location_type: string;
  wants_followup: boolean;
  consent_given: boolean;
  has_attachment: boolean;
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700',
  received: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-teal-100 text-teal-700',
  resolved: 'bg-green-100 text-green-700',
};

export default function ReportsPanel() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    setReports((data as ReportRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await supabase.from('reports').update({ status }).eq('id', id);
    setUpdating(null);
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Reports Log</h2>
          <p className="text-sm text-slate-500">Minimal metadata only. Narrative not stored by default.</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No reports yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-mono text-sm font-semibold text-teal-700">{r.tracking_id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[r.status] || 'bg-slate-100 text-slate-600'}`}>
                      {r.status.replace('_', ' ')}
                    </span>
                    {r.wants_followup && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">Follow-up requested</span>
                    )}
                    {r.has_attachment && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Has attachment</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <span>{formatIncidentType(r.incident_type)}</span>
                    <span>{formatLocationType(r.location_type)}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    disabled={updating === r.id}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="received">Received</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
