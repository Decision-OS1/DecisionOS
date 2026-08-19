interface RobotMascotProps {
  size?: number;
  className?: string;
}

export function RobotMascot({ size = 96, className = "" }: RobotMascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      className={className}
      fill="none"
    >
      <ellipse cx="48" cy="88" rx="18" ry="4" fill="#E4E1F5" />
      <rect x="20" y="30" width="56" height="46" rx="22" fill="white" stroke="#E4E1F5" strokeWidth="2" />
      <circle cx="48" cy="18" r="10" fill="white" stroke="#E4E1F5" strokeWidth="2" />
      <rect x="44" y="6" width="8" height="10" rx="4" fill="#6C5DD3" />
      <circle cx="48" cy="5" r="4" fill="#6C5DD3" />
      <rect x="30" y="44" width="36" height="20" rx="10" fill="#EEECFB" />
      <circle cx="41" cy="54" r="4" fill="#6C5DD3" />
      <circle cx="55" cy="54" r="4" fill="#6C5DD3" />
      <path d="M42 61c2 2 10 2 12 0" stroke="#6C5DD3" strokeWidth="2" strokeLinecap="round" />
      <rect x="6" y="46" width="14" height="8" rx="4" fill="white" stroke="#E4E1F5" strokeWidth="2" />
      <rect x="76" y="40" width="14" height="8" rx="4" transform="rotate(-25 83 44)" fill="white" stroke="#E4E1F5" strokeWidth="2" />
    </svg>
  );
}
