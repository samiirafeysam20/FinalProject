import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BookOpen, 
  BarChart3,
  Settings,
  GraduationCap,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
    ];

    if (user?.role === 'ADMIN') {
      return [
        ...baseItems,
        { name: 'Users', href: '/users', icon: Users },
        { name: 'Exams', href: '/exams', icon: FileText },
        { name: 'Questions', href: '/questions', icon: BookOpen },
        // { name: 'Assignments', href: '/assignments', icon: BookOpen },
        { name: 'Results', href: '/results', icon: BarChart3 },
        { name: 'Profile', href: '/profile', icon: UserIcon },
        { name: 'Settings', href: '/settings', icon: Settings }
      ];
    }

    if (user?.role === 'TEACHER') {
      return [
        ...baseItems,
        { name: 'Exams', href: '/exams', icon: FileText },
        { name: 'Questions', href: '/questions', icon: BookOpen },
        // { name: 'Assignments', href: '/assignments', icon: BookOpen },
        { name: 'Results', href: '/results', icon: BarChart3 },
        { name: 'Profile', href: '/profile', icon: UserIcon }
      ];
    }

    if (user?.role === 'STUDENT') {
      return [
        ...baseItems,
        { name: 'Exams', href: '/exams', icon: FileText },
        // { name: 'Assignments', href: '/assignments', icon: BookOpen },
        { name: 'Results', href: '/results', icon: BarChart3 },
        { name: 'Profile', href: '/profile', icon: UserIcon }
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">ExamPro</span>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;