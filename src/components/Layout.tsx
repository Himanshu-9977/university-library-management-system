import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from './theme-provider';

const Layout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      <div className="flex flex-col flex-1">
        <header className="flex justify-between items-center p-4 bg-card">
          <h1 className="text-2xl font-bold">Library Management System</h1>
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">Welcome, {user?.name}</span>
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <SunIcon className="h-[1.2rem] w-[1.2rem]" /> : <MoonIcon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;