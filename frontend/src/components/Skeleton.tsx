import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  animation?: 'pulse' | 'shimmer' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width = '100%', 
  height = '1rem',
  rounded = false,
  animation = 'shimmer'
}) => {
  const animationClass = {
    pulse: 'animate-pulse-soft',
    shimmer: 'skeleton-shimmer',
    none: ''
  }[animation];

  return (
    <div
      className={`
        ${animationClass}
        ${rounded ? 'rounded-full' : 'rounded'}
        ${className}
      `}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        backgroundColor: 'var(--bg-tertiary)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {animation === 'shimmer' && (
        <div
          className="absolute inset-0 animate-shimmer"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            transform: 'translateX(-100%)'
          }}
        />
      )}
    </div>
  );
};

export default Skeleton;
