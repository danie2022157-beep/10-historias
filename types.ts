
export interface Story {
  id: string;
  title: string;
  description: string;
  prompt: string;
  imageUrl?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
