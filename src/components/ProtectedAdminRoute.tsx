import { type ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '@/context/SessionProvider';
import { openAuthDialog } from '@/components/auth/AuthDialog';

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { user, isAdmin } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('intendedPath', location.pathname + location.search);
      openAuthDialog('signin');
      navigate('/');
    } else if (!isAdmin && !hasShownToast) {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 z-50 rounded-lg bg-red-500 px-6 py-3 text-white shadow-lg';
      toast.textContent = 'Accès réservé aux administrateurs';
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 3000);

      setHasShownToast(true);
      navigate('/');
    }
  }, [user, isAdmin, navigate, location, hasShownToast]);

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
