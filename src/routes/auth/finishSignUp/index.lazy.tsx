import { Button, Container, Loader, Text } from '@mantine/core';
import { createLazyFileRoute } from '@tanstack/react-router';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useEffect, useState } from 'react';

// Confirm the link is a sign-in with email link.
const auth = getAuth();

export const Route = createLazyFileRoute('/auth/finishSignUp/')({
  component: () =>
    function Component() {
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          const email = window.localStorage.getItem('emailForSignIn');
          if (!email) {
            setError('No email found for sign-in. Redirecting to sign-up page...');
            setLoading(false);
            setTimeout(() => {
              window.location.href = '/auth/';
            }, 3000); // Redirect after showing the error message
          } else {
            signInWithEmailLink(auth, email, window.location.href)
              .then(result => {
                window.localStorage.removeItem('emailForSignIn');
                console.log(result); // Handle successful sign-in
                setLoading(false);
                // Optionally, redirect to a dashboard or another page after successful sign-in
                window.location.href = '/dashboard';
              })
              .catch(error => {
                console.error(error);
                setError('Sign-in failed. Please try again or request a new sign-in link.');
                setLoading(false);
              });
          }
        } else {
          setError('Invalid sign-in link. Please try again.');
          setLoading(false);
        }
      }, []);

      return (
        <Container>
          {loading && (
            <Loader size="lg" color="blue" style={{ marginTop: '2rem' }}>
              Finishing sign-up...
            </Loader>
          )}

          {error && (
            <Text c="red" size="md" style={{ marginTop: '2rem' }}>
              {error}
            </Text>
          )}

          {!loading && !error && (
            <Text size="lg" style={{ marginTop: '2rem' }}>
              Sign-up successful! Redirecting...
            </Text>
          )}

          {!loading && error && (
            <Button
              variant="outline"
              color="blue"
              fullWidth
              style={{ marginTop: '2rem' }}
              onClick={() => (window.location.href = '/auth/')}
            >
              Back to Sign-Up
            </Button>
          )}
        </Container>
      );
    },
});
