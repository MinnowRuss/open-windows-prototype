import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login           from './pages/Login';
import Dashboard       from './pages/Dashboard';
import Medications     from './pages/Medications';
import MedicationDetail from './pages/MedicationDetail';
import CarePlan        from './pages/CarePlan';
import CareTeam        from './pages/CareTeam';
import Messages        from './pages/Messages';
import Education       from './pages/Education';
import ArticleDetail   from './pages/ArticleDetail';
import Settings        from './pages/Settings';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/"                   element={<Dashboard />} />
                <Route path="/medications"        element={<Medications />} />
                <Route path="/medications/:id"    element={<MedicationDetail />} />
                <Route path="/care-plan"          element={<CarePlan />} />
                <Route path="/care-team"          element={<CareTeam />} />
                <Route path="/messages"           element={<Messages />} />
                <Route path="/education"          element={<Education />} />
                <Route path="/education/:id"      element={<ArticleDetail />} />
                <Route path="/settings"           element={<Settings />} />
                <Route path="/appointments"       element={<Dashboard />} />
                <Route path="*"                   element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
