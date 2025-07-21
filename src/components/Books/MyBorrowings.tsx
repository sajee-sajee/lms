import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  BookOpen,
  RefreshCw,
  DollarSign,
  QrCode
} from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { BookTransaction } from '../../types';

export const MyBorrowings: React.FC = () => {
  const { user } = useAuth();
  const [borrowings, setBorrowings] = useState<(BookTransaction & { book_title: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  // Mock data for demonstration
  const mockBorrowings = [
    {
      id: '1',
      book_id: '1',
      user_id: user?.id || '1',
      book_title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      type: 'borrow' as const,
      issue_date: '2024-01-10T10:00:00Z',
      due_date: '2024-01-24T23:59:59Z',
      return_date: null,
      fine_amount: 0,
      fine_paid: false,
      status: 'active' as const,
      created_at: '2024-01-10T10:00:00Z'
    },
    {
      id: '2',
      book_id: '2',
      user_id: user?.id || '1',
      book_title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      type: 'borrow' as const,
      issue_date: '2024-01-05T14:30:00Z',
      due_date: '2024-01-19T23:59:59Z',
      return_date: null,
      fine_amount: 5.50,
      fine_paid: false,
      status: 'overdue' as const,
      created_at: '2024-01-05T14:30:00Z'
    },
    {
      id: '3',
      book_id: '3',
      user_id: user?.id || '1',
      book_title: 'The Great Gatsby',
      type: 'borrow' as const,
      issue_date: '2023-12-15T09:15:00Z',
      due_date: '2023-12-29T23:59:59Z',
      return_date: '2023-12-28T16:45:00Z',
      fine_amount: 0,
      fine_paid: true,
      status: 'returned' as const,
      created_at: '2023-12-15T09:15:00Z'
    }
  ];

  useEffect(() => {
    loadBorrowings();
  }, [user]);

  const loadBorrowings = async () => {
    try {
      // In a real app, this would fetch from Supabase
      setBorrowings(mockBorrowings);
    } catch (error) {
      console.error('Error loading borrowings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    return differenceInDays(parseISO(dueDate), new Date());
  };

  const getStatusColor = (status: string, daysUntilDue?: number) => {
    if (status === 'returned') return 'text-green-600 dark:text-green-400';
    if (status === 'overdue') return 'text-red-600 dark:text-red-400';
    if (daysUntilDue !== undefined && daysUntilDue <= 3) return 'text-orange-600 dark:text-orange-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getStatusIcon = (status: string, daysUntilDue?: number) => {
    if (status === 'returned') return CheckCircle;
    if (status === 'overdue') return AlertTriangle;
    if (daysUntilDue !== undefined && daysUntilDue <= 3) return Clock;
    return BookOpen;
  };

  const activeBorrowings = borrowings.filter(b => b.status === 'active' || b.status === 'overdue');
  const borrowingHistory = borrowings.filter(b => b.status === 'returned');

  const BorrowingCard: React.FC<{ borrowing: typeof borrowings[0] }> = ({ borrowing }) => {
    const daysUntilDue = borrowing.status !== 'returned' ? getDaysUntilDue(borrowing.due_date) : null;
    const StatusIcon = getStatusIcon(borrowing.status, daysUntilDue || undefined);
    const statusColor = getStatusColor(borrowing.status, daysUntilDue || undefined);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {borrowing.book_title}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Issue Date</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {format(parseISO(borrowing.issue_date), 'MMM dd, yyyy')}
                </p>
              </div>
              
              <div>
                <p className="text-gray-500 dark:text-gray-400">Due Date</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {format(parseISO(borrowing.due_date), 'MMM dd, yyyy')}
                </p>
              </div>
              
              {borrowing.return_date && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Return Date</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {format(parseISO(borrowing.return_date), 'MMM dd, yyyy')}
                  </p>
                </div>
              )}
              
              {borrowing.fine_amount > 0 && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Fine</p>
                  <p className={`font-medium ${borrowing.fine_paid ? 'text-green-600' : 'text-red-600'}`}>
                    ${borrowing.fine_amount.toFixed(2)}
                    {borrowing.fine_paid ? ' (Paid)' : ' (Unpaid)'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="ml-4 flex flex-col items-end space-y-3">
            <div className={`flex items-center ${statusColor}`}>
              <StatusIcon className="w-5 h-5 mr-2" />
              <span className="font-medium capitalize">
                {borrowing.status === 'active' && daysUntilDue !== null ? (
                  daysUntilDue > 0 ? `${daysUntilDue} days left` : 
                  daysUntilDue === 0 ? 'Due today' : 'Overdue'
                ) : borrowing.status}
              </span>
            </div>

            {borrowing.status !== 'returned' && (
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <QrCode className="w-5 h-5" />
                </button>
                <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                  <RefreshCw className="w-4 h-4 mr-1 inline" />
                  Renew
                </button>
              </div>
            )}

            {borrowing.fine_amount > 0 && !borrowing.fine_paid && (
              <button className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors">
                <DollarSign className="w-4 h-4 mr-1 inline" />
                Pay Fine
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Borrowings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your borrowed books and due dates
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {activeBorrowings.length}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Active Borrowings</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {activeBorrowings.filter(b => getDaysUntilDue(b.due_date) <= 3).length}
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300">Due Soon</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-red-600 dark:text-red-400" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${borrowings.filter(b => b.fine_amount > 0 && !b.fine_paid).reduce((sum, b) => sum + b.fine_amount, 0).toFixed(2)}
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">Outstanding Fines</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'active'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Active Borrowings ({activeBorrowings.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            History ({borrowingHistory.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'active' ? (
          activeBorrowings.length > 0 ? (
            activeBorrowings.map(borrowing => (
              <BorrowingCard key={borrowing.id} borrowing={borrowing} />
            ))
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No active borrowings
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start by searching and borrowing some books.
              </p>
            </div>
          )
        ) : (
          borrowingHistory.length > 0 ? (
            borrowingHistory.map(borrowing => (
              <BorrowingCard key={borrowing.id} borrowing={borrowing} />
            ))
          ) : (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No borrowing history
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your past borrowings will appear here.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};