import { useState, useEffect } from 'react';
import { Plus, Edit2, Save, X, Trash2, Building2, CheckCircle, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { University } from '../lib/types';

export default function UniversityManager() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const emptyForm = { name: '', short_code: '', routing_email_1: '', routing_email_2: '', mode: 'centralized' as const, is_active: true };
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const { data } = await supabase.from('universities').select('*').order('name');
    setUniversities(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (u: University) => {
    setEditing(u.id);
    setForm({ name: u.name, short_code: u.short_code, routing_email_1: u.routing_email_1, routing_email_2: u.routing_email_2 || '', mode: u.mode, is_active: u.is_active });
    setAdding(false);
  };

  const cancelEdit = () => {
    setEditing(null);
    setAdding(false);
    setForm(emptyForm);
  };

  const saveEdit = async (id: string) => {
    if (!form.name || !form.short_code || !form.routing_email_1) {
      setSaveStatus('error');
      return;
    }
    const { error } = await supabase.from('universities').update({
      name: form.name,
      short_code: form.short_code.toUpperCase(),
      routing_email_1: form.routing_email_1,
      routing_email_2: form.routing_email_2 || null,
      mode: form.mode,
      is_active: form.is_active,
    }).eq('id', id);
    if (!error) {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
      setEditing(null);
      load();
    }
  };

  const addNew = async () => {
    if (!form.name || !form.short_code || !form.routing_email_1) {
      setSaveStatus('error');
      return;
    }
    const { error } = await supabase.from('universities').insert({
      name: form.name,
      short_code: form.short_code.toUpperCase(),
      routing_email_1: form.routing_email_1,
      routing_email_2: form.routing_email_2 || null,
      mode: form.mode,
      is_active: form.is_active,
    });
    if (!error) {
      setAdding(false);
      setForm(emptyForm);
      load();
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('universities').update({ is_active: !current }).eq('id', id);
    load();
  };

  const deleteUniversity = async (id: string) => {
    if (!confirm('Are you sure? This will remove the faculty from the platform.')) return;
    await supabase.from('universities').delete().eq('id', id);
    load();
  };

  const FormFields = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-slate-600 mb-1">Faculty Name *</label>
        <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Faculty of Social Sciences" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Short Code * (for Tracking ID)</label>
        <input type="text" value={form.short_code} onChange={e => setForm(f => ({ ...f, short_code: e.target.value.toUpperCase() }))}
          placeholder="UNILAG" maxLength={12} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Mode</label>
        <select value={form.mode} onChange={e => setForm(f => ({ ...f, mode: e.target.value as 'centralized' | 'embedded' }))}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option value="centralized">Centralized</option>
          <option value="embedded">Embedded</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Primary Routing Email *</label>
        <input type="email" value={form.routing_email_1} onChange={e => setForm(f => ({ ...f, routing_email_1: e.target.value }))}
          placeholder="gendercenter@institution.edu.ng" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Secondary Routing Email (optional)</label>
        <input type="email" value={form.routing_email_2} onChange={e => setForm(f => ({ ...f, routing_email_2: e.target.value }))}
          placeholder="dean@institution.edu.ng" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Faculties</h2>
          <p className="text-sm text-slate-500">{universities.length} faculties configured</p>
        </div>
        {!adding && (
          <button onClick={() => { setAdding(true); setEditing(null); setForm(emptyForm); }}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Faculty
          </button>
        )}
      </div>

      {saveStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm text-red-700">
          <AlertTriangle className="w-4 h-4" /> Please fill in all required fields (name, short code, primary email).
        </div>
      )}
      {saveStatus === 'saved' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="w-4 h-4" /> Faculty saved successfully.
        </div>
      )}

      {adding && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 mb-4">
          <h3 className="font-semibold text-slate-800 text-sm mb-1">Add new faculty</h3>
          <FormFields />
          <div className="flex items-center gap-2 mt-4">
            <button onClick={addNew} className="flex items-center gap-1.5 bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors">
              <Save className="w-4 h-4" /> Save
            </button>
            <button onClick={cancelEdit} className="flex items-center gap-1.5 text-slate-600 px-4 py-2 rounded-xl text-sm hover:bg-slate-100 transition-colors">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {universities.map((u) => (
            <div key={u.id} className={`border rounded-xl overflow-hidden transition-all ${editing === u.id ? 'border-teal-300 bg-teal-50' : 'border-slate-200 bg-white'}`}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 text-sm truncate">{u.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{u.short_code} · {u.routing_email_1}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => toggleActive(u.id, u.is_active)} title={u.is_active ? 'Deactivate' : 'Activate'}
                      className={`p-1.5 rounded-lg transition-colors ${u.is_active ? 'text-teal-600 hover:bg-teal-50' : 'text-slate-400 hover:bg-slate-50'}`}>
                      {u.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <button onClick={() => startEdit(u)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteUniversity(u.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {editing === u.id && (
                  <>
                    <FormFields />
                    <div className="flex items-center gap-2 mt-4">
                      <button onClick={() => saveEdit(u.id)} className="flex items-center gap-1.5 bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors">
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                      <button onClick={cancelEdit} className="flex items-center gap-1.5 text-slate-600 px-4 py-2 rounded-xl text-sm hover:bg-slate-100 transition-colors">
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
