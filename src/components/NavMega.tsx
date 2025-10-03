import React, { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

interface NavMegaProps {
  items: NavItem[];
  className?: string;
}

const NavMega: React.FC<NavMegaProps> = ({ items, className = '' }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <nav className={`relative ${className}`}>
      <ul className="flex items-center gap-6">
        {items.map((item) => (
          <li
            key={item.label}
            className="relative"
            onMouseEnter={() => item.children && setActiveMenu(item.label)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <a
              href={item.href}
              className="text-sm font-semibold text-fg hover:text-accent transition-colors py-2 flex items-center gap-1"
            >
              {item.label}
              {item.children && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </a>

            {/* Mega Menu Dropdown */}
            {item.children && activeMenu === item.label && (
              <div className="absolute top-full left-0 pt-2 z-50">
                <div className="bg-card border border-fg/10 rounded-lg shadow-lg p-4 min-w-[200px]">
                  <ul className="space-y-2">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <a
                          href={child.href}
                          className="block text-sm text-muted hover:text-accent transition-colors py-2 px-3 rounded hover:bg-bg"
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavMega;
