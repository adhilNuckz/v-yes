import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useEffect } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    // Apply theme to document root
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 glass border border-[#FF9D00]/30 hover:border-[#FF9D00] rounded-lg transition-all"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-[#FF9D00]" />
      ) : (
        <Moon className="w-5 h-5 text-[#FF9D00]" />
      )}
    </button>
  );
}
