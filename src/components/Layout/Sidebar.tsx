import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  Home,
  Search,
  Clock,
  DollarSign,
  Bell,
  BookPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    const commonItems = [
      { icon: Home, label: 'Dashboard', path: '/' },
      { icon: Search, label: 'Search Books', path: '/search' },
      { icon: Clock, label: 'My Borrowings', path: '/my-borrowings' },
      { icon: Calendar, label: 'Events', path: '/events' },
    ];

    const adminLibrarianItems = [
      { icon: BookOpen, label: 'Books', path: '/books' },
      { icon: BookPlus, label: 'Add Book', path: '/books/add' },
      { icon: Users, label: 'Users', path: '/users' },
      { icon: BarChart3, label: 'Analytics', path: '/analytics' },
      { icon: DollarSign, label: 'Fines', path: '/fines' },
      { icon: Bell, label: 'Notifications', path: '/notifications' },
    ];

    if (user?.role === 'admin' || user?.role === 'librarian') {
      return [...commonItems, ...adminLibrarianItems];
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64
      `}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Library System
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {user?.name} ({user?.role})
          </p>
        </div>

        <nav className="mt-6">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center px-6 py-3 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Link
            to="/settings"
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Link>
        </div>
      </div>
    </>
  );
};