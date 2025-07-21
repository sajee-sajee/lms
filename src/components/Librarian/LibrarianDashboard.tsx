import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Search,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Filter,
  Calendar,
  ArrowLeft,
  LogOut,
  Printer,
  DollarSign
} from 'lucide-react';
import { Book, BookTransaction, User } from '../../types';
import { format, differenceInDays, parseISO } from 'date-fns';

interface LibrarianDashboardProps {
  onBack?: () => void;
}

export const LibrarianDashboard: React.FC<LibrarianDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'issued' | 'checkout'>('inventory');
  const [books, setBooks] = useState<Book[]>([]);
  const [issuedBooks, setIssuedBooks] = useState<(BookTransaction & { book_title: string; student_name: string; student_reg: string })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkoutForm, setCheckoutForm] = useState({
    bookId: '',
    studentName: '',
    registrationNumber: '',
    dueDate: ''
  });

  // Mock data for demonstration
  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      publisher: 'Prentice Hall',
      publication_year: 2008,
      genre: 'Technology',
      description: 'A comprehensive guide to writing clean, maintainable code.',
      total_copies: 5,
      available_copies: 2,
      shelf_location: 'A-12',
      condition: 'excellent',
      tags: ['programming', 'software engineering'],
      average_rating: 4.6,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0743273565',
      publisher: 'Scribner',
      publication_year: 1925,
      genre: 'Fiction',
      description: 'A classic American novel set in the Jazz Age.',
      total_copies: 8,
      available_copies: 3,
      shelf_location: 'B-05',
      condition: 'good',
      tags: ['classic', 'american literature'],
      average_rating: 4.2,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      title: 'Design Patterns',
      author: 'Gang of Four',
      isbn: '978-0201633610',
      publisher: 'Addison-Wesley',
      publication_year: 1994,
      genre: 'Technology',
      description: 'Essential patterns for object-oriented design.',
      total_copies: 3,
      available_copies: 0,
      shelf_location: 'A-15',
      condition: 'good',
      tags: ['design patterns', 'oop'],
      average_rating: 4.4,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-12T00:00:00Z'
    }
  ];

  const mockIssuedBooks = [
    {
      id: '1',
      book_id: '1',
      user_id: '1',
      book_title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      student_name: 'John Doe',
      student_reg: 'CS2021001',
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
      user_id: '2',
      book_title: 'The Great Gatsby',
      student_name: 'Jane Smith',
      student_reg: 'ENG2021002',
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
      user_id: '3',
      book_title: 'Design Patterns',
      student_name: 'Mike Johnson',
      student_reg: 'CS2021003',
      type: 'borrow' as const,
      issue_date: '2024-01-08T09:15:00Z',
      due_date: '2024-01-22T23:59:59Z',
      return_date: null,
      fine_amount: 0,
      fine_paid: false,
      status: 'active' as const,
      created_at: '2024-01-08T09:15:00Z'
    }
  ];

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkoutForm.bookId || !checkoutForm.studentName || !checkoutForm.registrationNumber || !checkoutForm.dueDate) {
      alert('Please fill all fields');
      return;
    }

    const selectedBook = books.find(book => book.id === checkoutForm.bookId);
    if (!selectedBook || selectedBook.available_copies <= 0) {
      alert('Book not available');
      return;
    }

    // Create new checkout record
    const newCheckout = {
      id: Date.now().toString(),
      book_id: checkoutForm.bookId,
      user_id: Date.now().toString(),
      book_title: selectedBook.title,
      student_name: checkoutForm.studentName,
      student_reg: checkoutForm.registrationNumber,
      type: 'borrow' as const,
      issue_date: new Date().toISOString(),
      due_date: new Date(checkoutForm.dueDate + 'T23:59:59Z').toISOString(),
      return_date: null,
      fine_amount: 0,
      fine_paid: false,
      status: 'active' as const,
      created_at: new Date().toISOString()
    };

    // Update books array
    const updatedBooks = books.map(book => 
      book.id === checkoutForm.bookId 
        ? { ...book, available_copies: book.available_copies - 1 }
        : book
    );

    setBooks(updatedBooks);
    setIssuedBooks([...issuedBooks, newCheckout]);
    
    // Reset form
    setCheckoutForm({
      bookId: '',
      studentName: '',
      registrationNumber: '',
      dueDate: ''
    });

    alert('Book checked out successfully!');
  };

  const printStudentBill = (studentReg: string) => {
    const studentBooks = issuedBooks.filter(book => book.student_reg === studentReg);
    const studentName = studentBooks[0]?.student_name || 'Unknown Student';
    
    const totalFines = studentBooks.reduce((sum, book) => sum + book.fine_amount, 0);
    const overdueBooks = studentBooks.filter(book => {
      const daysUntilDue = getDaysUntilDue(book.due_date);
      return daysUntilDue < 0 || book.status === 'overdue';
    });

    const billContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #333; margin: 0;">Library Management System</h1>
          <h2 style="color: #666; margin: 10px 0;">Student Bill Statement</h2>
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
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Issue Date</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Due Date</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Status</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Fine</th>
            </tr>
          </thead>
          <tbody>
            ${studentBooks.map(book => {
              const daysUntilDue = getDaysUntilDue(book.due_date);
              const status = book.status === 'overdue' || daysUntilDue < 0 ? 'Overdue' : 
                           daysUntilDue === 0 ? 'Due Today' : 
                           daysUntilDue <= 3 ? 'Due Soon' : 'Active';
              
              return `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 12px;">${book.book_title}</td>
                  <td style="border: 1px solid #ddd; padding: 12px;">${format(parseISO(book.issue_date), 'MMM dd, yyyy')}</td>
                  <td style="border: 1px solid #ddd; padding: 12px;">${format(parseISO(book.due_date), 'MMM dd, yyyy')}</td>
                  <td style="border: 1px solid #ddd; padding: 12px; color: ${status === 'Overdue' ? '#dc2626' : status === 'Due Today' || status === 'Due Soon' ? '#ea580c' : '#059669'};">${status}</td>
                  <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$${book.fine_amount.toFixed(2)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div style="border-top: 2px solid #333; padding-top: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span><strong>Total Books Borrowed:</strong></span>
            <span>${studentBooks.length}</span>
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
            <title>Student Bill - ${studentName}</title>
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
              <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Print Bill</button>
              <button onclick="window.close()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setBooks(mockBooks);
      setIssuedBooks(mockIssuedBooks);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    return differenceInDays(parseISO(dueDate), new Date());
  };

  const getStatusColor = (status: string, daysUntilDue?: number) => {
    if (status === 'overdue') return 'text-red-600 dark:text-red-400';
    if (daysUntilDue !== undefined && daysUntilDue <= 3) return 'text-orange-600 dark:text-orange-400';
    return 'text-green-600 dark:text-green-400';
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  const filteredIssuedBooks = issuedBooks.filter(book =>
    book.book_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.student_reg.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
              Librarian Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage library books and student checkouts
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Total Books: {books.reduce((sum, book) => sum + book.total_copies, 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Available: {books.reduce((sum, book) => sum + book.available_copies, 0)}
              </p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inventory'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Book Inventory
          </button>
          <button
            onClick={() => setActiveTab('issued')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'issued'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Issued Books ({issuedBooks.length})
          </button>
          <button
            onClick={() => setActiveTab('checkout')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'checkout'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Checkout Book
          </button>
        </nav>
      </div>

      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'inventory' ? "Search books..." : activeTab === 'issued' ? "Search issued books or students..." : "Search books to checkout..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Book Inventory ({filteredBooks.length} books)
            </h2>
            {filteredBooks.map(book => (
              <div key={book.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      by {book.author} • {book.publication_year}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">ISBN</p>
                        <p className="text-gray-900 dark:text-white font-medium">{book.isbn}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Location</p>
                        <p className="text-gray-900 dark:text-white font-medium">{book.shelf_location}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Total Copies</p>
                        <p className="text-gray-900 dark:text-white font-medium">{book.total_copies}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Available</p>
                        <p className={`font-medium ${book.available_copies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {book.available_copies}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      book.available_copies > 0 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {book.available_copies > 0 ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'issued' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Issued Books ({filteredIssuedBooks.length} books)
            </h2>
            {filteredIssuedBooks.map(book => {
              const daysUntilDue = getDaysUntilDue(book.due_date);
              const statusColor = getStatusColor(book.status, daysUntilDue);
              
              return (
                <div key={book.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {book.book_title}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Student</p>
                          <p className="text-gray-900 dark:text-white font-medium">{book.student_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Registration</p>
                          <p className="text-gray-900 dark:text-white font-medium">{book.student_reg}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Issue Date</p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {format(parseISO(book.issue_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Due Date</p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {format(parseISO(book.due_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-right space-y-2">
                      <div className={`flex items-center ${statusColor} mb-2`}>
                        {book.status === 'overdue' ? (
                          <AlertTriangle className="w-4 h-4 mr-1" />
                        ) : daysUntilDue <= 3 ? (
                          <Clock className="w-4 h-4 mr-1" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        )}
                        <span className="font-medium">
                          {book.status === 'overdue' ? 'Overdue' : 
                           daysUntilDue === 0 ? 'Due Today' :
                           daysUntilDue > 0 ? `${daysUntilDue} days left` : 'Overdue'}
                        </span>
                      </div>
                      {book.fine_amount > 0 && (
                        <p className="text-red-600 dark:text-red-400 text-sm">
                          Fine: ${book.fine_amount.toFixed(2)}
                        </p>
                      )}
                      <button
                        onClick={() => printStudentBill(book.student_reg)}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Printer className="w-4 h-4 mr-1" />
                        Print Bill
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'checkout' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Checkout Book to Student
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <form className="space-y-6" onSubmit={handleCheckout}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Book
                  </label>
                  <select 
                    value={checkoutForm.bookId}
                    onChange={(e) => setCheckoutForm({...checkoutForm, bookId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Choose a book...</option>
                    {books.filter(book => book.available_copies > 0).map(book => (
                      <option key={book.id} value={book.id}>
                        {book.title} - {book.author} (Available: {book.available_copies})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter student full name"
                    value={checkoutForm.studentName}
                    onChange={(e) => setCheckoutForm({...checkoutForm, studentName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter student registration number"
                    value={checkoutForm.registrationNumber}
                    onChange={(e) => setCheckoutForm({...checkoutForm, registrationNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={checkoutForm.dueDate}
                    onChange={(e) => setCheckoutForm({...checkoutForm, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Checkout Book
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};