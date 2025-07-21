/*
  # Library Management System Database Schema

  1. New Tables
    - `users` - Extended user profiles with library-specific fields
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `phone` (text)
      - `role` (enum: admin, librarian, student, faculty)
      - `library_card_id` (text, unique)
      - `is_active` (boolean)
      - `created_at` (timestamp)

    - `books` - Complete book catalog
      - `id` (uuid, primary key)
      - `title` (text)
      - `author` (text)
      - `isbn` (text, unique)
      - `publisher` (text)
      - `publication_year` (integer)
      - `genre` (text)
      - `description` (text)
      - `cover_url` (text, optional)
      - `total_copies` (integer)
      - `available_copies` (integer)
      - `shelf_location` (text)
      - `condition` (enum: excellent, good, fair, poor)
      - `tags` (text array)
      - `average_rating` (numeric, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `book_transactions` - Borrowing and return records
      - `id` (uuid, primary key)
      - `book_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `type` (enum: borrow, return)
      - `issue_date` (timestamp)
      - `due_date` (timestamp)
      - `return_date` (timestamp, optional)
      - `fine_amount` (numeric, default 0)
      - `fine_paid` (boolean, default false)
      - `status` (enum: active, returned, overdue)
      - `created_at` (timestamp)

    - `reservations` - Book reservation system
      - `id` (uuid, primary key)
      - `book_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `reserved_at` (timestamp)
      - `expires_at` (timestamp)
      - `position_in_queue` (integer)
      - `status` (enum: active, fulfilled, expired, cancelled)

    - `library_events` - Event management
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `event_date` (date)
      - `start_time` (time)
      - `end_time` (time)
      - `location` (text)
      - `max_participants` (integer)
      - `current_participants` (integer, default 0)
      - `registration_required` (boolean, default true)
      - `created_by` (uuid, foreign key)
      - `created_at` (timestamp)

    - `event_registrations` - Event participant tracking
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `registered_at` (timestamp)
      - `checked_in` (boolean, default false)
      - `check_in_time` (timestamp, optional)

    - `fines` - Fine management system
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `transaction_id` (uuid, foreign key, optional)
      - `amount` (numeric)
      - `reason` (text)
      - `paid` (boolean, default false)
      - `paid_at` (timestamp, optional)
      - `payment_method` (text, optional)
      - `created_at` (timestamp)

    - `book_reviews` - Book rating and review system
      - `id` (uuid, primary key)
      - `book_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `rating` (integer, 1-5)
      - `review_text` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Policies for users to manage their own data
    - Admin and librarian policies for management operations

  3. Indexes
    - Search optimization indexes on books table
    - Performance indexes on frequently queried columns

  4. Functions
    - Trigger functions for automatic updates
    - Book availability updates
    - Average rating calculations
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'librarian', 'student', 'faculty');
CREATE TYPE book_condition AS ENUM ('excellent', 'good', 'fair', 'poor');
CREATE TYPE transaction_type AS ENUM ('borrow', 'return');
CREATE TYPE transaction_status AS ENUM ('active', 'returned', 'overdue');
CREATE TYPE reservation_status AS ENUM ('active', 'fulfilled', 'expired', 'cancelled');

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  role user_role NOT NULL DEFAULT 'student',
  library_card_id text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  isbn text UNIQUE NOT NULL,
  publisher text,
  publication_year integer,
  genre text,
  description text,
  cover_url text,
  total_copies integer NOT NULL DEFAULT 1,
  available_copies integer NOT NULL DEFAULT 1,
  shelf_location text,
  condition book_condition DEFAULT 'good',
  tags text[] DEFAULT '{}',
  average_rating numeric(2,1) DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Book transactions table
CREATE TABLE IF NOT EXISTS book_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES books(id),
  user_id uuid NOT NULL REFERENCES users(id),
  type transaction_type NOT NULL,
  issue_date timestamptz NOT NULL DEFAULT now(),
  due_date timestamptz NOT NULL,
  return_date timestamptz,
  fine_amount numeric(10,2) DEFAULT 0,
  fine_paid boolean DEFAULT false,
  status transaction_status DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES books(id),
  user_id uuid NOT NULL REFERENCES users(id),
  reserved_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  position_in_queue integer DEFAULT 1,
  status reservation_status DEFAULT 'active'
);

-- Library events table
CREATE TABLE IF NOT EXISTS library_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  location text NOT NULL,
  max_participants integer DEFAULT 100,
  current_participants integer DEFAULT 0,
  registration_required boolean DEFAULT true,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES library_events(id),
  user_id uuid NOT NULL REFERENCES users(id),
  registered_at timestamptz DEFAULT now(),
  checked_in boolean DEFAULT false,
  check_in_time timestamptz,
  UNIQUE(event_id, user_id)
);

-- Fines table
CREATE TABLE IF NOT EXISTS fines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  transaction_id uuid REFERENCES book_transactions(id),
  amount numeric(10,2) NOT NULL,
  reason text NOT NULL,
  paid boolean DEFAULT false,
  paid_at timestamptz,
  payment_method text,
  created_at timestamptz DEFAULT now()
);

-- Book reviews table
CREATE TABLE IF NOT EXISTS book_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES books(id),
  user_id uuid NOT NULL REFERENCES users(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(book_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fines ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins and librarians can read all users" ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'librarian')
    )
  );

CREATE POLICY "Admins and librarians can manage users" ON users
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'librarian')
    )
  );

-- RLS Policies for books table
CREATE POLICY "Anyone can read books" ON books
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins and librarians can manage books" ON books
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'librarian')
    )
  );

-- RLS Policies for book_transactions table
CREATE POLICY "Users can read own transactions" ON book_transactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins and librarians can read all transactions" ON book_transactions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'librarian')
    )
  );

CREATE POLICY "Admins and librarians can manage transactions" ON book_transactions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'librarian')
    )
  );

-- RLS Policies for reservations table
CREATE POLICY "Users can read own reservations" ON reservations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reservations" ON reservations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and librarians can manage all reservations" ON reservations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'librarian')
    )
  );

-- RLS Policies for library_events table
CREATE POLICY "Anyone can read events" ON library_events
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins and librarians can manage events" ON library_events
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'librarian')
    )
  );

-- RLS Policies for event_registrations table
CREATE POLICY "Users can read own registrations" ON event_registrations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events" ON event_registrations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and librarians can manage all registrations" ON event_registrations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'librarian')
    )
  );

-- RLS Policies for fines table
CREATE POLICY "Users can read own fines" ON fines
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins and librarians can manage all fines" ON fines
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'librarian')
    )
  );

-- RLS Policies for book_reviews table
CREATE POLICY "Anyone can read reviews" ON book_reviews
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create own reviews" ON book_reviews
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON book_reviews
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_title ON books USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_books_author ON books USING gin(to_tsvector('english', author));
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
CREATE INDEX IF NOT EXISTS idx_books_tags ON books USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON book_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_book_id ON book_transactions(book_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON book_transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_due_date ON book_transactions(due_date);
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_book_id ON reservations(book_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- Function to update book average rating
CREATE OR REPLACE FUNCTION update_book_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE books
  SET average_rating = (
    SELECT COALESCE(AVG(rating::numeric), 0)
    FROM book_reviews
    WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
  )
  WHERE id = COALESCE(NEW.book_id, OLD.book_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update average rating
CREATE TRIGGER trigger_update_book_average_rating
  AFTER INSERT OR UPDATE OR DELETE ON book_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_book_average_rating();

-- Function to update books.updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for books updated_at
CREATE TRIGGER trigger_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for book_reviews updated_at
CREATE TRIGGER trigger_reviews_updated_at
  BEFORE UPDATE ON book_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();