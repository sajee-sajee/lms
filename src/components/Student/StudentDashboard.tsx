import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Search,
  Star,
  User,
  ArrowLeft,
  LogOut,
  Printer,
  BookOpen
} from 'lucide-react';
import { BookTransaction } from '../../types';
import { format, differenceInDays, parseISO } from 'date-fns';

interface StudentDashboardProps {
  onBack?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onBack }) => {
  const [borrowings, setBorrowings] = useState<(BookTransaction & { book_title: string; book_author: string })[]>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockBorrowings = [
    {
      id: '1',
      book_id: '1',
      user_id: '1',
      book_title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      book_author: 'Robert C. Martin',
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
      user_id: '1',
      book_title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      book_author: 'Gang of Four',
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
      user_id: '1',
      book_title: 'The Great Gatsby',
      book_author: 'F. Scott Fitzgerald',
      type: 'borrow' as const,
      issue_date: '2023-12-15T09:15:00Z',
      due_date: '2023-12-29T23:59:59Z',
      return_date: '2023-12-28T16:45:00Z',
      fine_amount: 0,
      fine_paid: true,
      status: 'returned' as const,
      created_at: '2023-12-15T09:15:00Z'
    },
    {
      id: '4',
      book_id: '4',
      user_id: '1',
      book_title: 'JavaScript: The Good Parts',
      book_author: 'Douglas Crockford',
      type: 'borrow' as const,
      issue_date: '2023-12-01T11:20:00Z',
      due_date: '2023-12-15T23:59:59Z',
      return_date: '2023-12-14T14:30:00Z',
      fine_amount: 0,
      fine_paid: true,
      status: 'returned' as const,
      created_at: '2023-12-01T11:20:00Z'
    }
  ];

  useEffect(() => {
    loadBorrowings();
  }, []);

  const loadBorrowings = async () => {
    try {
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

  const currentBorrowings = borrowings.filter(b => b.status === 'active' || b.status === 'overdue');
  const borrowingHistory = borrowings.filter(b => b.status === 'returned');

  const filteredCurrentBorrowings = currentBorrowings.filter(book =>
    book.book_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.book_author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = borrowingHistory.filter(book =>
    book.book_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.book_author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFines = borrowings
    .filter(b => b.fine_amount > 0 && !b.fine_paid)
    .reduce((sum, b) => sum + b.fine_amount, 0);

  const printMyBill = () => {
    const studentName = "Current Student"; // In real app, get from auth context
    const studentReg = "STU2024001"; // In real app, get from auth context
    
    const totalFines = borrowings.filter(b => b.fine_amount > 0 && !b.fine_paid).reduce((sum, b) => sum + b.fine_amount, 0);
    const overdueBooks = borrowings.filter(book => {
      const daysUntilDue = getDaysUntilDue(book.due_date);
      return (daysUntilDue < 0 || book.status === 'overdue') && book.status !== 'returned';
    });

    const billContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #333; margin: 0;">Library Management System</h1>
          <h2 style="color: #666; margin: 10px 0;">My Library Bill</h2>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p><strong>Student Name:</strong> ${studentName}</p>
          <p><strong>Registration Number:</strong> ${studentReg}</p>
          <p><strong>Bill Date:</strong> ${format(new Date(), 'MMM dd, yyyy')}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Book Title</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Author</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Issue Date</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Due Date</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Status</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Fine</th>
            </tr>
          </thead>
          <tbody>
            ${borrowings.map(book => {
              const daysUntilDue = book.status !== 'returned' ? getDaysUntilDue(book.due_date) : null;
              const status = book.status === 'returned' ? 'Returned' :
                           book.status === 'overdue' || (daysUntilDue !== null && daysUntilDue < 0) ? 'Overdue' : 
                           daysUntilDue === 0 ? 'Due Today' : 
                           daysUntilDue !== null && daysUntilDue <= 3 ? 'Due Soon' : 'Active';
              
              return `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 12px;">${book.book_title}</td>
                  <td style="border: 1px solid #ddd; padding: 12px;">${book.book_author}</td>
                  <td style="border: 1px solid #ddd; padding: 12px;">${format(parseISO(book.issue_date), 'MMM dd, yyyy')}</td>
                  <td style="border: 1px solid #ddd; padding: 12px;">${format(parseISO(book.due_date), 'MMM dd, yyyy')}</td>
                  <td style="border: 1px solid #ddd; padding: 12px; color: ${status === 'Overdue' ? '#dc2626' : status === 'Due Today' || status === 'Due Soon' ? '#ea580c' : status === 'Returned' ? '#059669' : '#2563eb'};">${status}</td>
                  <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$${book.fine_amount.toFixed(2)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div style="border-top: 2px solid #333; padding-top: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span><strong>Total Books Borrowed:</strong></span>
            <span>${borrowings.length}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span><strong>Currently Borrowed:</strong></span>
            <span>${currentBorrowings.length}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span><strong>Overdue Books:</strong></span>
            <span style="color: #dc2626;">${overdueBooks.length}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 18px;">
            <span><strong>Total Outstanding Fines:</strong></span>
            <span style="color: #dc2626;"><strong>$${totalFines.toFixed(2)}</strong></span>
          </div>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>This is a computer-generated bill. Please contact the library for any discrepancies.</p>
          <p>Generated on ${format(new Date(), 'MMM dd, yyyy HH:mm:ss')}</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>My Library Bill - ${studentName}</title>
            <style>
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${billContent}
            <div class="no-print" style="text-align: center; margin-top: 20px;">
              <button onclick="window.print()" style="background: #059669; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Print Bill</button>
              <button onclick="window.close()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const BorrowingCard: React.FC<{ borrowing: typeof borrowings[0] }> = ({ borrowing }) => {
    const daysUntilDue = borrowing.status !== 'returned' ? getDaysUntilDue(borrowing.due_date) : null;
    const StatusIcon = getStatusIcon(borrowing.status, daysUntilDue || undefined);
    const statusColor = getStatusColor(borrowing.status, daysUntilDue || undefined);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {borrowing.book_title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              by {borrowing.book_author}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
            </div>

            {borrowing.fine_amount > 0 && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className={`text-sm font-medium ${borrowing.fine_paid ? 'text-green-600' : 'text-red-600'}`}>
                  Fine: ${borrowing.fine_amount.toFixed(2)} 
                  {borrowing.fine_paid ? ' (Paid)' : ' (Unpaid)'}
                </p>
              </div>
            )}
          </div>

          <div className="ml-4 text-right">
            <div className={`flex items-center ${statusColor} mb-2`}>
              <StatusIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">
                {borrowing.status === 'returned' ? 'Returned' :
                 borrowing.status === 'overdue' ? 'Overdue' :
                 daysUntilDue !== null ? (
                   daysUntilDue > 0 ? `${daysUntilDue} days left` : 
                   daysUntilDue === 0 ? 'Due today' : 'Overdue'
                 ) : 'Active'}
              </span>
            </div>

            {borrowing.status !== 'returned' && daysUntilDue !== null && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {daysUntilDue <= 0 ? (
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {Math.abs(daysUntilDue)} days overdue
                  </span>
                ) : daysUntilDue <= 3 ? (
                  <span className="text-orange-600 dark:text-orange-400 font-medium">
                    Due soon
                  </span>
                ) : (
                  <span className="text-green-600 dark:text-green-400">
                    On time
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Student Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your borrowed books and due dates
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Current Books: {currentBorrowings.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Borrowed: {borrowings.length}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={printMyBill}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print My Bill
            </button>
            <button
              onClick={onBack}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {currentBorrowings.length}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Current Books</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {currentBorrowings.filter(b => {
                    const days = getDaysUntilDue(b.due_date);
                    return days <= 3 && days >= 0;
                  }).length}
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">Due Soon</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {currentBorrowings.filter(b => b.status === 'overdue').length}
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">Overdue</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  ${totalFines.toFixed(2)}
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Outstanding Fines</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('current')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'current'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Current Books ({currentBorrowings.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              History ({borrowingHistory.length})
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'current' ? (
            filteredCurrentBorrowings.length > 0 ? (
              filteredCurrentBorrowings.map(borrowing => (
                <BorrowingCard key={borrowing.id} borrowing={borrowing} />
              ))
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm ? 'No books found' : 'No current borrowings'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Visit the library to borrow some books.'}
                </p>
              </div>
            )
          ) : (
            filteredHistory.length > 0 ? (
              filteredHistory.map(borrowing => (
                <BorrowingCard key={borrowing.id} borrowing={borrowing} />
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm ? 'No books found' : 'No borrowing history'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Your past borrowings will appear here.'}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};