import React from 'react';

/**
 * Design system Skeleton component with horizontal shimmer gradient animation
 */
export default function Skeleton({
  className = '',
  width,
  height,
  rounded = 'rounded-xl',
}) {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      style={style}
      className={`relative overflow-hidden bg-bg-elev-2/80 ${rounded} ${className} before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent`}
      aria-hidden="true"
    />
  );
}
