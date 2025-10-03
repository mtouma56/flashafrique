import React from 'react';

interface AdminTopbarProps {
  title: string;
}

const AdminTopbar: React.FC<AdminTopbarProps> = ({ title }) => {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-black/10 dark:border-white/10">
      <h2 className="text-2xl font-bold text-black dark:text-white">{title}</h2>
    </header>
  );
};

export default AdminTopbar;
