export function IslamicPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.02]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="islamic-pattern"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="40" cy="40" r="2" fill="currentColor" />
          <path
            d="M40 20 L50 30 L40 40 L30 30 Z M40 60 L50 50 L40 40 L30 50 Z M20 40 L30 50 L40 40 L30 30 Z M60 40 L50 50 L40 40 L50 30 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle cx="20" cy="20" r="1.5" fill="currentColor" />
          <circle cx="60" cy="20" r="1.5" fill="currentColor" />
          <circle cx="20" cy="60" r="1.5" fill="currentColor" />
          <circle cx="60" cy="60" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
    </svg>
  );
}
