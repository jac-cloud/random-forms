import { Radio, type RadioGroupProps, Stack, Title } from '@mantine/core';

interface QuestionProps extends Partial<RadioGroupProps> {
  index: number;
  id: string;
  question: string;
  answers: string[];
  givenAnswers: { [key: string]: number };
  setGivenAnswers: (answers: { [key: string]: number }) => void;
}

export function Question({ index, id, question, answers, givenAnswers, setGivenAnswers, ...others }: QuestionProps) {
  console.log(id);

  return (
    <Stack m={8}>
      <Title order={2}>
        {index}. {question}
      </Title>
      <Radio.Group {...others}>
        <Stack pb={8}>
          {answers.map(a => (
            <Radio
              value={a}
              label={a}
              key={a}
              checked={givenAnswers[id] === answers.indexOf(a)}
              onChange={() => setGivenAnswers({ ...givenAnswers, [id]: answers.indexOf(a) })}
            />
          ))}
        </Stack>
      </Radio.Group>
    </Stack>
  );
}
