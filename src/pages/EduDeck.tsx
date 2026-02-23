import { useState } from 'react';
import {
  BookOpen,
  ShieldCheck,
  Info,
  HelpCircle,
  Phone,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Users,
  Scale,
  Heart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const TABS = [
  { id: 'what', label: 'What is SGBV?', icon: <Info className="w-4 h-4" /> },
  { id: 'rights', label: 'Your Rights', icon: <Scale className="w-4 h-4" /> },
  { id: 'howworks', label: 'How Reporting Works', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 'safety', label: 'Safety & Help', icon: <Heart className="w-4 h-4" /> },
  { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
];

const FAQ_ITEMS = [
  {
    q: 'Can I really report anonymously?',
    a: 'Yes. Anonymity is the default. You are never required to provide your name, phone number, or email. The platform is designed so you can submit a complete report with zero personal details.',
  },
  {
    q: 'What happens after I submit a report?',
    a: 'Your report is immediately routed by secure email to the designated Gender Center or authority at your university. The receiving officer is obligated to handle it confidentially. If you provided contact details and requested a follow-up, they may reach out to you.',
  },
  {
    q: 'Is my IP address stored?',
    a: 'No. The Uni SGBV platform does not store IP addresses in its application database. While infrastructure providers may log IPs at a network level, this is not accessible through the application or visible to any institutional officer.',
  },
  {
    q: 'What is a Tracking ID and how do I use it?',
    a: 'Your Tracking ID (format: UNI-SOCSCI-20250601-AB1234) is a unique reference for your report. You can quote it if you visit the Gender Center in person, or use it to ask for a status update. Save it somewhere safe.',
  },
  {
    q: 'Can I submit a report on behalf of someone else?',
    a: 'Yes. You can report an incident you witnessed or that was told to you. Please make clear in the narrative that you are reporting on behalf of another person. The designated officer will follow appropriate procedures.',
  },
  {
    q: 'What if the perpetrator is a lecturer or senior staff member?',
    a: 'Nigerian universities are required by law (and institutional policy) to investigate reports regardless of the status or seniority of the accused. You have the right to protection from retaliation. If you fear bias, you may also report to external bodies such as NUC or NAPTIP.',
  },
  {
    q: 'What if I am not a student — can I still report?',
    a: 'Yes. This platform is for both students and staff. If you are a member of staff who has experienced or witnessed SGBV, you are equally entitled to report and to receive protection.',
  },
  {
    q: 'Are there consequences for false reporting?',
    a: 'Making a deliberately false report is a serious matter and may have legal and institutional consequences. This platform requires you to confirm that the information you provide is truthful. If you are uncertain about details, you can state this in your narrative.',
  },
  {
    q: 'I am afraid of being identified. What should I do?',
    a: 'Use the anonymous option. Do not upload files if they could identify you. Avoid mentioning details that could be used to identify you if you wish to remain anonymous. The platform is designed so that anonymous reports provide no identifying information to the receiving officer.',
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-medium text-slate-800 pr-4">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function EduDeck() {
  const [activeTab, setActiveTab] = useState('what');

  return (
    <Layout>
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-medium px-3.5 py-1.5 rounded-full mb-4 border border-white/20">
            <BookOpen className="w-3.5 h-3.5" />
            Education Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">EduDeck</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Practical information on your rights, how SGBV reporting works, and where to find urgent help.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-teal-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          {activeTab === 'what' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">What is Sexual and Gender-Based Violence (SGBV)?</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sexual and Gender-Based Violence (SGBV) refers to any harmful act directed at a person on the basis of their gender. It includes a wide range of violations of human rights and is never the fault of the person who experiences it.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Sexual Harassment', desc: 'Unwelcome sexual advances, requests for sexual favours, and other verbal or physical conduct of a sexual nature — including in academic or work settings.' },
                  { title: 'Sexual Assault', desc: 'Any non-consensual sexual act or behaviour. This includes attempted assault and forms of coercion. Consent must be freely given, reversible, and informed.' },
                  { title: 'Intimidation & Retaliation', desc: 'Threats, coercion, or negative consequences imposed on someone who has reported SGBV or refused sexual advances — including academic or career consequences.' },
                  { title: 'Online / Cyber SGBV', desc: 'Harassment, non-consensual sharing of intimate images, stalking, or threats carried out through digital platforms, social media, or messaging apps.' },
                  { title: 'Gender-Based Discrimination', desc: 'Unequal treatment in academic or professional settings based on gender, including discriminatory policies that disadvantage women or gender minorities.' },
                  { title: 'Domestic & Intimate Partner Violence', desc: 'Physical, sexual, or emotional abuse by a current or former partner. This also affects students and staff and is covered by university support services.' },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <h3 className="font-semibold text-slate-800 text-sm mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <p className="text-sm text-teal-800 font-medium mb-1">Important to know</p>
                <ul className="space-y-1.5 text-xs text-teal-700">
                  <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> SGBV can happen to anyone — regardless of gender, age, religion, or background.</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> It is never the victim's fault. No clothing, behaviour, or relationship justifies SGBV.</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> SGBV thrives on silence. Reporting it helps protect yourself and others in your community.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'rights' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">Your Rights and Protections</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                As a student or staff member in a Nigerian university, you have legal and institutional rights that protect you from SGBV and retaliation.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: <Scale className="w-5 h-5 text-teal-600" />,
                    title: 'Right to a Safe Learning & Work Environment',
                    desc: 'Under Nigerian law and NUC policy, universities are required to provide a safe environment free from sexual harassment and gender-based discrimination. This is not optional — it is legally mandated.',
                  },
                  {
                    icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
                    title: 'Right to Report Without Fear of Retaliation',
                    desc: 'Retaliation against a person who makes a genuine report — including grade manipulation, dismissal, or threats — is prohibited. The institution must protect you from such retaliation.',
                  },
                  {
                    icon: <Users className="w-5 h-5 text-teal-600" />,
                    title: 'Right to Confidentiality',
                    desc: 'Your report is confidential. Designated officers are bound by institutional policy to handle reports with discretion and not to disclose your identity without your consent (except where legally required for safety).',
                  },
                  {
                    icon: <Heart className="w-5 h-5 text-teal-600" />,
                    title: 'Right to Support Services',
                    desc: 'Universities must provide access to counselling, medical referrals, and support services. Ask the Gender Center about what support is available at your institution.',
                  },
                  {
                    icon: <CheckCircle className="w-5 h-5 text-teal-600" />,
                    title: 'Right to an Investigation',
                    desc: 'When you make a formal report, you are entitled to a fair and timely investigation. The accused is also entitled to due process. You may ask the designated officer for updates on your Tracking ID.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>External bodies:</strong> If you believe your institution is not handling your report properly, you may escalate to the National Universities Commission (NUC), the police, or NAPTIP. You always retain the right to pursue legal action.
              </div>
            </div>
          )}

          {activeTab === 'howworks' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">How the Reporting Platform Works</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                The Uni SGBV platform is designed to be simple, safe, and transparent. Here is exactly what happens when you submit a report.
              </p>

              <div className="space-y-4">
                {[
                  { step: '01', title: 'You submit a report', desc: 'Fill in the form (2–4 steps). You can remain completely anonymous. Only the incident type and location are required. Everything else is optional.' },
                  { step: '02', title: 'Tracking ID is generated', desc: 'Immediately upon submission, a unique Tracking ID is generated (e.g., UNI-SOCSCI-20250601-AB1234). Save this — it is your reference for this report.' },
                  { step: '03', title: 'Report is routed securely', desc: 'A structured email is sent to the designated officer(s) for your faculty. This is the Gender Center or other designated authority. The email contains your report details.' },
                  { step: '04', title: 'Designated officer receives and acts', desc: 'The designated officer is obligated to acknowledge and act on the report per their institutional policy. They will follow up using your Tracking ID if you provided contact details and requested a follow-up.' },
                  { step: '05', title: 'You follow up if needed', desc: 'You can visit the Gender Center in person with your Tracking ID. You can also use the Tracking ID to ask for a status update via email or phone.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {item.step}
                    </div>
                    <div className="pt-1.5">
                      <h3 className="font-semibold text-slate-800 text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-slate-700 text-sm">Privacy & data defaults</h3>
                <ul className="space-y-1.5 text-xs text-slate-500">
                  <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" /> IP addresses are not stored in the application database.</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" /> By default, narrative text is sent by email but not stored in a database.</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" /> Only minimal metadata (timestamp, university, incident type, Tracking ID) may be logged.</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" /> All data is transmitted using HTTPS encryption.</li>
                </ul>
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors text-sm"
                >
                  Ready to report? Start here
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">Safety Planning & Urgent Help</h2>

              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-red-800">If you are in immediate danger</h3>
                </div>
                <p className="text-sm text-red-700 mb-3">Call emergency services or campus security immediately. Do not wait.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: 'Emergency Services', value: '112' },
                    { label: 'Police Emergency', value: '199' },
                    { label: 'Campus Security', value: 'Your campus number' },
                    { label: 'NAPTIP Hotline', value: '0800 888 0000' },
                  ].map((c) => (
                    <div key={c.label} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-red-100">
                      <Phone className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500">{c.label}</p>
                        <p className="text-sm font-bold text-slate-800">{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-4">Support Organisations</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Mirabel Centre', city: 'Lagos', service: 'Sexual assault referral — medical care, counselling, forensic evidence', contact: '08000 72 4357' },
                    { name: 'NAPTIP', city: 'Nigeria-wide', service: 'Trafficking, exploitation and SGBV — investigations and victim support', contact: '0800 888 0000' },
                    { name: 'Project Alert on Violence Against Women', city: 'Lagos', service: 'Shelter, legal aid, counselling for survivors of gender-based violence', contact: '01 774 5577' },
                    { name: 'Gender Centre (Your University)', city: 'Your institution', service: 'First point of contact for institutional SGBV reports and support', contact: 'Ask your student portal' },
                  ].map((org, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{org.name}</p>
                          <p className="text-xs text-teal-600 mb-1">{org.city}</p>
                          <p className="text-xs text-slate-500">{org.service}</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-100 flex-shrink-0">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-700">{org.contact}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Safety planning tips</h3>
                <ul className="space-y-2">
                  {[
                    'Tell a trusted person about what is happening.',
                    'Keep records safely — screenshots, messages, dates — in a place only you can access.',
                    'Know the exits and safe spaces on your campus.',
                    'Have emergency contacts saved on your phone.',
                    'If you receive threats, preserve the evidence before blocking the person.',
                    'Your safety is more important than confronting the perpetrator directly.',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
