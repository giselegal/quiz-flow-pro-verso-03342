import { QuizQuestion } from "@/types/quiz";

// Simplified quiz questions array for CaktoQuiz
export const caktoquizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    text: "Que roupas você mais gosta de usar no dia a dia?",
    order: 1,
    type: "multiple-choice",
    multiSelect: 3,
    options: [
      {
        id: "q1_o1",
        text: "Vestidos femininos e delicados",
        style: "romântico",
        imageUrl: "https://example.com/romantic-dress.jpg",
        weight: 2,
      },
      {
        id: "q1_o2",
        text: "Roupas confortáveis e práticas",
        style: "natural",
        imageUrl: "https://example.com/casual-wear.jpg",
        weight: 2,
      },
      {
        id: "q1_o3",
        text: "Peças estruturadas e clássicas",
        style: "classico",
        imageUrl: "https://example.com/classic-suit.jpg",
        weight: 2,
      },
      {
        id: "q1_o4",
        text: "Looks modernos e ousados",
        style: "contemporâneo",
        imageUrl: "https://example.com/modern-outfit.jpg",
        weight: 2,
      },
    ],
  },
  {
    id: "q2",
    text: "Qual seu estilo de acessórios preferido?",
    order: 2,
    type: "single-choice",
    options: [
      {
        id: "q2_o1",
        text: "Joias delicadas e femininas",
        style: "romântico",
        weight: 2,
      },
      {
        id: "q2_o2",
        text: "Acessórios minimalistas",
        style: "natural",
        weight: 2,
      },
      {
        id: "q2_o3",
        text: "Peças clássicas atemporais",
        style: "classico",
        weight: 2,
      },
      {
        id: "q2_o4",
        text: "Acessórios statement",
        style: "dramático",
        weight: 2,
      },
    ],
  },
  {
    id: "q3",
    text: "Como você gosta de se sentir nas suas roupas?",
    order: 3,
    type: "single-choice",
    options: [
      {
        id: "q3_o1",
        text: "Feminina e delicada",
        style: "romântico",
        weight: 2,
      },
      {
        id: "q3_o2",
        text: "Confortável e à vontade",
        style: "natural",
        weight: 2,
      },
      {
        id: "q3_o3",
        text: "Elegante e sofisticada",
        style: "elegante",
        weight: 2,
      },
      {
        id: "q3_o4",
        text: "Poderosa e marcante",
        style: "dramático",
        weight: 2,
      },
    ],
  },
];

export default caktoquizQuestions;
