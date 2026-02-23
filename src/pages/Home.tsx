import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  BookOpen,
  Lock,
  UserCheck,
  ArrowRight,
  EyeOff,
  Clock,
  FileText,
} from 'lucide-react';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <section className="relative bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg?auto=compress&cs=tinysrgb&w=1200')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-800/80 to-teal-700/60" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3.5 py-1.5 rounded-full mb-6 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Safe • Confidential • Secure
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5">
              You are not alone.
              <span className="block text-teal-200 mt-1">Your voice matters.</span>
            </h1>
            <p className="text-base sm:text-lg text-teal-100 leading-relaxed mb-8 max-w-xl">
              This platform provides a safe, confidential way for students and staff to report
              sexual harassment and gender-based violence. Reports are routed directly to your faculty's designated
              officer.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/report"
                className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-teal-50 transition-all duration-200 shadow-lg hover:shadow-xl text-base"
              >
                Report an Incident
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/edudeck"
                className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/25 transition-all duration-200 border border-white/30 text-base"
              >
                <BookOpen className="w-4 h-4" />
                Learn (EduDeck)
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-amber-50 border-y border-amber-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-start gap-3">
          <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Confidentiality Notice:</strong> All reports are treated with strict confidentiality. By default,
            you may report anonymously — your personal information is never required. Any details you choose to share
            are used only to route your report to the appropriate institutional authority.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">How it works</h2>
        <p className="text-slate-500 text-center text-sm mb-10 max-w-lg mx-auto">
          Reporting takes just a few minutes. You are in full control of what you share.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: <FileText className="w-5 h-5" />,
              step: '01',
              title: 'Select your faculty',
              desc: 'Choose your faculty from the list so your report reaches the right office.',
            },
            {
              icon: <FileText className="w-5 h-5" />,
              step: '02',
              title: 'Describe the incident',
              desc: 'Share what happened — as much or as little as you are comfortable with.',
            },
            {
              icon: <EyeOff className="w-5 h-5" />,
              step: '03',
              title: 'Choose your anonymity',
              desc: 'Stay anonymous or provide contact details if you want a follow-up.',
            },
            {
              icon: <Clock className="w-5 h-5" />,
              step: '04',
              title: 'Receive your Tracking ID',
              desc: 'Your report is sent securely. Keep your Tracking ID for follow-up.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <span className="text-2xl font-black text-slate-100">{item.step}</span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2 text-sm">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">Why use this platform?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <EyeOff className="w-6 h-6 text-teal-600" />,
                title: 'Anonymous by default',
                desc: 'You never have to share your name. Anonymity is the default — you opt in to sharing contact details.',
              },
              {
                icon: <Lock className="w-6 h-6 text-teal-600" />,
                title: 'Secure & private',
                desc: 'Reports are transmitted over HTTPS. IP addresses are not stored. Sensitive data stays protected.',
              },
              {
                icon: <UserCheck className="w-6 h-6 text-teal-600" />,
                title: 'Routed to the right people',
                desc: 'Your report goes directly to your faculty\'s designated officer or Gender Center.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-teal-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to report?</h2>
          <p className="text-teal-100 mb-7 max-w-lg mx-auto text-sm leading-relaxed">
            It takes just a few minutes. Your report will be handled with care and confidentiality.
          </p>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-teal-50 transition-all duration-200 shadow-md text-base"
          >
            Start Report
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
