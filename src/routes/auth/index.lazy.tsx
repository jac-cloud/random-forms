import { account } from '@/utils';
import { Box, Button, Center, Input, Notification, Space, Title } from '@mantine/core';
import { IconAt, IconX } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { ID } from 'appwrite';
import { useState } from 'react';

// const actionCodeSettings = {
//   url: 'http://localhost:5173/auth/finishSignUp',
//   handleCodeInApp: true,
// };

enum StatusStates {
  NotSent,
  Sent,
  ErrorFirstStep,
  LoadingFirstStep,
  ErrorSecondStep,
  LoadingSecondStep,
}

export const Route = createLazyFileRoute('/auth/')({
  component: function Component() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [emailSentState, setStatus] = useState<StatusStates>(StatusStates.NotSent);
    const [errorMessage, setErrorMessage] = useState('');

    const [accountId, setAccountId] = useState('');

    const triggerOtpSending = async () => {
      setStatus(StatusStates.LoadingFirstStep);

      const result = await account.createEmailToken(ID.unique(), email, false).catch(error => {
        setErrorMessage(error.message || 'Unknown error occurred');
        setStatus(StatusStates.ErrorFirstStep);
      });

      if (!result) return;

      setStatus(StatusStates.Sent);
      setOtp('');
      setAccountId(result.userId); //TODO: CHeck if exist

      console.log('reee', result);
    };

    const processOtpVerification = async () => {
      setStatus(StatusStates.LoadingFirstStep);

      const result = await account.createSession(accountId, otp).catch(error => {
        setErrorMessage(error.message || 'Unknown error occurred');
        setStatus(StatusStates.ErrorSecondStep);
        setOtp('');

        console.log('reee4', error);
      });

      console.log('reee3', result);

      if (!result) return;

      setStatus(StatusStates.Sent);

      console.log('reee2', result);
    };

    const isEmailValid = email.includes('@') && email.includes('.');

    return (
      <Center h={'100%'}>
        <Box maw={400} m={'auto'} p={20} ta={'center'} bg={'dark.0'}>
          <Title mb={20}>Login</Title>
          {emailSentState === StatusStates.Sent || emailSentState === StatusStates.LoadingSecondStep ? (
            <>
              <Input
                placeholder="OTP sent to your email"
                icon={<IconAt size={16} />}
                value={otp}
                onChange={event => setOtp(event.currentTarget.value)}
                radius="md"
                size="md"
                aria-label="OTP Input"
              />
              <Space h="md" />
              <Button
                fullWidth
                onClick={processOtpVerification}
                disabled={!otp}
                loading={emailSentState === StatusStates.LoadingSecondStep}
              >
                {'Verify OTP'}
              </Button>
            </>
          ) : emailSentState === StatusStates.ErrorFirstStep ? (
            <Notification
              icon={<IconX size={18} />}
              color="red"
              title="Error"
              onClose={() => setStatus(StatusStates.NotSent)}
            >
              {errorMessage || 'There was an error sending the email. Please try again.'}
            </Notification>
          ) : (
            <>
              <Input
                placeholder="Your email"
                icon={<IconAt size={16} />}
                value={email}
                onChange={event => setEmail(event.currentTarget.value)}
                error={email && !isEmailValid ? 'Invalid email' : null}
                radius="md"
                size="md"
                aria-label="Email Input"
              />
              <Space h="md" />
              <Button fullWidth onClick={triggerOtpSending} loading={emailSentState === StatusStates.LoadingFirstStep}>
                {emailSentState === StatusStates.LoadingFirstStep ? 'Sending...' : 'Send Sign-In Link'}
              </Button>
            </>
          )}
        </Box>
      </Center>
    );
  },
});
