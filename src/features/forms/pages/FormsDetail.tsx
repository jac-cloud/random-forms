import { FormsDetailRoute } from '@/routes/forms/$quizId.lazy';
import { functions } from '@/utils';
import { Button, Stack, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedCallback } from '@mantine/hooks';
import { useNavigate } from '@tanstack/react-router';
import { ExecutionMethod } from 'appwrite';
import { useCallback, useEffect, useState } from 'react';
import { Question } from '../components';

type TQuestion = {
  question: string;
  answers: string[];
  $id: string;
};

type FormsDetails = {
  title: string;
  owner: string;
  questions: TQuestion[];
  answers: number[]; // index of array is the same as the question index,
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
        `/forms/${quizId}`,
        ExecutionMethod.GET,
      );

      if (response.responseStatusCode === 401) {
        throw navigate({ to: '/forms', search: { error: 401 } });
      }

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

          console.log(qs);

          const answers = qs.questions.reduce((acc: { [key: string]: number }, q, i) => {
            acc[q.$id] = qs.answers[i];
            return acc;
          }, {});

          console.log(answers);

          setGivenAnswers(answers);
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

  const sendAnswers = useDebouncedCallback((givenAnswers: { [key: string]: number }) => {
    const quizAnswers = {
      answers: givenAnswers,
    };

    console.log('Sending answers', quizAnswers);

    functions
      .createExecution(
        '67120ae600174dc868f6',
        JSON.stringify(quizAnswers),
        false,
        `/forms/${quizId}/save`,
        ExecutionMethod.POST,
      )
      .then(response => {
        if (response.status !== 'completed') {
          throw new Error('Error sending answers');
        }

        console.log(response.responseBody);
      });
  }, 3000);

  useEffect(() => {
    sendAnswers(givenAnswers);
  }, [givenAnswers, sendAnswers]);

  const sendResponse = async (values: { [key: string]: string }) => {
    setSubmitting(true);
    console.log('raw', Object.entries(values));
    // 0: (2) ['671503b5001dd62295f6', '112']
    // 1: (2) ['6715039e0032815a0ad7', 'si va allettto?!']
    // 2: (2) ['671503fc001505531c92', '25% parte 2']
    // 3: (2) ['6715039d0008e94840cb', 'Bob']
    // 4: (2) ['671503e20016ce641d1b', 'Golang']

    const givenAnswers = Object.entries(values).reduce((acc: { [key: string]: number }, [key, value]) => {
      acc[key] = value ? (quiz?.questions.find(q => q.$id === key)?.answers.indexOf(value) ?? -1) : -1;
      return acc;
    }, {});

    console.log('Submitting', givenAnswers);
    setSubmitting(false);

    if (!false) {
      return;
    }

    const response = await functions.createExecution(
      '67120ae600174dc868f6',
      JSON.stringify({
        answers: givenAnswers,
      }),
      false,
      `/forms/${quizId}/submit`,
      ExecutionMethod.POST,
    );

    if (response.status !== 'completed') {
      throw new Error('Error sending answers');
    }

    console.log(response.responseBody);
  };

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: Object.entries(givenAnswers).reduce((acc: { [key: string]: string | undefined }, [key, value]) => {
      acc[key] = value === -1 || value === undefined ? undefined : String(value);
      return acc;
    }, {}),

    onValuesChange: values => {
      console.log('Values changed', values);
      const updatedAnswers = Object.entries(values).reduce((acc: { [key: string]: number }, [key, value]) => {
        acc[key] = value ? (quiz?.questions.find(q => q.$id === key)?.answers.indexOf(value) ?? -1) : -1;
        return acc;
      }, {});

      setGivenAnswers(updatedAnswers);
    },

    validate: quiz?.questions.reduce((acc: { [key: string]: (value: string | undefined) => string | undefined }, q) => {
      acc[q.$id] = value => {
        if (value === undefined || value === '-1') {
          return 'Please select an answer';
        }

        return undefined;
      };
      return acc;
    }, {}),
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
        <form onSubmit={form.onSubmit(values => sendResponse(values))}>
          {quiz.questions.map((q, i) => {
            console.log(JSON.stringify(form.getInputProps(q.$id)));
            return (
              <Question
                key={form.key(q.$id)}
                index={i + 1}
                question={q.question}
                answers={q.answers}
                {...form.getInputProps(q.$id)}
              />
            );
          })}

          <Button type="submit" loading={submitting}>
            Submit
          </Button>
        </form>
      </Stack>
    </Stack>
  );
}
