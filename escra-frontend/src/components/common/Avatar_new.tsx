import React from 'react';
import clsx from 'clsx';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  backgroundColor?: string; // Tailwind color class or custom
  textColor?: string; // Tailwind color class or custom
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-lg',
};

function getInitials(name: string) {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export const Avatar_new: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  backgroundColor = 'bg-primary',
  textColor = 'text-white',
  className,
}) => {
  const initials = getInitials(name);

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-full font-semibold overflow-hidden',
        sizeMap[size],
        backgroundColor,
        textColor,
        className
      )}
      aria-label={name}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="object-cover w-full h-full rounded-full"
          onError={e => (e.currentTarget.style.display = 'none')}
        />
      ) : (
        <span>{initials}</span>
      )}
    </span>
  );
}; 