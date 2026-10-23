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
  let variantClass = 'sketch-box';
  if (variant === 'alt') variantClass = 'sketch-box-alt';
  if (variant === 'subtle') variantClass = 'sketch-box-subtle';
  if (variant === 'sticky') variantClass = 'sketch-sticky';

  const interactiveClass = interactive ? 'sketch-box-interactive cursor-pointer' : '';

  return (
    <div onClick={onClick} className={`${variantClass} ${interactiveClass} ${className}`}>
      {children}
    </div>
  );
};
