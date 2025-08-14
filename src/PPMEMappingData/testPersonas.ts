import { VoterFormValues } from "@/schemas/voterFormSchema";
import { Mode } from "@/types/api";

export interface PersonaData extends VoterFormValues {
  description: string;
  age: number;
  location: string;
}

export const personas: Record<string, PersonaData> = {
  "Sal": {
    mode: "demo" as Mode,
    zipCode: "48104",
    description: "Sal is a mixed-race student athlete who's thoughtful but cautious. He's grown up hearing strong opinions from both sides of his family, but keeps his own close.",
    age: 20,
    location: "Ann Arbor, MI",
    priorities: [
      "I don't want to be labeled or canceled just for having questions. It gives me a lot of anxiety so I tend to keep quiet.",
      "I think we should be doing way more about the environment, but not just forcing people to drive electric cars.",
      "People should be free to say their pronouns if they want, but I don't want it forced on me.",
      "Censorship freaks me out — like how social media hides stuff depending on who posts it.",
      "I feel like most people in politics are probably corrupt so it's hard to get excited about politics. Can it be fixed?",
      "I'm lucky to be on scholarship, but I don't get how college costs so much when we say education matters."
    ]
  },
  "Danielle": {
    mode: "demo" as Mode,
    zipCode: "63118",
    description: "Danielle struggles with anxiety and often feels overwhelmed by the news and life. Her views are a mix of pro-women politics, personal fear, and economic frustration.",
    age: 32,
    location: "St. Louis, MO",
    priorities: [
      "I want women to have choices and control over our bodies.",
      "I'm scared about what I see in the news — violent immigrant rapists, home invasions… I feel unsafe. Also, what's with pardoning criminals? That's nuts!",
      "The rich keep getting richer while regular people can't even pay rent. It's rigged.",
      "We need better mental health care, especially for people like me who can't afford therapy.",
      "I think it is important that the law protects LGBTQ+ rights, prevents racial discrimination.",
      "I voted once, but it felt forced, like I didn't have anyone great to choose from. Just because a candidate is a woman doesn't mean she's going to be any better."
    ]
  },
  "Joe": {
    mode: "demo" as Mode,
    zipCode: "15237",
    description: "Joe grew up with strong conservative values and still holds many of them, especially around personal freedom and limited government. He feels alienated on campus.",
    age: 19,
    location: "Pittsburgh, PA",
    priorities: [
      "I believe in personal freedom — the government should stay out of most things.",
      "Woke politics just make everything about race and gender — I don't feel like I'm allowed to have a voice and honestly it just divides us.",
      "My parents think government spending is a disaster — and I'm starting to agree.",
      "I support gun control. My girlfriend lost a sibling in a school shooting.",
      "I don't think race or gender should factor into college admissions — it should be about effort and results.",
      "There's all this talk about mental health, but guys like me still feel like we can't say when we're struggling."
    ]
  },
  "T.J": {
    mode: "demo" as Mode,
    zipCode: "94612",
    description: "T.J. is a gay, Asian American barista and part-time youth advocate. He's emotionally intelligent, civically engaged, and concerned about human rights.",
    age: 25,
    location: "Oakland, CA",
    priorities: [
      "I want to live in a country where queer people and trans folks aren't constantly under attack.",
      "I'm sick of fake ally brands and politicians — support us with policies, not just flags in June.",
      "We need police accountability, not just promises.",
      "I'm scared of how much data is being collected about me online — and who controls it.",
      "The planet is burning and powerful people are still flying private jets.",
      "Mental health is a crisis — especially for queer youth like me."
    ]
  },
  "Gracie": {
    mode: "demo" as Mode,
    zipCode: "85001",
    description: "Gracie is a biracial Latina and White woman whose faith guides her political views. She's pro-life, safety-minded, and values traditional family structures.",
    age: 22,
    location: "Phoenix, AZ",
    priorities: [
      "Abortion ends a life — we need to support moms instead.",
      "I love my church and I want laws that respect that.",
      "I back the police — but they need to earn our trust.",
      "We need more mental health support, especially for families and veterans.",
      "I believe in traditional values — family comes first.",
      "I want to believe elections are fair — but I have doubts."
    ]
  }
};

// Pool of potential priorities for random generation with everyday language
export const priorityPool = [
  "I can't afford my medical bills and I'm worried about my family's health",
  "The schools in my neighborhood are falling apart and my kids aren't learning enough",
  "Gas prices are too high and I'm worried about being able to afford my commute",
  "Our veterans aren't getting the help they need when they come home",
  "Politicians stay in office too long and nothing ever changes",
  "I'm worried about companies knowing too much about me online",
  "I have no idea where my tax money goes and it feels like it's wasted",
  "The government keeps spending money we don't have",
  "I'm worried Social Security won't be there when I retire",
  "Small shops in my town are closing because they can't compete with big stores",
  "My prescription costs more than my car payment",
  "My kid's college loans are crushing them financially",
  "Internet at my house is terrible and I can't work from home",
  "I have to drive everywhere because there's no good bus service",
  "It seems like politicians pick their voters instead of voters picking politicians",
  "There are too many shootings in schools and we need to do something",
  "The government shouldn't touch our guns - it's our right to protect ourselves",
  "We should try talking to other countries more before getting into conflicts",
  "Too many people are crossing the border illegally and it's not fair",
  "It takes way too long for immigrants to become citizens even when they follow all the rules",
  "The Supreme Court seems more political than fair these days",
  "Some police officers get away with treating minorities badly",
  "Police are being attacked and disrespected and need more support",
  "Women should be able to make their own healthcare decisions without government interference",
  "My religious values are under attack in today's culture"
];

// Helper functions for random generation
export const getRandomZipCode = () => {
  const zipCodes = ["48104", "63118", "15237", "94612"]; // Using the same zip codes as our personas
  return zipCodes[Math.floor(Math.random() * zipCodes.length)];
};

export const getRandomPriorities = () => {
  const shuffled = [...priorityPool].sort(() => 0.5 - Math.random());
  // Return 2-4 random priorities
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 2);
};
