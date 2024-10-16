import { createLazyFileRoute } from '@tanstack/react-router';

import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

// Confirm the link is a sign-in with email link.
const auth = getAuth();
if (isSignInWithEmailLink(auth, window.location.href)) {
  const email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    window.location.href = '/auth/';
  } else {
    signInWithEmailLink(auth, email, window.location.href)
      .then(result => {
        window.localStorage.removeItem('emailForSignIn'); // You can access the new user via result.user
        console.log(result);
      })
      .catch(error => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      });
  }
}

export const Route = createLazyFileRoute('/auth/finishSignUp/')({
  component: () => <div>Hello /auth/finishSignUp/!</div>,
});
