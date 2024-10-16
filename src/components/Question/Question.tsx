import { Radio, Stack, Title } from '@mantine/core';

interface QuestionProps {
  index: number;
  id: string;
  question: string;
  answers: string[];
}

export function Question({ index, id, question, answers }: QuestionProps) {
  console.log(id);
  return (
    <Stack m={8}>
      <Title order={2}>
        {index}. {question}
      </Title>
      <Radio.Group>
        <Stack>
          {answers.map(a => (
            <Radio value={a} label={a} />
          ))}
        </Stack>
      </Radio.Group>
    </Stack>
  );
}
