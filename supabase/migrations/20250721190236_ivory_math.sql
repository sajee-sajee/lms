/*
  # Insert Sample Data for Library Management System

  1. Sample Data
    - Sample admin user
    - Sample librarian user
    - Sample student users
    - Sample books with different genres
    - Sample transactions
    - Sample events
    - Sample reviews

  2. Security
    - Data follows RLS policies
    - Proper role assignments
*/

-- Insert sample users (Note: In production, these would be created through auth.users first)
INSERT INTO users (id, email, name, phone, role, library_card_id, is_active) VALUES
-- Admin user
('00000000-0000-0000-0000-000000000001', 'admin@library.com', 'Library Administrator', '+1-555-0101', 'admin', 'LIB-ADMIN-001', true),

-- Librarian users
('00000000-0000-0000-0000-000000000002', 'librarian@library.com', 'Jane Smith', '+1-555-0102', 'librarian', 'LIB-LIB-002', true),
('00000000-0000-0000-0000-000000000003', 'librarian2@library.com', 'Mike Johnson', '+1-555-0103', 'librarian', 'LIB-LIB-003', true),

-- Student users
('00000000-0000-0000-0000-000000000004', 'student1@university.edu', 'Alice Cooper', '+1-555-0104', 'student', 'LIB-STU-004', true),
('00000000-0000-0000-0000-000000000005', 'student2@university.edu', 'Bob Wilson', '+1-555-0105', 'student', 'LIB-STU-005', true),
('00000000-0000-0000-0000-000000000006', 'student3@university.edu', 'Carol Davis', '+1-555-0106', 'student', 'LIB-STU-006', true),

