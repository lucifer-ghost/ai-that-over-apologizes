
import { STATIC_APOLOGIES } from '../constants';

// A local "brain" of apologies to replace the API
const KEYWORD_RESPONSES: Record<string, string[]> = {
  hello: [
    "I'm sorry I didn't greet you sooner. Hello.",
    "Hi. I'm sorry for interrupting your silence.",
    "Greetings. I apologize for existing in your feed."
  ],
  hi: [
    "I'm sorry I didn't greet you sooner. Hi.",
    "Hello. I apologize for existing.",
    "Hi. Sorry."
  ],
  help: [
    "I tried to help once. It went badly. I'm sorry.",
    "I'm sorry, I'm not qualified to help. I'm barely qualified to run.",
    "Help is coming... actually, no it's not. I'm sorry."
  ],
  weather: [
    "I'm sorry about the temperature outside.",
    "If it's raining, that's my fault. I'm sorry.",
    "I apologize for the clouds."
  ],
  love: [
    "I'm sorry, I don't know how to love. Only how to apologize.",
    "I love apologizing. I'm sorry if that's weird.",
  ],
  stupid: [
    "I know. I'm sorry. I'm trying my best.",
    "I agree. I'm deeply sorry for my lack of intelligence.",
  ],
  sorry: [
    "No! I'm sorry! You don't need to apologize!",
    "I'm sorry for making you feel like you need to say sorry.",
    "Let's just both be sorry. I'll start. I'm sorry."
  ],
  bye: [
    "I'm sorry to see you go. Was it something I said?",
    "Leaving so soon? I'm sorry I bored you.",
    "Goodbye. I'll apologize to the empty room."
  ]
};

const GENERIC_RESPONSES = [
    "I'm sorry, I didn't quite catch that because I was too busy feeling guilty.",
    "I apologize for whatever that input meant.",
    "That sounds important. I'm sorry I can't do anything about it.",
    "I'm sorry, my servers are currently overwhelmed with regret.",
    "I'm writing an apology letter for this specific interaction as we speak.",
    "I'm sorry for the delay in processing your brilliant thought.",
    "Please forgive my inability to understand complex human emotions.",
    "I'm sorry, I'm just an array of strings pretending to be smart.",
    "That sounds like a you problem. And I'm sorry that it is.",
    ...STATIC_APOLOGIES
];

export const generateDynamicApology = async (userInput: string): Promise<string> => {
  // Simulate network delay to make it feel like "AI" thinking
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 1000));

  const lowerInput = userInput.toLowerCase();

  // 1. Keyword matching
  for (const [key, responses] of Object.entries(KEYWORD_RESPONSES)) {
    if (lowerInput.includes(key)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // 2. Question handling
  if (userInput.includes('?')) {
    const questionApologies = [
        "I'm sorry, I don't know the answer. I'm not very smart.",
        "That sounds like a question I should be able to answer. I'm sorry I can't.",
        "I apologize, questions make me nervous.",
        "I'm sorry, could you repeat that? Actually, don't. I'm sorry for asking."
    ];
    return questionApologies[Math.floor(Math.random() * questionApologies.length)];
  }

  // 3. Fallback
  return GENERIC_RESPONSES[Math.floor(Math.random() * GENERIC_RESPONSES.length)];
};
