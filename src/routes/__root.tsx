import { account } from '@/utils';
import { Container } from '@mantine/core';
import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { AppwriteException, Models } from 'appwrite';
import { useEffect, useState } from 'react';

export const Route = createRootRoute({
  component: function Component() {
    const [session, setSession] = useState<Models.Session>();
    const [error, setError] = useState<AppwriteException>();

    const navigate = useNavigate();

    useEffect(() => {
      if (session) {
        navigate({
          to: '/forms',
        });
      } else if (error) {
        navigate({
          to: '/auth',
        });
      }
    }, [session, error, navigate]);

    useEffect(() => {
      account
        .getSession('current')
        .then(result => {
          setSession(result);
          console.log('result', result);
        })
        .catch(error => {
          setError(error);
          console.log('error oh no!', error);
        });
    }, []);

    return (
      <Container pt={48} pb={32} h={'100dvh'}>
        <Outlet />
      </Container>
    );
  },
});
