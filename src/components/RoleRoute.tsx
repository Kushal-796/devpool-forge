import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

interface RoleRouteProps {
  allowed: string[];
  element: ReactElement;
}

const RoleRoute = ({ allowed, element }: RoleRouteProps) => {
  const { userProfile, firebaseUser, loading } = useAuthContext();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // if there's no authenticated user, send to login
  if (!firebaseUser) {
    return <Navigate to="/login" />;
  }

  // if we haven't loaded a profile yet, allow access and let the page
  // component handle the "profile not found" scenario instead of bouncing
  // the user back to login. this prevents a new developer from being
  // redirected when their Firestore document hasn't finished writing.
  if (!userProfile) {
    return element;
  }

  // userProfile exists, enforce role-based permissions
  if (!allowed.includes(userProfile.role)) {
    return <Navigate to="/" />;
  }

  return element;
};

export default RoleRoute;