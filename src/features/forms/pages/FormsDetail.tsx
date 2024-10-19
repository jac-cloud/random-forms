import { FormsDetailRoute } from '@/routes/forms/$quizId.lazy';
import { functions } from '@/utils';
import { Button, Stack, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedCallback } from '@mantine/hooks';
import { useNavigate } from '@tanstack/react-router';
import { ExecutionMethod } from 'appwrite';
import { useCallback, useEffect, useState } from 'react';
import { Question } from '../components';

type Question = {
  question: string;
  answers: string[];
  $id: string;
};

type FormsDetails = {
  title: string;
  owner: string;
  questions: Question[];
};

export function FormsDetail() {
  const navigate = useNavigate();

  const { quizId } = FormsDetailRoute.useParams();

  const getForm = useCallback(
    async (quizId: string): Promise<FormsDetails> => {
      const response = await functions.createExecution(
        '67120ae600174dc868f6',
        undefined,
        false,
        '/forms/' + quizId,
        ExecutionMethod.GET,
      );

      if (response.status !== 'completed') {
        throw navigate({ to: '/forms', search: { error: 404 } });
      }

      console.log(response.responseBody);
      const data = JSON.parse(response.responseBody);
      return data;
    },
    [navigate],
  );

  const [quiz, setQuiz] = useState<FormsDetails | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [givenAnswers, setGivenAnswers] = useState<{ [key: string]: number }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      getForm(quizId)
        .then(qs => {
          setQuiz(qs as FormsDetails);
        })
        .catch(error => {
          console.error(error);
          setError(error as Error);
        });
    } catch (error) {
      console.error(error);
      setError(error as Error);
    }
  }, [quizId, getForm]);

  const sendAnswers = useDebouncedCallback(() => {
    const quizAnswers = {
      quizId: quizId,
      answers: givenAnswers,
    };

    console.log('Sending answers', quizAnswers);
  }, 3000);

  useEffect(() => {
    sendAnswers();
  }, [givenAnswers, sendAnswers]);

  const sendResponse = async values => {
    setSubmitting(true);

    const response = await functions.createExecution(
      '67120ae600174dc868f6',
      JSON.stringify({
        quizId: quizId,
        answers: givenAnswers,
      }),
      false,
      '/forms/' + quizId + '/submit',
      ExecutionMethod.POST,
    );

    if (response.status !== 'completed') {
      throw new Error('Error sending answers');
    }

    console.log(response.responseBody);
  };

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {},
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <Stack>
      <Title order={1} mb={16}>
        Quiz: {quiz.title}
      </Title>
      <Stack>
        <form onSubmit={sendResponse}>
          {quiz.questions.map((q, i) => (
            <Question
              key={i}
              index={i + 1}
              id={q.$id}
              question={q.question}
              answers={q.answers}
              givenAnswers={givenAnswers}
              setGivenAnswers={setGivenAnswers}
            />
          ))}

          <Button onClick={sendResponse} type="submit" loading={submitting}>
            Submit
          </Button>
        </form>
      </Stack>
    </Stack>
  );
}
