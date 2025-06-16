interface LogoProps {
  isCollapsed: boolean;
  theme: {
    isDark: boolean;
  };
}

export const Logo: React.FC<LogoProps> = ({ isCollapsed, theme }) => {
  return (
    <div className="flex items-center mb-8">
      <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">E</span>
      </div>
      {!isCollapsed && (
        <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-gray-200">ESCRA</span>
      )}
    </div>
  );
}; 