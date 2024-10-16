import { Container } from '@mantine/core';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <Container pt={48} pb={32} h={'100dvh'}>
      <Outlet />
    </Container>
  ),
});
