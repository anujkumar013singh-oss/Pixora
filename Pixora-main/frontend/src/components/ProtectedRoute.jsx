import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  const token = localStorage.getItem('token');

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-accent animate-pulse font-display text-2xl uppercase tracking-widest">
          Authenticating...
        </div>
      </div>
    );
  }

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
