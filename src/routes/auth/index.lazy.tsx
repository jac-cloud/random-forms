import { Login } from '@/features/auth';
import { createLazyFileRoute } from '@tanstack/react-router';

export const AuthRoute = createLazyFileRoute('/auth/')({
  component: Login,
});

export const Route = AuthRoute;
