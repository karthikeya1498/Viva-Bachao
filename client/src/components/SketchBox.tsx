import React from 'react';

interface SketchBoxProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'alt' | 'subtle' | 'sticky';
  interactive?: boolean;
  onClick?: () => void;
}

export const SketchBox: React.FC<SketchBoxProps> = ({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  onClick
}) => {
  let variantClass = 'glass-card';
  if (variant === 'subtle') variantClass = 'glass-card-subtle';
  if (variant === 'sticky') variantClass = 'glass-card border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.06)]';

  const interactiveClass = interactive ? 'glass-card-interactive cursor-pointer' : '';

  return (
    <div onClick={onClick} className={`${variantClass} ${interactiveClass} ${className}`}>
      {children}
    </div>
  );
};
