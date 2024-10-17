import { LoadingOverlay } from '@mantine/core';
import { createLazyFileRoute } from '@tanstack/react-router';

export const IndexRoute = createLazyFileRoute('/')({
  component: Index,
});

export const Route = IndexRoute;

function Index() {
  return <LoadingOverlay />;
}
