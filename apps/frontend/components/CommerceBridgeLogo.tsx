interface LogoProps {
  size?: number;
  className?: string;
  variant?: 'icon' | 'full' | 'horizontal';
}

/**
 * CommerceBridge Logo Component
 *
 * A modern, geometric logo representing the bridge between
 * customers and commerce. Features interconnected elements
 * that form a subtle bridge/arch shape.
 */
export function CommerceBridgeLogo({ size = 40, className = '', variant = 'icon' }: LogoProps) {
  const IconLogo = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Bridge arch - left pillar */}
      <rect x="4" y="20" width="8" height="24" rx="2" fill="currentColor" opacity="0.9"/>

      {/* Bridge arch - right pillar */}
      <rect x="36" y="20" width="8" height="24" rx="2" fill="currentColor" opacity="0.9"/>

      {/* Bridge top - connecting arch */}
      <path
        d="M12 24 Q24 12 36 24"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Connection nodes on the bridge */}
      <circle cx="24" cy="18" r="3" fill="currentColor"/>

      {/* Base/platform - representing commerce foundation */}
      <rect x="2" y="42" width="44" height="3" rx="1.5" fill="currentColor" opacity="0.6"/>

      {/* Decorative connection lines */}
      <line x1="8" y1="32" x2="8" y2="42" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <line x1="40" y1="32" x2="40" y2="42" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
    </svg>
  );

  const HorizontalLogo = () => (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bridge arch - left pillar */}
        <rect x="4" y="20" width="8" height="24" rx="2" fill="currentColor" opacity="0.9"/>

        {/* Bridge arch - right pillar */}
        <rect x="36" y="20" width="8" height="24" rx="2" fill="currentColor" opacity="0.9"/>

        {/* Bridge top - connecting arch */}
        <path
          d="M12 24 Q24 12 36 24"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Connection nodes on the bridge */}
        <circle cx="24" cy="18" r="3" fill="currentColor"/>

        {/* Base/platform */}
        <rect x="2" y="42" width="44" height="3" rx="1.5" fill="currentColor" opacity="0.6"/>

        {/* Decorative connection lines */}
        <line x1="8" y1="32" x2="8" y2="42" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
        <line x1="40" y1="32" x2="40" y2="42" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      </svg>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight">CommerceBridge</span>
        <span className="text-xs opacity-70">E-commerce Platform</span>
      </div>
    </div>
  );

  const FullLogo = () => (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        width={size * 1.5}
        height={size * 1.5}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-2"
      >
        {/* Bridge arch - left pillar */}
        <rect x="4" y="20" width="8" height="24" rx="2" fill="currentColor" opacity="0.9"/>

        {/* Bridge arch - right pillar */}
        <rect x="36" y="20" width="8" height="24" rx="2" fill="currentColor" opacity="0.9"/>

        {/* Bridge top - connecting arch */}
        <path
          d="M12 24 Q24 12 36 24"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Connection nodes on the bridge */}
        <circle cx="24" cy="18" r="3" fill="currentColor"/>

        {/* Base/platform */}
        <rect x="2" y="42" width="44" height="3" rx="1.5" fill="currentColor" opacity="0.6"/>

        {/* Decorative connection lines */}
        <line x1="8" y1="32" x2="8" y2="42" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
        <line x1="40" y1="32" x2="40" y2="42" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      </svg>
      <span className="text-2xl font-bold tracking-tight">CommerceBridge</span>
      <span className="text-sm opacity-70">Bridging Commerce to You</span>
    </div>
  );

  if (variant === 'horizontal') return <HorizontalLogo />;
  if (variant === 'full') return <FullLogo />;
  return <IconLogo />;
}
