import { account } from '@/utils';
import { Button, Container, Group, Paper, PinInput, Text, TextInput, Title } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { ID } from 'appwrite';
import { useState } from 'react';
import classes from './Login.module.css';

enum StatusStates {
  NotSent,
  Sent,
  ErrorFirstStep,
  LoadingFirstStep,
  ErrorSecondStep,
  LoadingSecondStep,
}

export function Login() {
  const navigate = useNavigate();

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
    setAccountId(result.userId); //TODO: Check if exist
  };

  const processOtpVerification = async () => {
    setStatus(StatusStates.LoadingSecondStep);

    const result = await account.createSession(accountId, otp).catch(error => {
      setErrorMessage(error.message || 'Unknown error occurred');
      setStatus(StatusStates.ErrorSecondStep);
      setOtp('');
    });

    if (!result) return;

    setStatus(StatusStates.Sent);
    navigate({ to: '/forms', replace: true, search: { error: undefined } });
  };

  const isEmailValid = email.includes('@') && email.includes('.');

  const isFirstStep =
    emailSentState === StatusStates.NotSent ||
    emailSentState === StatusStates.ErrorFirstStep ||
    emailSentState === StatusStates.LoadingFirstStep;

  const isSecondStep =
    emailSentState === StatusStates.Sent ||
    emailSentState === StatusStates.ErrorSecondStep ||
    emailSentState === StatusStates.LoadingSecondStep;

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} ta="center">
        Benvenuto!
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Inserisci la tua email istituzionale per fare il login
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        {isFirstStep && (
          <TextInput
            label="Email"
            placeholder="nome.cognome@email.com"
            required
            onChange={event => setEmail(event.currentTarget.value)}
            error={
              emailSentState === StatusStates.ErrorFirstStep
                ? errorMessage || 'Si è verificato un errore, riprova più tardi'
                : null
            }
            value={email}
          />
        )}
        {isSecondStep && (
          <PinInput
            size="lg"
            oneTimeCode
            type={'number'}
            length={6}
            onChange={v => setOtp(v)}
            error={emailSentState === StatusStates.ErrorSecondStep}
            value={otp}
          />
        )}
        <Group justify="center" mt="lg" className={classes.controls}>
          <Button
            fullWidth
            className={classes.control}
            onClick={() => {
              if (isFirstStep) triggerOtpSending();
              if (isSecondStep) processOtpVerification();
            }}
            loading={
              emailSentState === StatusStates.LoadingFirstStep || emailSentState === StatusStates.LoadingSecondStep
            }
            disabled={isFirstStep ? !isEmailValid : false}
          >
            {isFirstStep ? 'Invia codice' : isSecondStep && 'Verifica codice'}
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
