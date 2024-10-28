import { FormsDetailRoute } from '@/routes/forms/$quizId.lazy';
import { account, functions } from '@/utils';
import { Button, Group, NumberInput, Stack, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { ExecutionMethod } from 'appwrite';
import { useCallback, useEffect, useState } from 'react';
import { Question } from '../components';

type TQuestion = {
  question: string;
  answers: string[];
  $id: string;
};

export type FormsDetails = {
  title: string;
  owner: string;
  questions: TQuestion[];
  answers: number[]; // index of array is the same as the question index,
  questions_count: number | undefined;
};

export function FormsDetail() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const { quizId } = FormsDetailRoute.useParams();
  const [myMail, setMyMail] = useState('');
  const [quiz, setQuiz] = useState<FormsDetails | null>(null);
  const [savedQuizBeforeEdit, setSavedQuizBeforeEdit] = useState<{
    title: string;
    questions_count: number | undefined;
    questions: TQuestion[] | undefined;
  } | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const getForm = useCallback(
    async (quizId: string): Promise<FormsDetails> => {
      const response = await functions.createExecution(
        '67120ae600174dc868f6',
        undefined,
        false,
        `/forms/${quizId}`,
        ExecutionMethod.GET,
      );

      if (response.responseStatusCode === 401 || response.responseStatusCode === 400) {
        throw navigate({ to: '/forms', search: { error: response.responseStatusCode } });
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

  const saveAnswers = useDebouncedCallback((givenAnswers: { [key: string]: string | undefined }) => {
    const answersWithIndex = getAnswersWithIndex(quiz?.questions, givenAnswers);
    const filtered = Object.entries(answersWithIndex).reduce(
      (acc, [key, value]) => {
        if (value !== -1) {
          acc[key] = value;
        }
        return acc;
      },
      {} as { [key: string]: number },
    );

    const quizAnswers = {
      answers: filtered,
    };

    console.log('Saving answers', quizAnswers);

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
          throw new Error('Error saving answers');
        }

        console.log(response.responseBody);
      });
  }, 3000);

  const sendResponse = async (values: { [key: string]: string | undefined }) => {
    setSubmitting(true);

    const givenAnswers = getAnswersWithIndex(quiz?.questions, values);

    console.log('Submitting', givenAnswers);
    setSubmitting(false);

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

  function getAnswersWithIndex(questions: TQuestion[] | undefined, answers: { [key: string]: string | undefined }) {
    if (!questions) {
      throw new Error('Questions are not loaded');
    }

    return Object.entries(answers).reduce((acc: { [key: string]: number }, [key, value]) => {
      acc[key] = value ? (questions?.find(q => q.$id === key)?.answers.indexOf(value) ?? -1) : -1;
      return acc;
    }, {});
  }

  function getAnswersWithString(questions: TQuestion[] | undefined, answers: { [key: string]: number }) {
    if (!questions) {
      throw new Error('Questions are not loaded');
    }

    return Object.entries(answers).reduce((acc: { [key: string]: string | undefined }, [key, value]) => {
      acc[key] = value !== -1 ? questions?.find(q => q.$id === key)?.answers[value] : undefined;
      return acc;
    }, {});
  }

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {},

    onValuesChange: values => {
      console.log('Values changed', values);
      saveAnswers(values);
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

  function toggleEditing() {
    if (!quiz) {
      throw new Error('Quiz is not loaded');
    }

    if (!editing) {
      const saved = {
        title: quiz?.title,
        questions_count: quiz?.questions_count,
        questions: [...(quiz?.questions.map(q => ({ ...q })).map(q => ({ ...q, answers: [...q.answers] })) ?? [])],
      };

      console.log('Saving quiz', saved);
      setSavedQuizBeforeEdit(saved);
    } else {
      console.log('Restoring quiz', savedQuizBeforeEdit);
      setQuiz({
        ...quiz,
        title: savedQuizBeforeEdit?.title ?? 'No Title',
        questions_count: savedQuizBeforeEdit?.questions_count,
        questions: savedQuizBeforeEdit?.questions ?? [],
      });
    }

    setEditing(!editing);
  }

  async function saveEdits() {
    console.log('Saving edits', quiz);

    setEditing(false);

    if (!quiz) {
      throw new Error('Quiz is not loaded');
    }

    const response = await functions.createExecution(
      '67120ae600174dc868f6',
      JSON.stringify({
        title: quiz?.title,
        questions: quiz?.questions.map(q => ({ question: q.question, answers: q.answers, $id: q.$id })),
        questions_count: quiz?.questions_count === 0 ? undefined : quiz?.questions_count,
      }),
      false,
      `/forms/${quizId}/edit`,
      ExecutionMethod.POST,
    );

    if (response.status !== 'completed') {
      throw new Error('Error sending edits');
    }

    setSavedQuizBeforeEdit(null);
    console.log(response.responseBody);

    const data = JSON.parse(response.responseBody);
    setQuiz(data);
  }

  useEffect(() => {
    try {
      account.get().then(e => setMyMail(e.email));

      getForm(quizId)
        .then(qs => {
          setQuiz(qs as FormsDetails);

          const answers = qs.questions.reduce((acc: { [key: string]: number }, q, i) => {
            acc[q.$id] = qs.answers[i];
            return acc;
          }, {});

          form.setValues(getAnswersWithString(qs.questions, answers));
        })
        .catch(error => {
          console.error(error);
          setError(error as Error);
        });
    } catch (error) {
      console.error(error);
      setError(error as Error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, getForm]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <Stack p="1rem">
      <Title order={1} mb={16}>
        Quiz: {quiz.title}
      </Title>
      <Stack>
        <form onSubmit={form.onSubmit(values => sendResponse(values))}>
          {quiz.questions.map((q, i) => (
            <Question
              key={form.key(q.$id)}
              index={i}
              editing={editing}
              quiz={quiz}
              quizSetter={setQuiz}
              {...form.getInputProps(q.$id)}
            />
          ))}

          {editing ? (
            <>
              <IconPlus
                onClick={() => {
                  const newQuiz = { ...quiz };
                  newQuiz.questions.push({ question: '', answers: [], $id: Math.random().toString(36).substring(7) });
                  setQuiz(newQuiz);
                }}
              />
              <Group>
                <NumberInput
                  mb={8}
                  label="Question Count"
                  description="How many questions should be displayed? (0 for all)"
                  min={0}
                  max={quiz.questions.length}
                  defaultValue={quiz.questions_count ?? 0}
                  step={1}
                  variant="filled"
                  placeholder="Enter a number"
                  onBlur={e => {
                    if (e.target.value === '') {
                      return;
                    }

                    const newQuiz = { ...quiz };
                    newQuiz.questions_count = parseInt(e.target.value, 10);
                    setQuiz(newQuiz);
                  }}
                />
              </Group>
            </>
          ) : null}

          {quiz.owner === myMail ? (
            <Button mr={2} onClick={toggleEditing}>
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          ) : null}
          {editing ? (
            <Button mr={2} onClick={saveEdits}>
              Save
            </Button>
          ) : null}
          <Button mr={2} onClick={() => navigate({ to: '/forms', search: { error: undefined } })}>
            Back
          </Button>

          <Button type="submit" loading={submitting}>
            Submit
          </Button>
        </form>
      </Stack>
    </Stack>
  );
}
