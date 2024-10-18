import { FormsDetailRoute } from '@/routes/forms/$quizId.lazy';
import { Stack, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
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

type Question = {
  question: string;
  answers: string[];
};

type FormsDetails = {
  title: string;
  owner: string;
  questions: Question[];
};

export function FormsDetail() {
  const { quizId } = FormsDetailRoute.useParams();

  async function getForm() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: 'Excel',
          owner: 'Microsoft',
          questions,
        });
      }, 1000);
    });
  }

  const [quiz, setQuiz] = useState<FormsDetails | null>(null);
  useEffect(() => {
    getForm().then(qs => {
      setQuiz(qs as FormsDetails);
    });
  }, []);

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
          <Question key={i} index={i + 1} id={'123'} question={q.question} answers={q.answers} />
        ))}
      </Stack>
    </Stack>
  );
}
