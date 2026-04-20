export function Sparkles({ primaryColor }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-[sparkle_1.5s_ease-out_forwards]"
          style={{
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
            left: `${15 + Math.random() * 70}%`,
            top: `${20 + Math.random() * 40}%`,
            background: `color-mix(in srgb, ${primaryColor} ${60 + (i % 3) * 20}%, gold)`,
            animationDelay: `${i * 0.1}s`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}
