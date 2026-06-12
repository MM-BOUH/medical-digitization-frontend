import React from 'react';

/**
 * LowQualityNotice
 * Shown when the backend rejects a photo (HTTP 422) because its quality is too
 * low to process. Displays the combined, user-facing `message` plus a per-issue
 * breakdown with friendly tips. Raw metrics are never shown here.
 *
 * Possible `failed` keys: unreadable, blurry, too_dark, too_bright,
 * low_contrast, too_small, glare, too_far.
 */

// Icon + short label + fallback tip for each quality issue.
const ISSUE_META = {
  unreadable: {
    icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
    label: 'Text not readable',
    tip: 'The text is too unclear to read. Use better lighting and hold steady.',
  },
  blurry: {
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    label: 'Photo is blurry',
    tip: 'Hold the camera still and let it focus before capturing.',
  },
  too_dark: {
    icon: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
    label: 'Too dark',
    tip: 'Move to a brighter spot or turn on more light.',
  },
  too_bright: {
    icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    label: 'Too bright',
    tip: 'Reduce direct light or move away from the light source.',
  },
  low_contrast: {
    icon: 'M12 3v18m0 0a9 9 0 000-18 9 9 0 000 18z',
    label: 'Low contrast',
    tip: 'Place the report on a plain, contrasting background.',
  },
  too_small: {
    icon: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4',
    label: 'Resolution too low',
    tip: 'Use a higher-resolution photo so the details are sharp.',
  },
  glare: {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    label: 'Glare detected',
    tip: 'Tilt the report or camera to avoid reflections and glare.',
  },
  too_far: {
    icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10 7v6m-3-3h6',
    label: 'Move closer',
    tip: 'Move the camera closer so the report fills the frame.',
  },
};

const LowQualityNotice = ({ message, failed = [], reasons = {} }) => {
  // Only render issues we have metadata for; ignore unknown keys defensively.
  const issues = failed.filter((key) => ISSUE_META[key]);

  return (
    <div className="flex flex-col items-center text-center max-w-xl mx-auto p-4 sm:p-6">
      {/* Camera / retake icon */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
        Let's retake that photo
      </h3>

      {message && (
        <p className="text-sm sm:text-base text-gray-600 mb-5">{message}</p>
      )}

      {issues.length > 0 && (
        <ul className="w-full space-y-2.5 text-left">
          {issues.map((key) => {
            const meta = ISSUE_META[key];
            const tip = reasons[key] || meta.tip;
            return (
              <li
                key={key}
                className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={meta.icon} />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{meta.label}</p>
                  <p className="text-sm text-gray-600">{tip}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LowQualityNotice;