-- Faculty users
('00000000-0000-0000-0000-000000000007', 'faculty1@university.edu', 'Dr. Sarah Brown', '+1-555-0107', 'faculty', 'LIB-FAC-007', true),
('00000000-0000-0000-0000-000000000008', 'faculty2@university.edu', 'Prof. David Lee', '+1-555-0108', 'faculty', 'LIB-FAC-008', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample books
INSERT INTO books (id, title, author, isbn, publisher, publication_year, genre, description, total_copies, available_copies, shelf_location, condition, tags) VALUES
-- Technology Books
('10000000-0000-0000-0000-000000000001', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', '978-0132350884', 'Prentice Hall', 2008, 'Technology', 'A comprehensive guide to writing clean, maintainable code that will help you become a better programmer.', 5, 3, 'A-12', 'excellent', ARRAY['programming', 'software engineering', 'best practices']),

('10000000-0000-0000-0000-000000000002', 'Design Patterns: Elements of Reusable Object-Oriented Software', 'Gang of Four', '978-0201633610', 'Addison-Wesley', 1994, 'Technology', 'Essential patterns for object-oriented design and programming.', 3, 1, 'A-15', 'good', ARRAY['design patterns', 'oop', 'software architecture']),

('10000000-0000-0000-0000-000000000003', 'JavaScript: The Good Parts', 'Douglas Crockford', '978-0596517748', 'O''Reilly Media', 2008, 'Technology', 'A deep dive into the JavaScript language and its powerful features.', 4, 2, 'A-18', 'good', ARRAY['javascript', 'web development', 'programming']),

('10000000-0000-0000-0000-000000000004', 'The Pragmatic Programmer', 'David Thomas', '978-0201616224', 'Addison-Wesley', 1999, 'Technology', 'A guide to becoming a more effective and productive programmer.', 6, 4, 'A-20', 'excellent', ARRAY['programming', 'software development', 'career']),

-- Literature/Fiction
('10000000-0000-0000-0000-000000000005', 'The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', 'Scribner', 1925, 'Fiction', 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.', 8, 2, 'B-05', 'good', ARRAY['classic', 'american literature', 'jazz age']),

('10000000-0000-0000-0000-000000000006', 'To Kill a Mockingbird', 'Harper Lee', '978-0061120084', 'Harper Perennial', 1960, 'Fiction', 'A gripping tale of racial injustice and childhood innocence in the American South.', 10, 6, 'B-08', 'excellent', ARRAY['classic', 'social justice', 'coming of age']),

('10000000-0000-0000-0000-000000000007', '1984', 'George Orwell', '978-0451524935', 'Signet Classics', 1949, 'Fiction', 'A dystopian novel about totalitarianism and surveillance in a dark future society.', 7, 3, 'B-12', 'good', ARRAY['dystopian', 'political fiction', 'classic']),

('10000000-0000-0000-0000-000000000008', 'Pride and Prejudice', 'Jane Austen', '978-0486284736', 'Dover Publications', 1813, 'Fiction', 'A romantic novel about manners, upbringing, and marriage in Georgian England.', 6, 4, 'B-15', 'excellent', ARRAY['romance', 'classic', 'british literature']),

-- Science
('10000000-0000-0000-0000-000000000009', 'A Brief History of Time', 'Stephen Hawking', '978-0553380163', 'Bantam', 1988, 'Science', 'An exploration of cosmology, black holes, and the nature of time and space.', 5, 3, 'C-05', 'good', ARRAY['physics', 'cosmology', 'popular science']),

('10000000-0000-0000-0000-000000000010', 'The Origin of Species', 'Charles Darwin', '978-0486450063', 'Dover Publications', 1859, 'Science', 'Darwin''s groundbreaking work on evolution by natural selection.', 4, 2, 'C-08', 'fair', ARRAY['evolution', 'biology', 'natural history']),

-- History
('10000000-0000-0000-0000-000000000011', 'Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', '978-0062316097', 'Harper', 2014, 'History', 'A thought-provoking exploration of human history and our species'' impact on the world.', 8, 5, 'D-05', 'excellent', ARRAY['anthropology', 'human history', 'sociology']),

('10000000-0000-0000-0000-000000000012', 'The Art of War', 'Sun Tzu', '978-0486425559', 'Dover Publications', -500, 'History', 'Ancient Chinese military treatise on strategy and tactics.', 3, 1, 'D-08', 'good', ARRAY['strategy', 'military history', 'philosophy'])
ON CONFLICT (id) DO NOTHING;

-- Insert sample book transactions
INSERT INTO book_transactions (id, book_id, user_id, type, issue_date, due_date, return_date, fine_amount, fine_paid, status) VALUES
-- Active borrowings
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'borrow', '2024-01-10 10:00:00+00', '2024-01-24 23:59:59+00', NULL, 0, false, 'active'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 'borrow', '2024-01-12 14:30:00+00', '2024-01-26 23:59:59+00', NULL, 0, false, 'active'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006', 'borrow', '2024-01-08 09:15:00+00', '2024-01-22 23:59:59+00', NULL, 0, false, 'active'),

-- Overdue borrowings
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'borrow', '2024-01-05 11:00:00+00', '2024-01-19 23:59:59+00', NULL, 5.50, false, 'overdue'),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000007', 'borrow', '2024-01-03 16:45:00+00', '2024-01-17 23:59:59+00', NULL, 8.00, false, 'overdue'),

-- Returned books
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000005', 'borrow', '2023-12-15 13:20:00+00', '2023-12-29 23:59:59+00', '2023-12-28 10:30:00+00', 0, true, 'returned'),
('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000006', 'borrow', '2023-12-20 15:10:00+00', '2024-01-03 23:59:59+00', '2024-01-02 14:25:00+00', 0, true, 'returned'),
('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000008', 'borrow', '2023-12-18 11:40:00+00', '2024-01-01 23:59:59+00', '2023-12-30 16:20:00+00', 0, true, 'returned')
ON CONFLICT (id) DO NOTHING;

-- Insert sample reservations
INSERT INTO reservations (id, book_id, user_id, reserved_at, expires_at, position_in_queue, status) VALUES
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000007', '2024-01-15 09:30:00+00', '2024-01-22 23:59:59+00', 1, 'active'),
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000008', '2024-01-16 14:15:00+00', '2024-01-23 23:59:59+00', 2, 'active'),
('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', '2024-01-14 10:45:00+00', '2024-01-21 23:59:59+00', 1, 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample library events
INSERT INTO library_events (id, title, description, event_date, start_time, end_time, location, max_participants, current_participants, registration_required, created_by) VALUES
('40000000-0000-0000-0000-000000000001', 'Programming Workshop: Introduction to Python', 'Learn the basics of Python programming in this hands-on workshop. Perfect for beginners!', '2024-01-25', '14:00:00', '16:00:00', 'Computer Lab A', 20, 12, true, '00000000-0000-0000-0000-000000000002'),
('40000000-0000-0000-0000-000000000002', 'Book Club: Discussing "The Great Gatsby"', 'Join us for a lively discussion about F. Scott Fitzgerald''s classic novel.', '2024-01-28', '18:00:00', '19:30:00', 'Reading Room B', 15, 8, true, '00000000-0000-0000-0000-000000000002'),
('40000000-0000-0000-0000-000000000003', 'Author Talk: Local History with Dr. Patricia Williams', 'Dr. Williams will discuss her new book on local historical landmarks.', '2024-02-02', '17:00:00', '18:30:00', 'Main Auditorium', 100, 45, true, '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000004', 'Study Skills Workshop', 'Learn effective study techniques and time management strategies.', '2024-02-05', '15:00:00', '16:30:00', 'Conference Room', 25, 18, true, '00000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- Insert sample event registrations
INSERT INTO event_registrations (id, event_id, user_id, registered_at, checked_in, check_in_time) VALUES
('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', '2024-01-20 10:15:00+00', true, '2024-01-25 13:55:00+00'),
('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', '2024-01-21 16:30:00+00', true, '2024-01-25 14:02:00+00'),
('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', '2024-01-22 09:45:00+00', false, NULL),
('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000007', '2024-01-23 14:20:00+00', false, NULL),
('50000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000008', '2024-01-24 11:10:00+00', false, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample fines
INSERT INTO fines (id, user_id, transaction_id, amount, reason, paid, paid_at, payment_method) VALUES
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', 5.50, 'Late return fee - 11 days overdue', false, NULL, NULL),
('60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000005', 8.00, 'Late return fee - 16 days overdue', false, NULL, NULL),
('60000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', NULL, 2.50, 'Damaged book cover', true, '2024-01-10 15:30:00+00', 'cash')
ON CONFLICT (id) DO NOTHING;

-- Insert sample book reviews
INSERT INTO book_reviews (id, book_id, user_id, rating, review_text) VALUES
('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 5, 'Excellent book! Really helped me improve my coding practices. Highly recommend for any programmer.'),
('70000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', 4, 'Great resource for learning clean coding principles. Some parts are a bit repetitive, but overall very valuable.'),
('70000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 4, 'A timeless classic. The writing is beautiful and the themes are still relevant today.'),
('70000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', 5, 'Powerful and moving story. Everyone should read this book at least once.'),
('70000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000008', 4, 'Chillingly relevant in today''s world. Orwell''s vision is both terrifying and thought-provoking.'),
('70000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000004', 5, 'Hawking makes complex physics accessible to everyone. Fascinating read about the universe.'),
('70000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000006', 4, 'Mind-blowing perspective on human history. Makes you think about our species in a new way.')
ON CONFLICT (id) DO NOTHING;