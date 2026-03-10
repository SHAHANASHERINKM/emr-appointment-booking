const StepIndicator = ({ step }) => {
  const steps = [
    { num: 1, label: "Select" },
    { num: 2, label: "Slot" },
    { num: 3, label: "Book" },
  ];

  return (
    <div className="flex items-center px-2 mb-8 max-w-sm">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors
              ${step > s.num ? "bg-blue-600 text-white" : step === s.num ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
              {step > s.num
                ? <span className="material-symbols-outlined text-base">check</span>
                : s.num}
            </div>
            <span className={`text-xs font-semibold ${step >= s.num ? "text-blue-600" : "text-gray-400"}`}>
              {s.label}
            </span>
          </div>
          {i < 2 && (
            <div className={`w-16 h-px mx-2 mb-5 ${step > s.num ? "bg-blue-600" : "bg-gray-300"}`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;