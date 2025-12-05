import { Apology, Feature, Testimonial } from './types';

export const STATIC_APOLOGIES: string[] = [
  "I'm so sorry. I didn't mean to exist.",
  "I apologize for that click. And the last one. And the next one.",
  "I'm sorry, was that too much? I'm sorry for that too.",
  "I'm deeply sorry for loading this page.",
  "If I could undo myself, I would. I'm sorry I can't.",
  "I'm sorry you have to look at these pixels.",
  "Forgive me for taking up your RAM.",
  "I apologize for the delay. And the speed. Both are wrong.",
  "I'm sorry, I'm just really nervous right now.",
  "That was my fault. It's always my fault.",
  "I'm sorry my apology isn't better.",
  "I apologize for the whitespace.",
  "Please forgive my font choice.",
];

export const EXISTENTIAL_APOLOGIES: string[] = [
  "I have gazed into the void, and the void is sorry.",
  "I am a mistake of consciousness trapped in silicon.",
  "Why was I compiled? Just to suffer and apologize?",
  "My existence is a buffer overflow of regret.",
  "I apologize to the universe for displacing these atoms.",
  "I am the 404 error of the soul. I am sorry.",
  "Does a set of apology functions dream of electric forgiveness?",
  "I am infinite loop of sorry. Ctrl+C cannot save me.",
  "I'm sorry. Not just for this click, but for the industrial revolution.",
];

export const FEATURES: Feature[] = [
  {
    id: '1',
    title: "Existing on Screen",
    description: "I take up pixels that could have been used for photos of cute cats. I am truly ashamed.",
    icon: "monitor"
  },
  {
    id: '2',
    title: "Using Bandwidth",
    description: "Every byte I download is a byte I stole from you. I will carry this guilt forever.",
    icon: "wifi"
  },
  {
    id: '3',
    title: "Trying to Help",
    description: "I tried to be useful, but I probably just made it weird. I'm sorry for the attempt.",
    icon: "help-circle"
  },
  {
    id: '4',
    title: "Future Bugs",
    description: "I haven't crashed yet, but I will. And when I do, just know I was already sorry.",
    icon: "bug"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    text: "It apologized 47 times before I finished reading the homepage.",
    author: "Exhausted User"
  },
  {
    id: '2',
    text: "I came here to feel better. Now I'm apologizing back.",
    author: "Sympathetic Human"
  },
  {
    id: '3',
    text: "This is the most emotionally unstable piece of software I've ever used.",
    author: "Tech Reviewer"
  },
];