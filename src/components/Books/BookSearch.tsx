import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Star, 
  Clock,
  MapPin,
  Eye,
  Heart
} from 'lucide-react';
import { Book } from '../../types';
import { supabase } from '../../lib/supabase';

export const BookSearch: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

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
      tags: ['programming', 'software engineering', 'best practices'],
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
      available_copies: 0,
      shelf_location: 'B-05',
      condition: 'good',
      tags: ['classic', 'american literature', 'jazz age'],
      average_rating: 4.2,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      author: 'Gang of Four',
      isbn: '978-0201633610',
      publisher: 'Addison-Wesley',
      publication_year: 1994,
      genre: 'Technology',
      description: 'Essential patterns for object-oriented design.',
      total_copies: 3,
      available_copies: 1,
      shelf_location: 'A-15',
      condition: 'good',
      tags: ['design patterns', 'oop', 'software architecture'],
      average_rating: 4.4,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-12T00:00:00Z'
    }
  ];

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchTerm, selectedGenre, selectedAuthor, availabilityFilter, books]);

  const loadBooks = async () => {
    try {
      // In a real app, this would fetch from Supabase
      setBooks(mockBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];

    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm) ||
        book.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }

    if (selectedAuthor) {
      filtered = filtered.filter(book => book.author === selectedAuthor);
    }

    if (availabilityFilter === 'available') {
      filtered = filtered.filter(book => book.available_copies > 0);
    } else if (availabilityFilter === 'unavailable') {
      filtered = filtered.filter(book => book.available_copies === 0);
    }

    setFilteredBooks(filtered);
  };

  const genres = [...new Set(books.map(book => book.genre))];
  const authors = [...new Set(books.map(book => book.author))];

  const BookCard: React.FC<{ book: Book }> = ({ book }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                by {book.author}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-gray-700 dark:text-gray-300">
                {book.average_rating.toFixed(1)}
              </span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-gray-600 dark:text-gray-400">
                {book.shelf_location}
              </span>
            </div>

            <span className="text-gray-600 dark:text-gray-400">
              {book.publication_year}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {book.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              {book.available_copies > 0 ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    {book.available_copies} available
                  </span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-sm text-orange-600 dark:text-orange-400">
                    Not available
                  </span>
                </>
              )}
            </div>

            <div className="flex space-x-2">
              {book.available_copies > 0 ? (
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Borrow
                </button>
              ) : (
                <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors">
                  Reserve
                </button>
              )}
            </div>
          </div>
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Search Books
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Discover and borrow books from our collection
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, ISBN, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>

              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Authors</option>
                {authors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>

              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Books</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Not Available</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="space-y-4">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
          
          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No books found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};