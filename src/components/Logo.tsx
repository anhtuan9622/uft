interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
    >
      <rect width="32" height="32" rx="4" fill="currentColor" />
      <text
        x="16"
        y="22"
        fontFamily="Space Grotesk, sans-serif"
        fontSize="18"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
      >
        UFT
      </text>
    </svg>
  );
}
