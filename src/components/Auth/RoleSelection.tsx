import React from 'react';
import { BookOpen, Users, GraduationCap } from 'lucide-react';

interface RoleSelectionProps {
  onRoleSelect: (role: 'librarian' | 'student') => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Library Management System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Please select your role to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Librarian Card */}
          <div 
            onClick={() => onRoleSelect('librarian')}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-blue-500"
          >
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Users className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Librarian
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Manage books, track inventory, and handle student checkouts
              </p>
              <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  View available books and inventory
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Track books issued to students
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Checkout books to students
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Manage returns and due dates
                </li>
              </ul>
            </div>
          </div>

          {/* Student Card */}
          <div 
            onClick={() => onRoleSelect('student')}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-green-500"
          >
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <GraduationCap className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Student
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                View your borrowed books and track due dates
              </p>
              <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  View your borrowed books
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Check remaining days for return
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  View borrowing history
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Track due dates and fines
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select your role to access the appropriate interface
          </p>
        </div>
      </div>
    </div>
  );
};