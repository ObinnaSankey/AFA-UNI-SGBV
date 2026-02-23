interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function ProgressBar({ currentStep, totalSteps, labels }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        {labels.map((label, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                i + 1 < currentStep
                  ? 'bg-teal-600 text-white'
                  : i + 1 === currentStep
                  ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {i + 1 < currentStep ? '✓' : i + 1}
            </div>
            <span
              className={`text-xs mt-1 text-center leading-tight hidden sm:block ${
                i + 1 === currentStep ? 'text-teal-700 font-medium' : 'text-slate-400'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-teal-600 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-slate-500">Step {currentStep} of {totalSteps}</span>
        <span className="text-xs text-teal-600 font-medium sm:hidden">{labels[currentStep - 1]}</span>
      </div>
    </div>
  );
}
