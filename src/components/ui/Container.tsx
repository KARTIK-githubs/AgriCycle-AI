import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'md',
}) => {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 w-full ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
};

export const Divider: React.FC<{ className?: string; label?: string }> = ({
  className = '',
  label,
}) => {
  if (label) {
    return (
      <div className={`relative my-8 ${className}`}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-field-border" />
        </div>
        <div className="relative flex justify-start">
          <span className="bg-parchment-50 pr-4 text-xs font-mono uppercase tracking-widest text-soil-500">
            {label}
          </span>
        </div>
      </div>
    );
  }

  return <hr className={`border-t border-field-border my-6 ${className}`} />;
};
