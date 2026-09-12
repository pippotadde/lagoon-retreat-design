type Props = { className?: string; flip?: boolean };

export function BubbleDivider({ className = "", flip = false }: Props) {
  return (
    <div
      className={`pointer-events-none w-full ${className}`}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-16 md:h-24">
        <defs>
          <radialGradient id="bubbleFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--teal-brand)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--teal-brand)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[
          [60, 70, 18],
          [120, 40, 10],
          [180, 80, 22],
          [240, 30, 8],
          [300, 65, 14],
          [360, 90, 12],
          [420, 50, 20],
          [490, 75, 9],
          [560, 35, 16],
          [620, 85, 11],
          [690, 55, 24],
          [760, 25, 9],
          [830, 70, 14],
          [900, 45, 18],
          [970, 80, 10],
          [1030, 35, 13],
          [1090, 65, 20],
          [1150, 85, 8],
          [80, 20, 6],
          [260, 100, 7],
          [540, 15, 7],
          [800, 105, 8],
          [1100, 25, 9],
        ].map(([cx, cy, r], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="url(#bubbleFade)"
            opacity={0.4 + (i % 5) * 0.1}
          />
        ))}
      </svg>
    </div>
  );
}
