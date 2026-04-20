export function AnimatedCheck({ color }) {
  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 52 52" className="size-16">
        <circle
          cx="26"
          cy="26"
          r="24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="animate-[circle-draw_0.6s_ease-in-out_forwards]"
          style={{
            strokeDasharray: 151,
            strokeDashoffset: 151,
            opacity: 0.2,
          }}
        />
        <circle
          cx="26"
          cy="26"
          r="24"
          fill={color}
          className="animate-[fade-scale_0.3s_0.4s_ease-out_forwards]"
          style={{ opacity: 0, transform: "scale(0)", transformOrigin: "center" }}
        />
        <path
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 26l7 7 15-15"
          className="animate-[check-draw_0.4s_0.6s_ease-out_forwards]"
          style={{ strokeDasharray: 36, strokeDashoffset: 36 }}
        />
      </svg>
    </div>
  )
}
