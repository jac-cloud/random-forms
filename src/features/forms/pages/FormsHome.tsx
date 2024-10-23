import { FormsHomeRoute } from '@/routes/forms';
import { ActionIcon, Center, Group, Stack, Text, TextInput, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowRight } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

export function FormsHome() {
  const navigate = useNavigate();

  const { error } = FormsHomeRoute.useSearch();

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
        <Stack gap={8}>
          <Group align="end">
            <TextInput
              styles={{
                label: {
                  fontSize: rem(18),
                  marginBottom: rem(4),
                },
              }}
              label="Codice quiz"
              placeholder="codice-quiz"
              w={300}
              {...form.getInputProps('quizCode')}
            />
            <ActionIcon type="submit" disabled={form.getValues().quizCode.length === 0} mb={4}>
              <IconArrowRight type="submit" />
            </ActionIcon>
          </Group>
          {error && (
            <Text fz={12} c="red.9">
              {error === 404 ? 'Non esiste nessun quiz con quel codice' : ''}
              {error === 401 ? 'Non hai il permesso di visualizzare questo form' : ''}
            </Text>
          )}
        </Stack>
      </form>
    </Center>
  );
}
