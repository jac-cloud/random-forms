import { FormsDetailRoute } from '@/routes/forms/$quizId.lazy';
import { Stack, Title } from '@mantine/core';
import { Question } from '../components';

const questions = [
  {
    question: 'Quale funzione in Excel somma i valori di un intervallo?',
    answers: ['=SOMMA()', '=MEDIA()', '=CONTA()', '=SE()'],
  },
  {
    question: "Cosa rappresenta '$' in una cella di Excel?",
    answers: ['Riferimento assoluto', 'Riferimento relativo', 'Formula', 'Valuta'],
  },
  {
    question: 'Qual è la scorciatoia per salvare un file in Excel?',
    answers: ['Ctrl+S', 'Ctrl+C', 'Ctrl+Z', 'Ctrl+V'],
  },
  {
    question: 'Quale tipo di grafico è ideale per rappresentare percentuali?',
    answers: ['Grafico a torta', 'Grafico a barre', 'Grafico a dispersione', 'Grafico a linee'],
  },
  {
    question: 'Come si crea una tabella pivot in Excel?',
    answers: ['Inserisci > Tabella pivot', 'Dati > Ordinamento', 'Home > Formatta', 'File > Apri'],
  },
];

export function FormsDetail() {
  const { quizId } = FormsDetailRoute.useParams();

  return (
    <Stack>
      <Title order={1} mb={16}>
        Quiz: {quizId}
      </Title>
      <Stack>
        {questions.map((q, i) => (
          <Question index={i + 1} id={'123'} question={q.question} answers={q.answers} />
        ))}
      </Stack>
    </Stack>
  );
}
