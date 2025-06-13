import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

interface LogoProps {
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
  className?: string;
  targetUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({
  width = 32,
  height = 32,
  theme = 'light',
  className,
  targetUrl = '/dashboard', // Default to dashboard if no target is specified
}) => {
  // Use the teal logo for both light and dark modes
  const logoSrc = '/assets/logos/escra-logo-teal.png';

  return (
    <Link href={targetUrl} className={clsx('block cursor-pointer', className)}>
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