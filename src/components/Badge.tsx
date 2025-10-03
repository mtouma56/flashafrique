import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'country' | 'theme' | 'default';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    country: 'bg-[color:var(--accent)/0.08] text-[color:var(--accent)] ring-1 ring-[color:var(--accent)/0.15]',
    theme: 'bg-[color:var(--accent-2)/0.08] text-[color:var(--accent-2)] ring-1 ring-[color:var(--accent-2)/0.15]',
    default: 'bg-[color:var(--muted)/0.08] text-[color:var(--muted)] ring-1 ring-[color:var(--muted)/0.15]',
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
        uppercase tracking-wide transition-colors
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
