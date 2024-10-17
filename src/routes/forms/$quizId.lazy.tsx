import { FormsDetail } from '@/features/forms';
import { createLazyFileRoute } from '@tanstack/react-router';

export const FormsDetailRoute = createLazyFileRoute('/forms/$quizId')({
  component: FormsDetail,
});

export const Route = FormsDetailRoute;
