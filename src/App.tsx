// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JSX, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ConsumerDashboard = lazy(() => import('./pages/consumer/Dashboard'));
const ManufacturerDashboard = lazy(() => import('./pages/manufacturer/Dashboard'));
const FeedbackPage = lazy(() => import('./pages/consumer/FeedbackPage'));
const ChatPage = lazy(() => import('./pages/chat/ChatPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AnalyticsPage = lazy(() => import('./pages/manufacturer/AnalyticsPage'));
const ReportsManagement = lazy(() => import('./pages/ReportManagement'));


// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
  </div>
);

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children, role }: { children: JSX.Element, role: 'consumer' | 'manufacturer' | null }) => {
  const { currentUser, userRole, loading } = useAuth();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && userRole !== role) {
    return <Navigate to={userRole === 'consumer' ? '/consumer/dashboard' : '/manufacturer/dashboard'} replace />;
  }
  
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected consumer routes */}
              <Route path="/consumer/*" element={
                <ProtectedRoute role="consumer">
                  <MainLayout>
                    <Routes>
                      <Route path="dashboard" element={<ConsumerDashboard />} />
                      <Route path="feedback" element={<FeedbackPage />} />
                      <Route path="chat/:feedbackId" element={<ChatPage />} />
                      <Route path="*" element={<Navigate to="/consumer/dashboard" replace />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="reports" element={<ReportsManagement />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* Protected manufacturer routes */}
              <Route path="/manufacturer/*" element={
                <ProtectedRoute role="manufacturer">
                  <MainLayout>
                    <Routes>
                      <Route path="dashboard" element={<ManufacturerDashboard />} />
                      <Route path="chat/:feedbackId" element={<ChatPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="analytics" element={<AnalyticsPage />} />
                      <Route path="*" element={<Navigate to="/manufacturer/dashboard" replace />} />
                      <Route path="reports" element={<ReportsManagement />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;