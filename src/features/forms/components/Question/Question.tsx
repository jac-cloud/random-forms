import { CloseButton, Group, Radio, type RadioGroupProps, Stack, TextInput, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { FormsDetails } from '../../pages';

interface QuestionProps extends Partial<RadioGroupProps> {
  index: number;
  editing: boolean;

  quiz: FormsDetails;
  quizSetter: (quiz: FormsDetails) => void;
}

export function Question({ index, quiz, editing, quizSetter, ...others }: QuestionProps) {
  function DeleteAnswer(i: number) {
    const newQuiz = { ...quiz };
    newQuiz.questions[index].answers.splice(i, 1);
    quizSetter(newQuiz);
  }

  function AddAnswer() {
    const newQuiz = { ...quiz };
    newQuiz.questions[index].answers.push('');
    quizSetter(newQuiz);
  }

  const { question, answers } = quiz.questions[index];

  return (
    <Stack m={8}>
      <Title order={2}>
        {index + 1}. {question}
      </Title>
      <Radio.Group {...others}>
        <Stack pb={8}>
          {answers.map(a => {
            return (
              <Group>
                <Radio
                  value={a}
                  label={
                    editing ? (
                      <TextInput
                        defaultValue={a}
                        onBlur={e => {
                          const newQuiz = { ...quiz };
                          newQuiz.questions[index].answers[answers.indexOf(a)] = e.target.value;
                          quizSetter(newQuiz);
                        }}
                      />
                    ) : (
                      a
                    )
                  }
                  key={a}
                />
                {editing && <CloseButton onClick={() => DeleteAnswer(answers.indexOf(a))} />}
              </Group>
            );
          })}
          {editing && <IconPlus onClick={AddAnswer} />}
        </Stack>
      </Radio.Group>
    </Stack>
  );
}
