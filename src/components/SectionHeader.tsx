import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-fg" style={{ fontSize: 'clamp(1.8rem, 1.4rem + 1.2vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.15 }}>
            {title}
          </h2>
          {description && (
            <p className="text-sm md:text-base text-[color:var(--muted)] mt-1">{description}</p>
          )}
        </div>
        {action && (
          <a
            href={action.href}
            className="text-sm font-semibold text-[color:var(--accent)] hover:text-[color:var(--accent-2)] transition-colors flex items-center gap-1 group"
          >
            <span className="border-b border-transparent group-hover:border-[color:var(--accent-2)] transition-all">
              {action.label}
            </span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
      {/* Thin divider */}
      <div className="h-px bg-gradient-to-r from-[color:var(--fg)/0.1] via-[color:var(--fg)/0.05] to-transparent" />
    </div>
  );
};

export default SectionHeader;
