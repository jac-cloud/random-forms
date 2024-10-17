import { FormsHome } from '@/features/forms';
import { createLazyFileRoute } from '@tanstack/react-router';

export const FormsHomeRoute = createLazyFileRoute('/forms/')({
  component: FormsHome,
});

export const Route = FormsHomeRoute;
