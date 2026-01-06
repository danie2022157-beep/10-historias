import { Story, FAQItem } from './types';

export const PAIN_POINTS = [
  {
    title: "O Roubo da Inocência Digital",
    description: "Cada minuto de tela à noite é uma descarga de dopamina artificial que vicia o sistema de recompensa do seu filho. Isso causa um 'curto-circuito' biológico que bloqueia a melatonina, gerando irritabilidade crônica e atraso no desenvolvimento cognitivo.",
    icon: "alert",
    consequence: "Dificuldade de foco, ansiedade infantil e dependência digital precoce."
  },
  {
    title: "O Fim do Casamento Silencioso",
    description: "Quando a hora de dormir vira uma guerra de 3 horas, seu relacionamento é o primeiro a morrer. Sem tempo a sós, sem diálogo e com os dois exaustos, vocês deixam de ser um casal para serem apenas 'sócios' no gerenciamento do caos.",
    icon: "broken-heart",
    consequence: "Falta de intimidade, brigas constantes por cansaço e distanciamento afetivo."
  },
  {
    title: "O Burnout da Mãe Perfeita",
    description: "A exaustão extrema faz você perder a paciência e o grito escapa. Depois, o choro escondido no banho e a culpa corrosiva. Você não é uma mãe ruim, você só está operando no limite humano por falta de um método que funcione.",
    icon: "battery",
    consequence: "Esgotamento emocional crônico, perda da alegria na maternidade e culpa constante."
  }
];

export const STORIES: Story[] = [
  {
    id: '1',
    title: 'Luna e o Vale dos Bocejos',
    description: 'Técnica de ancoragem rítmica que reduz a frequência cardíaca e induz o sono profundo em minutos através da modulação da voz.',
    imageUrl: 'https://i.imgur.com/rUXvoXv.png',
    prompt: 'Fairy Luna stars mystery'
  },
  {
    id: '2',
    title: 'O Guardião da Coragem Eterna',
    description: 'Metáforas de proteção psíquica desenhadas para curar a ansiedade de separação e o medo do escuro de forma definitiva.',
    imageUrl: 'https://i.imgur.com/u4M5cgp.png',
    prompt: 'Mia kitten garden adventure'
  },
  {
    id: '3',
    title: 'A Flor que Sonhava Nuvens',
    description: 'Protocolo de mindfulness infantil que ensina o cérebro a silenciar pensamentos acelerados após um dia de hiperestímulo.',
    imageUrl: 'https://i.imgur.com/Zz3SZVe.png',
    prompt: 'Princess and dragon friend'
  },
  {
    id: '4',
    title: 'O Voo da Tartaruga Lara',
    description: 'Exercícios de relaxamento muscular progressivo camuflados em narrativa, ideal para crianças com alta energia cinética.',
    imageUrl: 'https://i.imgur.com/Zz3SZVe.png',
    prompt: 'Turtle dreaming high stars'
  },
  {
    id: '5',
    title: 'O Segredo do Bosque Adormecido',
    description: 'Estimulação de ocitocina através da conexão parental, substituindo o pico de dopamina tóxica causado pelos vídeos rápidos.',
    imageUrl: 'https://i.imgur.com/0sMc3S3.png',
    prompt: 'Leo guardian of serena forest'
  },
  {
    id: '6',
    title: 'A Melodia das Estrelas Cadentes',
    description: 'Técnica do "vazamento de gratidão" que prepara o subconsciente para um sono leve, seguro e livre de pesadelos.',
    imageUrl: 'https://i.imgur.com/c73m1Ky.png',
    prompt: 'Boy and golden herald'
  },
  {
    id: '7',
    title: 'O Barquinho de Papel da Calma',
    description: 'Navegação mental guiada que afasta pensamentos intrusivos e prepara a criança para 10 horas de sono ininterrupto.',
    imageUrl: 'https://i.imgur.com/gKDCHyb.png',
    prompt: 'Bright moon mystery adventure'
  },
  {
    id: '8',
    title: 'Tico e o Tesouro do Silêncio',
    description: 'Ensina a criança a amar o silêncio e o repouso, transformando o quarto em um santuário de paz absoluta.',
    imageUrl: 'https://i.imgur.com/zqEc3X9.png',
    prompt: 'Magic mouse pot of gold'
  }
];

export const BONUSES = [
  {
    title: "MÉTODO: O Ritual do Sono de Ouro",
    description: "O protocolo neurocientífico passo a passo para baixar o cortisol da família inteira antes da primeira página.",
    icon: "moon",
    value: "R$ 67,00"
  },
  {
    title: "GUIA: Destoxificação Digital",
    description: "Como remover o vício em tablets e celulares sem causar crises de abstinência ou birras violentas.",
    icon: "palette",
    value: "R$ 47,00"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Meu filho é viciado em tablet, isso vai funcionar?",
    answer: "Sim! O método utiliza o 'Substituto de Encantamento'. Oferecemos uma história tão imersiva que o cérebro da criança aceita trocar a luz azul pela sua voz, que é a maior fonte de segurança dela."
  },
  {
    question: "Quanto tempo demora para ver resultado?",
    answer: "A maioria dos pais relata uma redução de 50% no tempo de adormecimento já na primeira noite. Em 7 dias, a rotina costuma estar 100% estabilizada."
  },
  {
    question: "Como recebo o material?",
    answer: "Imediatamente. Após a confirmação, você recebe o acesso vitalício no seu e-mail e um link exclusivo no WhatsApp."
  }
];

export const TESTIMONIALS = [
  {
    name: "Dra. Mariana Lemos",
    role: "Psicóloga e Mãe",
    text: "O que me surpreendeu foi a estrutura narrativa. Elas usam ganchos de relaxamento que realmente funcionam. Meus filhos agora dormem em 15 minutos.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    name: "Dr. André Santos",
    role: "Neuropediatra",
    text: "As telas à noite são tóxicas para o cérebro em desenvolvimento. Este material é a ferramenta terapêutica mais eficaz para restaurar o ciclo circadiano infantil.",
    avatar: "https://i.pravatar.cc/150?u=andre"
  },
  {
    name: "Fernanda & Ricardo",
    role: "Pais da Sofia (4 anos)",
    text: "Recuperamos nosso casamento. Ter as noites de volta para nós dois, sem estar desmaiados de sono ou estressados, salvou nossa relação.",
    avatar: "https://i.pravatar.cc/150?u=carla"
  },
  {
    name: "Juliana Duarte",
    role: "Mãe do Leo (3 anos)",
    text: "Eu vivia à base de café e culpa. Hoje o momento de dormir é o mais doce do dia. O Leo dorme sorrindo e eu finalmente descanso.",
    avatar: "https://i.pravatar.cc/150?u=juliana"
  }
];
