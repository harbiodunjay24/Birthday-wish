import React from 'react';

export const CloudShape1: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 240 120"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M50 90h140c16.5 0 30-13.5 30-30 0-14.8-10.7-27-25-29.5-3.3-17.2-18.4-30.5-36.5-30.5-12.8 0-24 6.7-30.3 16.7C123 12.8 116.8 10 110 10c-15.5 0-28.3 11.8-29.8 27C78.4 36.3 76.2 36 74 36c-22.1 0-40 17.9-40 40 0 7.7 2.2 14.9 6 21 3.2-4.2 6.4-7 10-7z"
      opacity="0.85"
    />
  </svg>
);

export const CloudShape2: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 90"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M30 70h140c11 0 20-9 20-20s-9-20-20-20c-1.5 0-2.9.2-4.3.5C161.4 17.3 147.2 8 130 8c-14.4 0-26.6 6.5-32.8 16.4C93.4 22.8 89.4 22 85 22c-13.8 0-25 11.2-25 25 0 2.2.3 4.3.8 6.3C57.3 51.1 53.8 50 50 50c-11 0-20 9-20 20z"
      opacity="0.7"
    />
  </svg>
);

export const StarIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12 2l2.4 6.9h7.2l-5.8 4.3 2.2 7-6-4.4-6 4.4 2.2-7-5.8-4.3h7.2L12 2z" />
  </svg>
);

export const SparkleIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5L12 0z" />
  </svg>
);

export const SoftHeartIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// Neutral artistic illustrations for placeholder photo slots
export const PlaceholderArt: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'camera':
      return (
        <svg
          viewBox="0 0 120 120"
          className="h-20 w-20 text-sky-400/80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="18" y="32" width="84" height="64" rx="14" fill="#f0f9ff" />
          <path d="M42 32l6-12h24l6 12" />
          <circle cx="60" cy="64" r="18" stroke="#38bdf8" strokeWidth="2.2" />
          <circle cx="60" cy="64" r="7" fill="#7dd3fc" opacity="0.4" />
          <circle cx="84" cy="46" r="3" fill="#38bdf8" />
          <path d="M26 44h8" stroke="#bae6fd" />
        </svg>
      );
    case 'cloud':
      return (
        <svg
          viewBox="0 0 120 120"
          className="h-20 w-20 text-sky-400/80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="60" cy="42" r="18" fill="#e0f2fe" stroke="#38bdf8" strokeDasharray="3 3" />
          <path
            d="M30 84h60c10 0 18-8 18-18s-8-18-18-18c-1.2 0-2.4.1-3.6.4C83 38 72 30 59 30c-13 0-24 9-26.5 21.5C31 51.8 29.5 51.5 28 51.5 18 51.5 10 59.5 10 69.5S18 84 30 84z"
            fill="#f0f9ff"
            stroke="#0284c7"
          />
          <path d="M52 64q4-6 8 0" stroke="#0284c7" />
          <path d="M68 64q4-6 8 0" stroke="#0284c7" />
        </svg>
      );
    case 'horizon':
      return (
        <svg
          viewBox="0 0 120 120"
          className="h-20 w-20 text-sky-400/80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="15" y="24" width="90" height="72" rx="10" fill="#f0f9ff" />
          <path d="M15 74l24-20 20 16 26-22 20 18" stroke="#38bdf8" />
          <circle cx="40" cy="46" r="8" fill="#bae6fd" stroke="#0284c7" />
          <line x1="15" y1="84" x2="105" y2="84" stroke="#bae6fd" strokeDasharray="4 4" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg
          viewBox="0 0 120 120"
          className="h-20 w-20 text-sky-400/80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M60 20l7 28 28 7-28 7-7 28-7-28-28-7 28-7z"
            fill="#e0f2fe"
            stroke="#0284c7"
            strokeWidth="2"
          />
          <circle cx="34" cy="34" r="3" fill="#38bdf8" />
          <circle cx="86" cy="86" r="4" fill="#38bdf8" />
          <circle cx="84" cy="30" r="2" fill="#7dd3fc" />
          <circle cx="30" cy="84" r="2.5" fill="#7dd3fc" />
        </svg>
      );
    case 'stars':
      return (
        <svg
          viewBox="0 0 120 120"
          className="h-20 w-20 text-sky-400/80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M30 40l18 10 24-8 18 20" stroke="#bae6fd" strokeDasharray="3 3" />
          <circle cx="30" cy="40" r="4" fill="#38bdf8" />
          <circle cx="48" cy="50" r="3.5" fill="#0284c7" />
          <circle cx="72" cy="42" r="4" fill="#38bdf8" />
          <circle cx="90" cy="62" r="5" fill="#0284c7" />
          <path
            d="M60 74l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"
            fill="#e0f2fe"
            stroke="#38bdf8"
          />
        </svg>
      );
    case 'heart':
      return (
        <svg
          viewBox="0 0 120 120"
          className="h-20 w-20 text-purple-400/80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M60 92l-2.4-2.2C28 64 16 52 16 38c0-11 9-20 20-20 7 0 14 3.5 18 9 4-5.5 11-9 18-9 11 0 20 9 20 20 0 14-12 26-41.6 51.8L60 92z"
            fill="#faf5ff"
            stroke="#a855f7"
          />
          <circle cx="60" cy="46" r="3" fill="#c084fc" />
          <path d="M48 34a6 6 0 0 1 6-4" stroke="#c084fc" />
        </svg>
      );
    case 'book':
      return (
        <svg
          viewBox="0 0 120 120"
          className="h-20 w-20 text-sky-400/80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M24 30c8-4 22-4 36 2v60c-14-6-28-6-36-2V30z"
            fill="#f0f9ff"
            stroke="#0284c7"
          />
          <path
            d="M96 30c-8-4-22-4-36 2v60c14-6 28-6 36-2V30z"
            fill="#f0f9ff"
            stroke="#0284c7"
          />
          <path d="M60 32v60" stroke="#38bdf8" strokeWidth="2" />
        </svg>
      );
    case 'envelope':
    default:
      return (
        <svg
          viewBox="0 0 120 120"
          className="h-20 w-20 text-sky-400/80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="20" y="34" width="80" height="56" rx="8" fill="#f0f9ff" stroke="#38bdf8" />
          <path d="M20 38l40 28 40-28" stroke="#0284c7" />
          <circle cx="60" cy="66" r="8" fill="#bae6fd" stroke="#0284c7" />
          <path d="M57 66q3-3 6 0" stroke="#0284c7" />
        </svg>
      );
  }
};
