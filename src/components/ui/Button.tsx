import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'urgent' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-sm focus-visible:outline-2 focus-visible:outline-agri-forest focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs min-h-[36px]",
    md: "px-4 py-2.5 text-sm min-h-[44px]",
    lg: "px-6 py-3.5 text-base min-h-[48px]", // Mobile-first 48px tap target
  };

  const variantStyles = {
    primary: "bg-agri-forest text-white hover:bg-agri-forest-700 active:bg-agri-forest-800 border border-agri-forest-800 shadow-sm",
    secondary: "bg-parchment-100 text-soil-900 hover:bg-parchment-200 border border-field-border active:bg-parchment-300",
    urgent: "bg-harvest-amber text-white hover:bg-harvest-amber-700 active:bg-harvest-amber-800 border border-harvest-amber-700 shadow-sm",
    outline: "bg-transparent text-soil-900 border border-field-border hover:bg-parchment-100 active:bg-parchment-200",
    ghost: "bg-transparent text-soil-700 hover:bg-parchment-100 hover:text-soil-900 border border-transparent",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2 inline-flex items-center">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
