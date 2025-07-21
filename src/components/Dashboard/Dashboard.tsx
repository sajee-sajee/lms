import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Calendar,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  activeBorrowings: number;
  upcomingEvents: number;
  overdueBooks: number;
  totalFines: number;
  popularBooks: Array<{ title: string; borrowCount: number }>;
  recentActivity: Array<{ action: string; user: string; book: string; timestamp: string }>;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrowings: 0,
    upcomingEvents: 0,
    overdueBooks: 0,
    totalFines: 0,
    popularBooks: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // This would normally fetch real data from Supabase
      // For demo purposes, we'll use mock data
      setStats({
        totalBooks: 15420,
        totalUsers: 2840,
        activeBorrowings: 1234,
        upcomingEvents: 8,
        overdueBooks: 47,
        totalFines: 2340.50,
        popularBooks: [
          { title: 'The Great Gatsby', borrowCount: 45 },
          { title: '1984', borrowCount: 38 },
          { title: 'To Kill a Mockingbird', borrowCount: 32 },
          { title: 'Pride and Prejudice', borrowCount: 29 },
          { title: 'The Catcher in the Rye', borrowCount: 26 }
        ],
        recentActivity: [
          { action: 'Borrowed', user: 'John Doe', book: 'Clean Code', timestamp: '2 minutes ago' },
          { action: 'Returned', user: 'Jane Smith', book: 'Design Patterns', timestamp: '15 minutes ago' },
          { action: 'Reserved', user: 'Mike Johnson', book: 'The Pragmatic Programmer', timestamp: '1 hour ago' },
          { action: 'Borrowed', user: 'Sarah Wilson', book: 'JavaScript: The Good Parts', timestamp: '2 hours ago' }
        ]
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    trend?: string;
  }> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white p-6">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="mt-2 opacity-90">
          Here's what's happening in your library today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Books"
          value={stats.totalBooks.toLocaleString()}
          icon={BookOpen}
          color="bg-blue-600"
          trend="+12% from last month"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          color="bg-green-600"
          trend="+8% from last month"
        />
        <StatCard
          title="Active Borrowings"
          value={stats.activeBorrowings.toLocaleString()}
          icon={Clock}
          color="bg-orange-600"
        />
        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={Calendar}
          color="bg-purple-600"
        />
      </div>

      {/* Alert Cards */}
      {(user?.role === 'admin' || user?.role === 'librarian') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                Overdue Books
              </h3>
            </div>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
              {stats.overdueBooks}
            </p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              Books requiring immediate attention
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
                Outstanding Fines
              </h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
              ${stats.totalFines.toFixed(2)}
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Total unpaid fines
            </p>
          </div>
        </div>
      )}

      {/* Popular Books and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            Popular Books
          </h3>
          <div className="space-y-3">
            {stats.popularBooks.map((book, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{book.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {book.borrowCount} times borrowed
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    #{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span> {activity.action.toLowerCase()} 
                    <span className="font-medium"> "{activity.book}"</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};