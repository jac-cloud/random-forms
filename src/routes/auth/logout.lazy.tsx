import { Logout } from '@/features/auth/pages/Logout';
import { createLazyFileRoute } from '@tanstack/react-router';

export const LogoutRoute = createLazyFileRoute('/auth/logout')({
  component: Logout,
});

export const Route = LogoutRoute;
