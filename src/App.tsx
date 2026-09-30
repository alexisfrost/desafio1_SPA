import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { isAuthenticated } from './api';
import LoginPage from './pages/LoginPage';
import ScorePage from './pages/ScorePage';

function RequireAuth({ children }: { children: ReactNode }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/score"
        element={
          <RequireAuth>
            <ScorePage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
