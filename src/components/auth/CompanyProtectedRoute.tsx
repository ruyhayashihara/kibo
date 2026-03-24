import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface CompanyProtectedRouteProps {
  children: React.ReactNode;
}

export const CompanyProtectedRoute: React.FC<CompanyProtectedRouteProps> = ({ children }) => {
  const { user, loading, isCompany } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isCompany) {
    // If user is logged in but not a company, redirect to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
