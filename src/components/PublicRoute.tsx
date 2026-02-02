import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { currentUser } = useAuth();
  
  if (currentUser && currentUser.emailVerified) {
    return <Navigate to="/topics" />;
  }
  
  return <>{children}</>;
};

export default PublicRoute;