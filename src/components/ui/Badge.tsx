import React from 'react';

export type BadgeVariant = 'verified' | 'demo' | 'urgent' | 'neutral' | 'forest';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  icon,
  className = '',
}) => {
  const base = "inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium tracking-wide uppercase rounded-xs border";

  const variants = {
    verified: "bg-agri-forest-50 text-agri-forest-800 border-agri-forest-600/40",
    demo: "bg-parchment-200 text-soil-700 border-field-border",
    urgent: "bg-harvest-amber-50 text-harvest-amber-700 border-harvest-amber-600/40",
    neutral: "bg-parchment-100 text-soil-700 border-field-border",
    forest: "bg-agri-forest text-white border-agri-forest-800",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {icon && <span className="mr-1 inline-flex items-center">{icon}</span>}
      {children}
    </span>
  );
};
