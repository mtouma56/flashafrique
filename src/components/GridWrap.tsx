import React from 'react';

interface GridWrapProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    sm?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  className?: string;
}

const GridWrap: React.FC<GridWrapProps> = ({
  children,
  columns = { mobile: 1, sm: 2, lg: 3, xl: 4 },
  gap = 'gap-6',
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-${columns.mobile || 1} sm:grid-cols-${columns.sm || 2} lg:grid-cols-${columns.lg || 3} xl:grid-cols-${columns.xl || 4} ${gap} ${className}`}>
      {children}
    </div>
  );
};

export default GridWrap;
