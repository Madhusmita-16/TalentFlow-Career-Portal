import React from 'react';

interface Link2CareerLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
}

export const Link2CareerLogo: React.FC<Link2CareerLogoProps> = ({
  className = '',
  showTagline = true,
  size = 'md',
  layout = 'horizontal',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex ${layout === 'vertical' ? 'flex-col items-center text-center' : 'items-center'} gap-3 ${className}`}>
      {/* Hexagonal Node Network & Growth Arrow SVG Logo */}
      <div className={`${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          {/* Hexagonal Outer Frame */}
          <polygon
            points="60,10 100,32 100,78 60,100 20,78 20,32"
            stroke="#0F172A"
            strokeWidth="7"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Hexagon Nodes */}
          {/* Top Node */}
          <circle cx="60" cy="10" r="10" stroke="#0F172A" strokeWidth="5" fill="#FFFFFF" />
          {/* Top Right Node */}
          <polygon points="100,32 85,24 85,40" stroke="#00A6FF" strokeWidth="4" fill="#00A6FF" opacity="0.8" />
          {/* Bottom Right Node */}
          <polygon points="100,78 85,70 85,86" stroke="#0F172A" strokeWidth="4" fill="#0066FF" />
          {/* Bottom Node */}
          <circle cx="60" cy="100" r="10" stroke="#0F172A" strokeWidth="5" fill="#0077FF" />
          {/* Bottom Left Node */}
          <polygon points="20,78 35,70 35,86" stroke="#00A6FF" strokeWidth="4" fill="#00A6FF" />
          {/* Top Left Node */}
          <polygon points="20,32 35,24 35,40" stroke="#0F172A" strokeWidth="4" fill="#0066FF" />

          {/* Center Connection Circle */}
          <circle cx="60" cy="55" r="11" stroke="#0F172A" strokeWidth="6" fill="#00A6FF" />

          {/* Diagonal Growth Arrow */}
          <path
            d="M 32 75 L 85 28"
            stroke="#00A6FF"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 68 26 L 87 26 L 85 45"
            stroke="#00A6FF"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className={`font-black ${titleSizes[size]} tracking-tight text-slate-900 leading-none`}>
          <span>Link</span>
          <span className="text-sky-500">2</span>
          <span>Career</span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider leading-tight mt-1">
            Connect. Discover. Grow.
          </span>
        )}
      </div>
    </div>
  );
};
