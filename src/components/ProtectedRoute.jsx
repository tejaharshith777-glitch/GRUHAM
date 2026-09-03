import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";

/**
 * Route guard component for protecting customer and contractor screens.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {Array<string>} [props.allowedRoles] - Optional list of allowed roles e.g. ['customer'], ['contractor']
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userProfile, loading, isConfigured } = useAuth();
  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    if (!loading && currentUser && userProfile && allowedRoles) {
      if (!allowedRoles.includes(userProfile.role)) {
        toast.error(
          `Access Restricted: ${
            userProfile.role === "contractor"
              ? "This section is for Customers. You are logged in as a Contractor."
              : "This page requires a verified Contractor account."
          }`
        );
      }
    }
  }, [loading, currentUser, userProfile, allowedRoles, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="w-10 h-10 border-4 border-[#B8860B]/20 border-t-[#B8860B] rounded-full animate-spin" />
      </div>
    );
  }

  // If Firebase isn't configured, pass through (fallback mode)
  if (!isConfigured) {
    return children;
  }

  // 1. Unauthenticated -> redirect to /login with returnTo parameter
  if (!currentUser) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // 2. Authenticated but profile not loaded yet
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="w-10 h-10 border-4 border-[#B8860B]/20 border-t-[#B8860B] rounded-full animate-spin" />
      </div>
    );
  }

  // 3. Authenticated but role not permitted -> redirect to role's dashboard
  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    const destination = userProfile.role === "contractor" ? "/ContractorDashboard" : "/DesignLibrary";
    return <Navigate to={destination} replace />;
  }

  return children;
}
