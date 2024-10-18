import { FormsDetailRoute } from '@/routes/forms/$quizId.lazy';
import { functions } from '@/utils';
import { Stack, Title } from '@mantine/core';
import { ExecutionMethod } from 'appwrite';
import { useEffect, useState } from 'react';
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
  const { quizId } = FormsDetailRoute.useParams();
  async function getForm(quizId: string): Promise<FormsDetails> {
    const response = await functions.createExecution(
      '67120ae600174dc868f6',
      undefined,
      false,
      '/forms/' + quizId,
      ExecutionMethod.GET,
    );

    if (response.status !== 'completed') {
      throw new Error('Failed to get form');
    }

    console.log(response.responseBody);
    const data = JSON.parse(response.responseBody);
    return data;
  }

  const [quiz, setQuiz] = useState<FormsDetails | null>(null);
  const [error, setError] = useState<Error | null>(null);
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
  }, [quizId]);

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
        {quiz.questions.map((q, i) => (
          <Question key={i} index={i + 1} id={q.$id} question={q.question} answers={q.answers} />
        ))}
      </Stack>
    </Stack>
  );
}
