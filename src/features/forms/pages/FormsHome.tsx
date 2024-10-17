import { ActionIcon, Center, Group, TextInput, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowRight } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

export function FormsHome() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      quizCode: '',
    },
  });

  return (
    <Center h={'100%'}>
      <form
        onSubmit={form.onSubmit(v =>
          navigate({
            to: `/forms/${v.quizCode}`,
          }),
        )}
      >
        <Group align="end">
          <TextInput
            styles={{
              label: {
                fontSize: rem(18),
                marginBottom: rem(4),
              },
            }}
            label="Codice quiz"
            w={300}
            {...form.getInputProps('quizCode')}
          />
          <ActionIcon type="submit" disabled={form.getValues().quizCode.length === 0} mb={4}>
            <IconArrowRight type="submit" />
          </ActionIcon>
        </Group>
      </form>
    </Center>
  );
}
