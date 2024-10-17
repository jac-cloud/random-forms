import { account } from '@/utils';
import { Container } from '@mantine/core';
import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { AppwriteException, Models } from 'appwrite';
import { useEffect, useState } from 'react';

export const RootRoute = createRootRoute({
  component: Root,
});

export const Route = RootRoute;

function Root() {
  const [session, setSession] = useState<Models.Session>();
  const [error, setError] = useState<AppwriteException>();

  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate({
        to: '/forms',
        replace: true,
      });
    } else if (error) {
      navigate({
        to: '/auth',
        replace: true,
      });
    }
  }, [session, error, navigate]);

  useEffect(() => {
    account
      .getSession('current')
      .then(result => {
        setSession(result);
      })
      .catch(error => {
        setError(error);
      });
  }, []);

  return (
    <Container pt={48} pb={32} h={'100dvh'}>
      <Outlet />
    </Container>
  );
}
