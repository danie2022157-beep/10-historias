import { Story, FAQItem } from './types';

export const COMPARISON = [
  { item: "Estado Cerebral", screens: "Agitação por Dopamina (Alerta)", method: "Ocitocina Natural (Relaxamento)" },
  { item: "Qualidade do REM", screens: "Sono Fragmentado e Pesadelos", method: "Sono Profundo e Reparador" },
  { item: "Neuroplasticidade", screens: "Bloqueio do Aprendizado Noturno", method: "Estímulo à Criatividade e Foco" },
  { item: "Conexão Afetiva", screens: "Isolamento Digital (Telas)", method: "Memórias de Afeto Vitalícias" },
];

export const STEPS = [
  { title: "Acesso Instantâneo", desc: "Receba o link direto no seu WhatsApp e E-mail segundos após a decisão.", icon: "zap" },
  { title: "Escolha a Jornada", desc: "10 temas diferentes para cada estado emocional: coragem, calma ou gratidão.", icon: "book" },
  { title: "Paz em 15 Minutos", desc: "Siga o ritmo sugerido e veja seu pequeno adormecer com um sorriso.", icon: "moon" },
];

export const PAIN_POINTS = [
  {
    title: "A Tirania das Telas",
    description: "Cada minuto de vídeo 'calmante' no tablet é uma injeção de dopamina que mantém o cérebro em alerta máximo. O que parece descanso é, na verdade, um bloqueio biológico da melatonina.",
    icon: "alert"
  },
  {
    title: "A 'Guerra' do Quarto",
    description: "A exaustão de tentar fazer um filho dormir por 2 horas destrói a sua paciência e o clima da casa. Você termina o dia se sentindo culpada, frustrada e sem energia para você mesma.",
    icon: "broken-heart"
  },
  {
    title: "O Sono que Não Volta",
    description: "Uma criança que dorme mal não apenas acorda cansada; ela perde janelas cruciais de desenvolvimento cognitivo e emocional. O sono reparador não é luxo, é um direito de saúde.",
    icon: "battery"
  }
];

export const STORIES: Story[] = [
  {
    id: '1',
    title: 'Luna e o Vale dos Bocejos',
    description: 'Focada em relaxamento muscular através de metáforas de natureza calma.',
    imageUrl: 'https://i.imgur.com/MKGwLvt.png',
    prompt: 'Luna and the sleepy valley, ethereal lighting, children book style'
  },
  {
    id: '2',
    title: 'O Guardião da Coragem',
    description: 'Ideal para crianças com medo do escuro ou ansiedade de separação.',
    imageUrl: 'https://i.imgur.com/d1Nvu6y.png',
    prompt: 'Lion guardian of courage, magical protective shield'
  },
  {
    id: '3',
    title: 'A Flor das Nuvens',
    description: 'Trabalha a imaginação guiada para silenciar pensamentos acelerados.',
    imageUrl: 'https://i.imgur.com/AcnU0pX.png',
    prompt: 'Flower of the clouds, soft pastels'
  },
  {
    id: '4',
    title: 'O Voo da Tartaruga Lara',
    description: 'Lenta e cadenciada, perfeita para as noites de agitação extrema.',
    imageUrl: 'https://i.imgur.com/4McLJCH.png',
    prompt: 'Flying turtle Lara, peaceful underwater flight'
  },
  {
    id: '5',
    title: 'O Alfaiate de Sonhos',
    description: 'Ensina a criança a "escolher" seus sonhos antes de apagar as luzes.',
    imageUrl: 'https://i.imgur.com/ENr3T6Q.png',
    prompt: 'Dream tailor, celestial needles and threads'
  },
  {
    id: '6',
    title: 'O Reino do Silêncio Doce',
    description: 'Utiliza pausas estratégicas para baixar a frequência cardíaca.',
    imageUrl: 'https://i.imgur.com/dCDdDJd.png',
    prompt: 'Sweet silence kingdom, sugar clouds'
  },
  {
    id: '7',
    title: 'Pipo, o Balão Calmo',
    description: 'Focada em exercícios de respiração disfarçados de brincadeira.',
    imageUrl: 'https://i.imgur.com/mGnf2me.png',
    prompt: 'Pipo the calm balloon, soft floating'
  },
  {
    id: '8',
    title: 'A Floresta dos Murmúrios',
    description: 'Rica em onomatopeias que imitam ruído branco natural.',
    imageUrl: 'https://i.imgur.com/0h8eMfa.png',
    prompt: 'Whispering forest, magical trees'
  },
  {
    id: '9',
    title: 'O Astronauta Cansado',
    description: 'Transforma o quarto em um refúgio seguro no espaço sideral.',
    imageUrl: 'https://i.imgur.com/ZD55GTv.png',
    prompt: 'Small astronaut space sleeping, cozy pod'
  },
  {
    id: '10',
    title: 'A Sinfonia das Estrelas',
    description: 'Um fechamento de dia focado em gratidão e segurança emocional.',
    imageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=1000&auto=format&fit=crop',
    prompt: 'Star symphony night, musical notes as stars'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Funciona para crianças de qual idade?",
    answer: "O vocabulário e o ritmo foram desenhados para crianças entre 2 e 8 anos, mas temos muitos relatos de bebês e até pré-adolescentes que se acalmam com o método."
  },
  {
    question: "E se meu filho for muito agitado?",
    answer: "É justamente para eles! O 'vício' em estímulos visuais é substituído pela cadência da sua voz, o que reduz o cortisol e induz o sono naturalmente."
  },
  {
    question: "Sou professora, posso usar em sala?",
    answer: "Com certeza! É um recurso fantástico para o momento do descanso em escolas de educação infantil, ajudando a regular o coletivo e acalmar os ânimos."
  },
  {
    question: "Preciso imprimir o material?",
    answer: "Não é obrigatório. Você recebe o PDF otimizado para celulares, tablets e impressão. Muitos pais gostam de ler na luz baixa do celular com filtro de luz azul."
  }
];

export const TESTIMONIALS = [
  {
    name: "Ana Cláudia",
    role: "Mãe da Alice (3 anos)",
    text: "Eu não acreditava mais. Gastava 2 horas toda noite. Na segunda noite com o 'Vale dos Bocejos', ela dormiu em 12 minutos. Minha vida mudou.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Ricardo Mendes",
    role: "Pai do Bruno (5 anos)",
    text: "O Bruno tinha muito medo de dormir sozinho. A história do Guardião deu a segurança que faltava. Agora ele pede para ler e dorme tranquilo.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Profa. Letícia",
    role: "Educadora Infantil",
    text: "Uso as histórias no momento da soneca na escola. O ambiente muda completamente. As crianças ficam mais serenas e focadas após o descanso.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
  }
];