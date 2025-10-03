import React from 'react';
import { Link } from 'react-router-dom';

interface AdminSidebarProps {
  activeItem?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeItem = 'articles' }) => {
  const menuItems = [
    { id: 'articles', icon: 'description', label: 'Article Management', href: '/admin' },
    { id: 'rss', icon: 'rss_feed', label: 'RSS Feed Management', href: '/admin/rss' },
    { id: 'users', icon: 'group', label: 'User Management', href: '/admin/users' },
    { id: 'settings', icon: 'settings', label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-background-light dark:bg-background-dark border-r border-black/10 dark:border-white/10 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-black/10 dark:border-white/10">
        <h1 className="text-xl font-bold text-black dark:text-white">FlashAfrique</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              activeItem === item.id
                ? 'bg-primary text-white'
                : 'hover:bg-primary/20 dark:hover:bg-primary/30 text-black dark:text-white'
            }`}
            aria-label={item.label}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-black/10 dark:border-white/10">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/20 dark:hover:bg-primary/30 text-black dark:text-white"
          aria-label="Go to site"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-sm font-medium">Go to site</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
