import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

interface LogoProps {
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  width = 32,
  height = 32,
  theme = 'light',
  className,
}) => {
  // Placeholder for logo source - will be updated once files are provided
  const logoSrc = theme === 'dark' ? '/assets/logos/escra-logo-white.png' : '/assets/logos/escra-logo-teal.png';

  return (
    <Link href="/dashboard" className={clsx('block', className)}>
      <Image
        src={logoSrc}
        alt="Escra Logo"
        width={width}
        height={height}
        className={clsx('hover:opacity-90 transition-opacity duration-150')}
      />
    </Link>
  );
};

Logo.displayName = 'Logo'; 