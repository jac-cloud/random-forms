import { FormsHome } from '@/features/forms';
import { createFileRoute } from '@tanstack/react-router';

type FormsHomeSearch = {
  error: number | undefined;
};

export const FormsHomeRoute = createFileRoute('/forms/')({
  validateSearch: (search: Record<string, unknown> | undefined): FormsHomeSearch => {
    return {
      error: Number(search?.error) || undefined,
    };
  },
  component: FormsHome,
});

export const Route = FormsHomeRoute;
