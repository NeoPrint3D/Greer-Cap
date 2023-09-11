interface Question {
  question: string;
  points: 10 | 25 | 50;
  options: string[];
  answer: string;
}

interface Data {
  questions: Question[];
}

export const data: Data = {
  questions: [
    {
      question: "Which of the following is correctly capitalized?",
      points: 10,
      options: [
        "apple pie is delicious.",
        "Apple pie is delicious.",
        "apple Pie is delicious.",
        "apple pie Is delicious.",
      ],
      answer: "Apple pie is delicious.",
    },
    {
      question: "Which city name is correctly capitalized?",
      points: 10,
      options: ["new york", "New york", "new York", "New York"],
      answer: "New York",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 10,
      options: [
        "it's a beautiful day in the neighborhood.",
        "It's a Beautiful day in the neighborhood.",
        "It's a beautiful Day in the neighborhood.",
        "It's a beautiful day in the neighborhood.",
      ],
      answer: "It's a beautiful day in the neighborhood.",
    },
    {
      question: "Which title is correctly capitalized?",
      points: 10,
      options: [
        "lord of the rings",
        "Lord Of The Rings",
        "Lord of The Rings",
        "Lord of the Rings",
      ],
      answer: "Lord of the Rings",
    },
    {
      question: "Which brand name is correctly capitalized?",
      points: 10,
      options: ["microsoft", "MicroSoft", "Microsoft", "MicrosOft"],
      answer: "Microsoft",
    },
    {
      question: "Which month is correctly capitalized?",
      points: 10,
      options: ["october", "OctOber", "octOber", "October"],
      answer: "October",
    },
    {
      question: "Which holiday is correctly capitalized?",
      points: 10,
      options: [
        "valentine's day",
        "Valentine's Day",
        "Valentine's day",
        "valentine's Day",
      ],
      answer: "Valentine's Day",
    },
    {
      question: "Which is the correct capitalization of a famous landmark?",
      points: 10,
      options: [
        "statue of liberty",
        "Statue of liberty",
        "Statue Of Liberty",
        "Statue of Liberty",
      ],
      answer: "Statue of Liberty",
    },
    {
      question: "Which is the correct capitalization for a famous painting?",
      points: 10,
      options: [
        "the starry night",
        "The starry night",
        "The Starry Night",
        "The Starry night",
      ],
      answer: "The Starry Night",
    },
    {
      question: "Which is the correct capitalization for a planet?",
      points: 10,
      options: ["mars", "Mars", "MARS", "mARs"],
      answer: "Mars",
    },
    {
      question: "Which is the correct capitalization for a day of the week?",
      points: 10,
      options: ["friday", "Friday", "FRIDAY", "friDay"],
      answer: "Friday",
    },
    {
      question: "Which is the correct capitalization for a country?",
      points: 10,
      options: ["canada", "Canada", "CANADA", "cAnada"],
      answer: "Canada",
    },
    {
      question: "Which is the correct capitalization for a continent?",
      points: 10,
      options: ["africa", "Africa", "AFRICA", "aFrica"],
      answer: "Africa",
    },
    {
      question: "Which is the correct capitalization for a famous author?",
      points: 10,
      options: ["j.k. rowling", "J.K. Rowling", "J.k. Rowling", "j.K. Rowling"],
      answer: "J.K. Rowling",
    },
    {
      question: "Which is the correct capitalization for a famous scientist?",
      points: 10,
      options: [
        "albert einstein",
        "Albert einstein",
        "Albert Einstein",
        "albert Einstein",
      ],
      answer: "Albert Einstein",
    },
    {
      question: "Which is the correct capitalization for a river?",
      points: 10,
      options: [
        "mississippi river",
        "Mississippi river",
        "mississippi River",
        "Mississippi River",
      ],
      answer: "Mississippi River",
    },
    {
      question: "Which is the correct capitalization for a mountain?",
      points: 10,
      options: [
        "mount everest",
        "Mount everest",
        "mount Everest",
        "Mount Everest",
      ],
      answer: "Mount Everest",
    },
    {
      question: "Which is the correct capitalization for a famous building?",
      points: 10,
      options: ["eiffel tower", "Eiffel tower", "eiffel Tower", "Eiffel Tower"],
      answer: "Eiffel Tower",
    },
    {
      question: "Which is the correct capitalization for a famous movie?",
      points: 10,
      options: [
        "the godfather",
        "The godfather",
        "The Godfather",
        "the Godfather",
      ],
      answer: "The Godfather",
    },
    {
      question: "Which is the correct capitalization for an ocean?",
      points: 10,
      options: [
        "pacific ocean",
        "Pacific ocean",
        "pacific Ocean",
        "Pacific Ocean",
      ],
      answer: "Pacific Ocean",
    },
    {
      question: "Which of the following sentences is correctly capitalized?",
      points: 25,
      options: [
        "The Treaty of Versailles ended World War I.",
        "The Treaty of versailles ended World War I.",
        "The Treaty Of Versailles ended World War I.",
        "The treaty of Versailles ended world war I.",
      ],
      answer: "The Treaty of Versailles ended World War I.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "She read 'Pride and Prejudice' by Jane Austen.",
        "She read 'Pride and prejudice' by Jane Austen.",
        "She read 'Pride and Prejudice' by jane Austen.",
        "She read 'Pride And Prejudice' by Jane Austen.",
      ],
      answer: "She read 'Pride and Prejudice' by Jane Austen.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "The Amazon River flows through South America.",
        "The Amazon river flows through South America.",
        "The amazon River flows through South America.",
        "The Amazon river flows through south America.",
      ],
      answer: "The Amazon River flows through South America.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "The Golden Gate Bridge is in San Francisco.",
        "The Golden Gate bridge is in San Francisco.",
        "The Golden gate Bridge is in San Francisco.",
        "The golden gate bridge is in San Francisco.",
      ],
      answer: "The Golden Gate Bridge is in San Francisco.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "She studied the Renaissance period in Europe.",
        "She studied the renaissance period in Europe.",
        "She studied the Renaissance Period in Europe.",
        "She studied The Renaissance period in Europe.",
      ],
      answer: "She studied the Renaissance period in Europe.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "The Declaration of Independence was signed in 1776.",
        "The declaration of Independence was signed in 1776.",
        "The Declaration Of Independence was signed in 1776.",
        "The Declaration of independence was signed in 1776.",
      ],
      answer: "The Declaration of Independence was signed in 1776.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "Mount Kilimanjaro is the highest peak in Africa.",
        "Mount kilimanjaro is the highest peak in Africa.",
        "Mount Kilimanjaro is The highest peak in Africa.",
        "mount Kilimanjaro is the highest peak in Africa.",
      ],
      answer: "Mount Kilimanjaro is the highest peak in Africa.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "The Mona Lisa was painted by Leonardo da Vinci.",
        "The Mona lisa was painted by Leonardo Da Vinci.",
        "The Mona Lisa was painted by leonardo da Vinci.",
        "The mona Lisa was painted by Leonardo da Vinci.",
      ],
      answer: "The Mona Lisa was painted by Leonardo da Vinci.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "The Pacific Ocean is the largest ocean on Earth.",
        "The pacific ocean is the largest ocean on Earth.",
        "The Pacific ocean is the largest Ocean on Earth.",
        "The Pacific Ocean is the largest Ocean on earth.",
      ],
      answer: "The Pacific Ocean is the largest ocean on Earth.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "The Summer Olympics were held in Tokyo in 2020.",
        "The summer Olympics were held in Tokyo in 2020.",
        "The Summer olympics were held in tokyo in 2020.",
        "The summer olympics were held in Tokyo in 2020.",
      ],
      answer: "The Summer Olympics were held in Tokyo in 2020.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "She visited the Grand Canyon last summer.",
        "She visited the Grand canyon last summer.",
        "She visited the Grand Canyon last Summer.",
        "She visited the grand canyon last summer.",
      ],
      answer: "She visited the Grand Canyon last summer.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "The Harry Potter series was written by J.K. Rowling.",
        "The harry potter series was written by J.K. Rowling.",
        "The Harry Potter Series was written by J.K. Rowling.",
        "The Harry Potter series was written by j.k. Rowling.",
      ],
      answer: "The Harry Potter series was written by J.K. Rowling.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "The Sahara Desert spans several African countries.",
        "The sahara desert spans several African countries.",
        "The Sahara Desert spans several african countries.",
        "The Sahara desert spans several African countries.",
      ],
      answer: "The Sahara Desert spans several African countries.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "The United Nations aims to promote global cooperation.",
        "The united nations aims to promote global cooperation.",
        "The United Nations aims to promote Global cooperation.",
        "The United nations aims to promote global cooperation.",
      ],
      answer: "The United Nations aims to promote global cooperation.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "The Great Barrier Reef is off the coast of Australia.",
        "The great barrier reef is off the coast of Australia.",
        "The Great Barrier reef is off the coast of Australia.",
        "The Great barrier Reef is off the coast of Australia.",
      ],
      answer: "The Great Barrier Reef is off the coast of Australia.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "The Milky Way Galaxy is our home in the universe.",
        "The milky way galaxy is our home in the universe.",
        "The Milky way Galaxy is our home in the Universe.",
        "The Milky Way galaxy is our home in the universe.",
      ],
      answer: "The Milky Way Galaxy is our home in the universe.",
    },
    {
      question: "Which sentence is correctly capitalized?",
      points: 25,
      options: [
        "The Pyramids of Giza are ancient wonders in Egypt.",
        "The pyramids of Giza are ancient wonders in Egypt.",
        "The Pyramids of Giza are ancient wonders in egypt.",
        "The Pyramids of giza are ancient wonders in Egypt.",
      ],
      answer: "The Pyramids of Giza are ancient wonders in Egypt.",
    },
  ],
};
