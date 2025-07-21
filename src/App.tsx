import React from 'react';
import { useState } from 'react';
import { RoleSelection } from './components/Auth/RoleSelection';
import { LibrarianDashboard } from './components/Librarian/LibrarianDashboard';
import { StudentDashboard } from './components/Student/StudentDashboard';

function App() {
  const [selectedRole, setSelectedRole] = useState<'librarian' | 'student' | null>(null);
  
  if (!selectedRole) {
    return <RoleSelection onRoleSelect={setSelectedRole} />;
  }
  
  // Show appropriate dashboard based on selected role
  if (selectedRole === 'librarian') {
    return <LibrarianDashboard />;
  } else {
    return <StudentDashboard />;
  }
  
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;