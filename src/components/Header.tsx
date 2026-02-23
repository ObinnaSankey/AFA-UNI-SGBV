import { Link, useLocation } from 'react-router-dom';
import { Shield, BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-800 text-base leading-none block">Uni SGBV</span>
            <span className="text-xs text-slate-500 leading-none">Reporting Platform</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/report"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/report')
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Report Incident
          </Link>
          <Link
            to="/edudeck"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/edudeck')
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            EduDeck
          </Link>
        </nav>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          <Link
            to="/report"
            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
            onClick={() => setMenuOpen(false)}
          >
            Report an Incident
          </Link>
          <Link
            to="/edudeck"
            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
            onClick={() => setMenuOpen(false)}
          >
            EduDeck (Education Hub)
          </Link>
        </div>
      )}
    </header>
  );
}
