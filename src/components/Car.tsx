type CarProps = {
  color?: string;
  width?: number;
  className?: string;
};

// Top-down race car, drawn pointing up (the front is at the top).
// Rotate it with a CSS transform to steer it around the track.
export default function Car({
  color = "#e11d48",
  width = 60,
  className,
}: CarProps) {
  return (
    <svg
      viewBox="0 0 60 100"
      width={width}
      height={(width * 100) / 60}
      className={className}
      role="img"
      aria-label="Car"
    >
      {/* Wheels */}
      <rect x="2" y="16" width="10" height="20" rx="3" fill="#1f2937" />
      <rect x="48" y="16" width="10" height="20" rx="3" fill="#1f2937" />
      <rect x="2" y="66" width="10" height="20" rx="3" fill="#1f2937" />
      <rect x="48" y="66" width="10" height="20" rx="3" fill="#1f2937" />

      {/* Body */}
      <path
        d="M30 2 C44 2 52 10 52 22 L52 84 C52 93 45 98 30 98 C15 98 8 93 8 84 L8 22 C8 10 16 2 30 2 Z"
        fill={color}
        stroke="#111827"
        strokeWidth="2"
      />

      {/* Racing stripe */}
      <rect x="26" y="3" width="8" height="94" fill="white" opacity="0.85" />

      {/* Headlights */}
      <ellipse cx="18" cy="9" rx="5" ry="3" fill="#fde68a" />
      <ellipse cx="42" cy="9" rx="5" ry="3" fill="#fde68a" />

      {/* Windshield */}
      <path d="M14 34 Q30 26 46 34 L43 46 Q30 42 17 46 Z" fill="#7dd3fc" />

      {/* Roof */}
      <rect x="16" y="47" width="28" height="20" rx="4" fill={color} stroke="#111827" strokeWidth="1" />

      {/* Rear window */}
      <path d="M17 68 Q30 72 43 68 L45 76 Q30 80 15 76 Z" fill="#7dd3fc" />

      {/* Spoiler */}
      <rect x="6" y="90" width="48" height="6" rx="2" fill="#111827" />

      {/* Tail lights */}
      <rect x="12" y="85" width="8" height="3" rx="1" fill="#ef4444" />
      <rect x="40" y="85" width="8" height="3" rx="1" fill="#ef4444" />
    </svg>
  );
}
