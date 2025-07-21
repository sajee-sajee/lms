export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'librarian' | 'student' | 'faculty';
  phone?: string;
  library_card_id: string;
  created_at: string;
  is_active: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publication_year: number;
  genre: string;
  description: string;
  cover_url?: string;
  total_copies: number;
  available_copies: number;
  shelf_location: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  tags: string[];
  average_rating: number;
  created_at: string;
  updated_at: string;
}

export interface BookTransaction {
  id: string;
  book_id: string;
  user_id: string;
  type: 'borrow' | 'return';
  issue_date: string;
  due_date: string;
  return_date?: string;
  fine_amount: number;
  fine_paid: boolean;
  status: 'active' | 'returned' | 'overdue';
  created_at: string;
}

export interface Reservation {
  id: string;
  book_id: string;
  user_id: string;
  reserved_at: string;
  expires_at: string;
  position_in_queue: number;
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
}

export interface LibraryEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants: number;
  current_participants: number;
  registration_required: boolean;
  created_by: string;
  created_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registered_at: string;
  checked_in: boolean;
  check_in_time?: string;
}

export interface Fine {
  id: string;
  user_id: string;
  transaction_id: string;
  amount: number;
  reason: string;
  paid: boolean;
  paid_at?: string;
  payment_method?: string;
  created_at: string;
}

export interface BookReview {
  id: string;
  book_id: string;
  user_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
  updated_at: string;
}