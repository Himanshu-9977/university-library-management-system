import { NavLink } from 'react-router-dom';
import { BookOpen, Users, ClipboardList, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/books', icon: BookOpen, label: 'Books' },
    { to: '/loans', icon: ClipboardList, label: 'Loans' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ to: '/users', icon: Users, label: 'Users' });
  }

  return (
    <nav className="w-64 bg-card text-card-foreground p-4 flex flex-col h-full">
      <div className="flex items-center justify-center mb-8">
        <BookOpen className="h-8 w-8 mr-2" />
        <span className="text-xl font-bold">LibraryMS</span>
      </div>
      <ul className="space-y-2 flex-1">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">Logged in as:</p>
        <p className="font-medium">{user?.name}</p>
        <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
      </div>
    </nav>
  );
};

export default Navigation;