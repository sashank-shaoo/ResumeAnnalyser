import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/login');

  useEffect(() => {
    if (!loading) {
      if (!token && !user) {
        toast.error("You must be logged in to view this page.", { id: 'unauth' });
        setRedirectPath('/login');
        setShouldRedirect(true);
      } else if (user && !user.isVerified) {
        setRedirectPath('/verify-otp');
        setShouldRedirect(true);
      }
    }
  }, [user, token, loading]);

  if (loading) {
    return null; // Global loader active in App.jsx handles visual
  }

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />;
  }

  if (!user || (!user.isVerified)) {
    return null; // Render nothing while the layout calculates the effect and triggers redirect
  }

  return children;
}
