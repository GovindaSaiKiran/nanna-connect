import React from 'react';

export const CardButton = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  onClick, 
  variant = 'primary',
  className = ''
}) => {
  return (
    <button 
      className={`btn-massive btn-${variant} ${className}`}
      onClick={onClick}
    >
      {Icon && <Icon className="icon" />}
      <span>{title}</span>
      {subtitle && <span className="text-medium" style={{ opacity: 0.9 }}>{subtitle}</span>}
    </button>
  );
};
