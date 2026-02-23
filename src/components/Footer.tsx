import { Shield, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Uni SGBV Platform</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A safe, confidential space for reporting sexual and gender-based violence at your institution.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/report" className="hover:text-teal-400 transition-colors">Report an Incident</Link></li>
              <li><Link to="/edudeck" className="hover:text-teal-400 transition-colors">EduDeck</Link></li>
              <li><Link to="/qr" className="hover:text-teal-400 transition-colors">Quick Report (QR)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">Emergency Contacts</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span>Emergency Services: <strong className="text-white">112</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span>NAPTIP Hotline: <strong className="text-white">0800 888 0000</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span>Platform Support: <strong className="text-white">support@uni-sgbv.org</strong></span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Uni SGBV Reporting Platform. All submissions are confidential.</p>
          <p>This platform does not store IP addresses or identifying information by default.</p>
        </div>
      </div>
    </footer>
  );
}
