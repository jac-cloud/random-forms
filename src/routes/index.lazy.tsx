import { LoadingOverlay } from '@mantine/core';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';

export const IndexRoute = createLazyFileRoute('/')({
  component: Index,
});

export const Route = IndexRoute;

function Index() {
  const navigate = useNavigate();

  navigate({ to: '/forms', replace: true, search: { error: undefined } });

  return <LoadingOverlay />;
}
