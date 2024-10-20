import { Radio, type RadioGroupProps, Stack, Title } from '@mantine/core';

interface QuestionProps extends Partial<RadioGroupProps> {
  index: number;
  question: string;
  answers: string[];
}

export function Question({ index, question, answers, ...others }: QuestionProps) {
  return (
    <Stack m={8}>
      <Title order={2}>
        {index}. {question}
      </Title>
      <Radio.Group {...others}>
        <Stack pb={8}>
          {answers.map((a, i) => {
            return <Radio value={i} label={a} key={a} />;
          })}
        </Stack>
      </Radio.Group>
    </Stack>
  );
}
