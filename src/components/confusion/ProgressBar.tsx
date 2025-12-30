'use client';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'amber';
}

export function ProgressBar({ 
  percentage, 
  showLabel = true, 
  size = 'md',
  color = 'blue' 
}: ProgressBarProps) {
  const height = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }[size];

  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-500',
    amber: 'bg-amber-500'
  }[color];

  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-slate-600">Progress</span>
          <span className="text-sm font-semibold text-slate-800">{clampedPercentage}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-slate-200 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${colors} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
}

interface CourseProgressCardProps {
  courseId: string;
  title: string;
  thumbnail: string;
  totalLessons: number;
  completedCount: number;
  price: number;
  onContinue: () => void;
  onViewCertificate?: () => void;
}

export function CourseProgressCard({
  courseId,
  title,
  thumbnail,
  totalLessons,
  completedCount,
  price,
  onContinue,
  onViewCertificate
}: CourseProgressCardProps) {
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const isComplete = percentage === 100;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex">
        <div className="relative w-32 h-24 flex-shrink-0">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
          {isComplete && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
              <span className="text-3xl">✓</span>
            </div>
          )}
        </div>
        <div className="flex-1 p-4">
          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1">{title}</h3>
          <ProgressBar percentage={percentage} size="sm" color={isComplete ? 'green' : 'blue'} />
          <p className="text-xs text-slate-500 mt-1">
            {completedCount} of {totalLessons} lessons completed
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-amber-600 font-bold">
              ₹{price}
            </span>
            {isComplete ? (
              onViewCertificate && (
                <button
                  onClick={onViewCertificate}
                  className="px-3 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
                >
                  View Certificate
                </button>
              )
            ) : (
              <button
                onClick={onContinue}
                className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface LessonProgressBadgeProps {
  isComplete: boolean;
}

export function LessonProgressBadge({ isComplete }: LessonProgressBadgeProps) {
  if (isComplete) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-xs font-bold">
        ✓
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-200 text-slate-500 rounded-full text-xs font-medium">
      ○
    </span>
  );
}
