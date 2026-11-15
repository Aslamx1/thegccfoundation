import React from "react";

interface ProgressBarProps {
  progress: number; // 0 to 100+
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
}

export default function ProgressBar({
  progress,
  className = "h-2.5 bg-gray-100 rounded-full overflow-hidden",
  barClassName = "bg-[#02A95C]",
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full space-y-1.5">
      <div className={`w-full ${className}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barClassName}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-gray-500">
          <span>{Math.round(progress)}% of goal reached</span>
        </div>
      )}
    </div>
  );
}
