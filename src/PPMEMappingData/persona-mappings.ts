/**
 * Persona Priorities and Mappings
 * 
 * This file contains the mappings from persona priorities to standardized policy terms
 * based on the Persona_Priorities_and_Mappings_-_Full_View.csv file.
 */

export interface PersonaMapping {
  persona: string;
  summary: string;
  priority: string;
  mapsTo: string;
}

export const personaMappings: PersonaMapping[] = [
  // Sal (19)
  {
    persona: "Sal (19)",
    summary: "Mixed-race student athlete, cautious, values liberty, unsure politically",
    priority: "I don't want to be labeled or canceled just for having questions.",
    mapsTo: "Free expression / civil liberties"
  },
  {
    persona: "Sal (19)",
    summary: "Mixed-race student athlete, cautious, values liberty, unsure politically",
    priority: "Why can't the government agree on what we need to do to address climate change?",
    mapsTo: "Climate research + market-based climate policy"
  },
  {
    persona: "Sal (19)",
    summary: "Mixed-race student athlete, cautious, values liberty, unsure politically",
    priority: "IF trans people want to claim their pronouns...I don't want it forced on me.",
    mapsTo: "Pronoun policy / speech freedom tension"
  },
  {
    persona: "Sal (19)",
    summary: "Mixed-race student athlete, cautious, values liberty, unsure politically",
    priority: "Censorship freaks me out — like how social media hides stuff...",
    mapsTo: "Tech regulation, content moderation transparency"
  },
  {
    persona: "Sal (19)",
    summary: "Mixed-race student athlete, cautious, values liberty, unsure politically",
    priority: "Politics feels corrupt — can it be fixed?",
    mapsTo: "Government ethics, transparency reform"
  },
  {
    persona: "Sal (19)",
    summary: "Mixed-race student athlete, cautious, values liberty, unsure politically",
    priority: "College costs too much, how will we afford homes?",
    mapsTo: "Tuition reform, student debt relief, housing access"
  },
  
  // Danielle (23)
  {
    persona: "Danielle (23)",
    summary: "Anxious, pro-women, scared of crime, frustrated by inequality",
    priority: "I want women to have choices and control over our bodies.",
    mapsTo: "Reproductive rights"
  },
  {
    persona: "Danielle (23)",
    summary: "Anxious, pro-women, scared of crime, frustrated by inequality",
    priority: "Scared by violent immigrant stories... what's with pardons?",
    mapsTo: "Public safety, immigration enforcement, criminal justice"
  },
  {
    persona: "Danielle (23)",
    summary: "Anxious, pro-women, scared of crime, frustrated by inequality",
    priority: "Rich get richer, can't even pay rent.",
    mapsTo: "Income inequality, rent relief, minimum wage"
  },
  {
    persona: "Danielle (23)",
    summary: "Anxious, pro-women, scared of crime, frustrated by inequality",
    priority: "We need better mental health care...",
    mapsTo: "Affordable therapy, Medicaid, community care"
  },
  {
    persona: "Danielle (23)",
    summary: "Anxious, pro-women, scared of crime, frustrated by inequality",
    priority: "Protect LGBTQ+ rights, but I don't like trans women in my locker room.",
    mapsTo: "Anti-discrimination + gender space policy tension"
  },
  {
    persona: "Danielle (23)",
    summary: "Anxious, pro-women, scared of crime, frustrated by inequality",
    priority: "I voted once, but felt forced... no great choice.",
    mapsTo: "Electoral trust, campaign reform, better candidate access"
  },
  
  // Joe (20)
  {
    persona: "Joe (20)",
    summary: "Conservative family, centrist, feels alienated by identity politics",
    priority: "Gov't should stay out of most things.",
    mapsTo: "Limited government, deregulation"
  },
  {
    persona: "Joe (20)",
    summary: "Conservative family, centrist, feels alienated by identity politics",
    priority: "Woke politics divide us — I don't have a voice.",
    mapsTo: "Anti-DEI, race/gender neutrality"
  },
  {
    persona: "Joe (20)",
    summary: "Conservative family, centrist, feels alienated by identity politics",
    priority: "Gov't spending is out of control.",
    mapsTo: "Fiscal conservatism, balanced budget"
  },
  {
    persona: "Joe (20)",
    summary: "Conservative family, centrist, feels alienated by identity politics",
    priority: "Support gun control — school shootings are personal.",
    mapsTo: "Gun background checks, red-flag laws"
  },
  {
    persona: "Joe (20)",
    summary: "Conservative family, centrist, feels alienated by identity politics",
    priority: "Admissions should be based on effort — not identity.",
    mapsTo: "Race-neutral admissions policy"
  },
  {
    persona: "Joe (20)",
    summary: "Conservative family, centrist, feels alienated by identity politics",
    priority: "Men's mental health isn't taken seriously.",
    mapsTo: "Male mental health access and stigma reduction"
  },
  
  // T.J. (25)
  {
    persona: "T.J. (25)",
    summary: "Gay Asian barista, youth advocate, pro-queer rights, anti-tokenism",
    priority: "Queer and trans folks are under attack.",
    mapsTo: "LGBTQ+ rights, anti-discrimination protections"
  },
  {
    persona: "T.J. (25)",
    summary: "Gay Asian barista, youth advocate, pro-queer rights, anti-tokenism",
    priority: "Tired of fake allyship — I want real policy.",
    mapsTo: "Policy integrity, equity audits"
  },
  {
    persona: "T.J. (25)",
    summary: "Gay Asian barista, youth advocate, pro-queer rights, anti-tokenism",
    priority: "We need police accountability, not just promises.",
    mapsTo: "Law enforcement reform"
  },
  {
    persona: "T.J. (25)",
    summary: "Gay Asian barista, youth advocate, pro-queer rights, anti-tokenism",
    priority: "Scared of how much data is collected on me.",
    mapsTo: "Digital privacy, surveillance reform"
  },
  {
    persona: "T.J. (25)",
    summary: "Gay Asian barista, youth advocate, pro-queer rights, anti-tokenism",
    priority: "The planet is burning... but elites fly jets.",
    mapsTo: "Climate justice, carbon accountability"
  },
  {
    persona: "T.J. (25)",
    summary: "Gay Asian barista, youth advocate, pro-queer rights, anti-tokenism",
    priority: "Mental health is a crisis — especially for queer youth.",
    mapsTo: "Inclusive mental health funding"
  },
  
  // Gracie (22)
  {
    persona: "Gracie (22)",
    summary: "Biracial Latina + White, pro-life, faith-led, safety-minded",
    priority: "Abortion ends a life — we need to support moms instead.",
    mapsTo: "Pro-life policy + maternal support"
  },
  {
    persona: "Gracie (22)",
    summary: "Biracial Latina + White, pro-life, faith-led, safety-minded",
    priority: "I love my church and I want laws that respect that.",
    mapsTo: "Religious liberty protections"
  },
  {
    persona: "Gracie (22)",
    summary: "Biracial Latina + White, pro-life, faith-led, safety-minded",
    priority: "I back the police — but they need to earn our trust.",
    mapsTo: "Community policing + trust reform"
  },
  {
    persona: "Gracie (22)",
    summary: "Biracial Latina + White, pro-life, faith-led, safety-minded",
    priority: "We need more mental health support, especially for families and veterans.",
    mapsTo: "Family mental health + VA access"
  },
  {
    persona: "Gracie (22)",
    summary: "Biracial Latina + White, pro-life, faith-led, safety-minded",
    priority: "I believe in traditional values — family comes first.",
    mapsTo: "Family policy, child care, faith-friendly spaces"
  },
  {
    persona: "Gracie (22)",
    summary: "Biracial Latina + White, pro-life, faith-led, safety-minded",
    priority: "I want to believe elections are fair — but I have doubts.",
    mapsTo: "Election integrity + civic trust initiatives"
  }
];
