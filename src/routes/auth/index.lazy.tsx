import { Button, Input } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth';
import { useState } from 'react';

const actionCodeSettings = {
  url: 'http://localhost:5173/auth/finishSignUp',
  handleCodeInApp: true,
};

enum EmailSentState {
  NotSent,
  Sent,
  Error,
}

export const Route = createLazyFileRoute('/auth/')({
  component: function Component() {
    const [email, setEmail] = useState('');
    const [emailSentState, setEmailSentState] = useState(EmailSentState.NotSent);

    const handleSendSignInLink = () => {
      const auth = getAuth();
      sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
          window.localStorage.setItem('emailForSignIn', email);
          console.log(`Email sent to ${email}`);
          setEmailSentState(EmailSentState.Sent);
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(`Error ${errorCode}: ${errorMessage}`);
          setEmailSentState(EmailSentState.Error);
        });
    };

    return (
      <>
        {emailSentState === EmailSentState.Sent ? (
          <p>Check your inbox for the sign-in link.</p>
        ) : emailSentState === EmailSentState.Error ? (
          <p>There was an error sending the email. Please try again.</p>
        ) : (
          <>
            <Input
              placeholder="Your email"
              leftSection={<IconAt size={16} />}
              value={email}
              onChange={event => setEmail(event.currentTarget.value)}
            />
            <Button onClick={handleSendSignInLink}>Next</Button>
          </>
        )}
      </>
    );
  },
});
