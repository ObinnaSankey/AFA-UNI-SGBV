import { AlertTriangle } from 'lucide-react';

export default function SafetyBanner() {
  return (
    <div className="bg-red-50 border-b border-red-200">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-red-700 leading-relaxed">
          <strong>If you are in immediate danger,</strong> contact emergency services (112) or campus security immediately.
          This platform is not a crisis response service.
        </p>
      </div>
    </div>
  );
}
