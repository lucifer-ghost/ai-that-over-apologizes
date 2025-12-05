export interface Apology {
  id: string;
  text: string;
  intensity: 'mild' | 'medium' | 'existential_crisis';
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
}

export type ApologyHandler = (trigger?: string) => void;