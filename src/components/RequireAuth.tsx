import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';

export default function RequireAuth() {
  const loggedIn = useUserStore((s) => s.loggedIn);
  const location = useLocation();

  if (!loggedIn) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return <Outlet />;
}