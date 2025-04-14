# VoterPrime User Acceptance Criteria

This document outlines the specific acceptance criteria for the VoterPrime application based on the product requirements. These criteria will be used to validate that the application meets all functional and non-functional requirements before acceptance.

## 1. Core Functionality

### 1.1 Data Integrity & Rules

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 1.1.1 | All election data must be sourced exclusively from FEC and Google Civic APIs | ⬜ |
| 1.1.2 | No AI-generated election data should be present in the application | ⬜ |
| 1.1.3 | NLP/ChatGPT must be used only for natural language processing and input structuring | ⬜ |
| 1.1.4 | Priority mapping must use the terminology defined in `src/config/issueTerminology.json` | ⬜ |
| 1.1.5 | Email drafts must follow templates in `supabase/functions/analyze-priorities/index.ts` | ⬜ |
| 1.1.6 | When user inputs do not map with a confidence above 80% to the mapping tool terms, the user must be asked to clarify their meaning in the results table | ⬜ |

### 1.2 Application Modes

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 1.2.1 | Current Mode must use real-time data for the current date | ⬜ |
| 1.2.2 | Election SIM Mode must use most recent past election data | ⬜ |
| 1.2.3 | User must be able to switch between modes | ⬜ |
| 1.2.4 | Mode selection must be clearly indicated in the UI | ⬜ |

### 1.3 User Input Flow

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 1.3.1 | User can select between Current and Election SIM modes | ⬜ |
| 1.3.2 | User can enter a valid 5-digit US zip code | ⬜ |
| 1.3.3 | User can input 1-6 priorities with up to 250 characters each | ⬜ |
| 1.3.4 | User can review and confirm priority mappings | ⬜ |
| 1.3.5 | User can request recommendations based on their inputs | ⬜ |
| 1.3.6 | Application validates all inputs and provides appropriate error messages | ⬜ |

### 1.4 Political Priorities Mapping Engine (PPME)

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 1.4.1 | PPME accurately maps free-text priorities to standardized policy terms | ⬜ |
| 1.4.2 | PPME uses `src/config/issueTerminology.json` as the source of truth | ⬜ |
| 1.4.3 | PPME detects and highlights conflicts and ambiguities in user priorities | ⬜ |
| 1.4.4 | PPME provides clear explanations for mappings | ⬜ |
| 1.4.5 | Users can review and adjust mappings if needed | ⬜ |

## 2. Output Recommendations

### 2.1 Current Mode with Upcoming Election

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 2.1.1 | Priority mapping results show standardized policy terms | ⬜ |
| 2.1.2 | Priority mapping identifies conflicts/ambiguities | ⬜ |
| 2.1.3 | Candidate recommendations are displayed using FEC/Google Civic data with the following requirements: | ⬜ |
| 2.1.3.1 | Presidential candidates appear first, showing top 3 best matches | ⬜ |
| 2.1.3.2 | State-level candidates appear next, followed by local candidates | ⬜ |
| 2.1.3.3 | Each candidate card displays name, party, office, alignment indicator (✅/⚠️/❌) | ⬜ |
| 2.1.3.4 | Each candidate card shows position summary and platform highlights | ⬜ |
| 2.1.3.5 | Candidate cards include rationale explaining alignment with user priorities | ⬜ |
| 2.1.3.6 | Official website link is provided for each candidate | ⬜ |
| 2.1.3.7 | Mobile-friendly, touch-optimized layout with responsive design | ⬜ |
| 2.1.3.8 | Candidates are sortable/filterable by alignment score | ⬜ |
| 2.1.4 | Ballot measure explanations are provided | ⬜ |
| 2.1.5 | Draft emails to officials are generated | ⬜ |
| 2.1.6 | Relevant interest groups are displayed | ⬜ |
| 2.1.7 | Related petitions from Change.org are shown | ⬜ |
| 2.1.8 | Civic education resources from approved sources are provided | ⬜ |

### 2.2 Current Mode (No Election)

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 2.2.1 | Priority mapping results are displayed | ⬜ |
| 2.2.2 | Advocacy emails to officials are generated | ⬜ |
| 2.2.3 | Interest groups relevant to priorities are shown | ⬜ |
| 2.2.4 | Related petitions are displayed | ⬜ |
| 2.2.5 | Civic education resources are provided | ⬜ |

### 2.3 Election SIM Mode

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 2.3.1 | All election-time features are demonstrated using past election data | ⬜ |
| 2.3.2 | Clear indication that this is simulation mode is displayed | ⬜ |
| 2.3.3 | All features function as they would in Current Mode with an election | ⬜ |

### 2.4 Email Generation

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 2.4.1 | Officials are categorized as Aligned/Opposing/Key Decision Makers | ⬜ |
| 2.4.2 | Officials are prioritized by influence on user's top concerns | ⬜ |
| 2.4.3 | Message tone is customized based on alignment | ⬜ |
| 2.4.4 | Direct email client integration works on desktop and mobile | ⬜ |
| 2.4.5 | Email content follows templates in `supabase/functions/analyze-priorities/index.ts` | ⬜ |

## 3. Performance and Technical Requirements

### 3.1 Performance Metrics

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 3.1.1 | Application returns results within 3 seconds | ⬜ |
| 3.1.2 | Progress animations display for operations exceeding 1 second | ⬜ |
| 3.1.3 | Application maintains responsiveness during data processing | ⬜ |

### 3.2 Data Accuracy and Integrity

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 3.2.1 | 100% data accuracy from verified sources | ⬜ |
| 3.2.2 | Zero instances of incorrect or unverified information | ⬜ |
| 3.2.3 | All external links function correctly | ⬜ |

### 3.3 Content Standards

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 3.3.1 | All content uses plain language (high school education level) | ⬜ |
| 3.3.2 | Content is factual, caring, and optimistic in tone | ⬜ |
| 3.3.3 | Civic education content comes only from approved sources | ⬜ |
| 3.3.4 | No partisan language or bias in recommendations | ⬜ |

## 4. User Experience for Specific Personas

### 4.1 Sal (19, College Student, Ann Arbor, MI)

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 4.1.1 | "I don't want to be labeled or canceled just for having questions" maps to "Free expression / civil liberties" | ⬜ |
| 4.1.2 | "Why can't the government agree on what we need to do to address climate change?" maps to "Climate research + market-based climate policy" | ⬜ |
| 4.1.3 | "IF trans people want to claim their pronouns...I don't want it forced on me" maps to "Pronoun policy / speech freedom tension" | ⬜ |
| 4.1.4 | "Censorship freaks me out — like how social media hides stuff..." maps to "Tech regulation, content moderation transparency" | ⬜ |
| 4.1.5 | "Politics feels corrupt — can it be fixed?" maps to "Government ethics, transparency reform" | ⬜ |
| 4.1.6 | "College costs too much, how will we afford homes?" maps to "Tuition reform, student debt relief, housing access" | ⬜ |
| 4.1.7 | Application detects potential conflicts in Sal's priorities related to government regulation vs. freedom | ⬜ |

### 4.2 Danielle (23, Cosmetologist, St. Louis, MO)

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 4.2.1 | "I want women to have choices and control over our bodies" maps to "Reproductive rights" | ⬜ |
| 4.2.2 | "Scared by violent immigrant stories... what's with pardons?" maps to "Public safety, immigration enforcement, criminal justice" | ⬜ |
| 4.2.3 | "Rich get richer, can't even pay rent" maps to "Income inequality, rent relief, minimum wage" | ⬜ |
| 4.2.4 | "We need better mental health care..." maps to "Affordable therapy, Medicaid, community care" | ⬜ |
| 4.2.5 | "Protect LGBTQ+ rights, but I don't like trans women in my locker room" maps to "Anti-discrimination + gender space policy tension" | ⬜ |
| 4.2.6 | "I voted once, but felt forced... no great choice" maps to "Electoral trust, campaign reform, better candidate access" | ⬜ |
| 4.2.7 | Application identifies conflict between LGBTQ+ rights support and gender space concerns | ⬜ |

### 4.3 Joe (20, Economics Student, Pittsburgh, PA)

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 4.3.1 | "Gov't should stay out of most things" maps to "Limited government, deregulation" | ⬜ |
| 4.3.2 | "Woke politics divide us — I don't have a voice" maps to "Anti-DEI, race/gender neutrality" | ⬜ |
| 4.3.3 | "Gov't spending is out of control" maps to "Fiscal conservatism, balanced budget" | ⬜ |
| 4.3.4 | "Support gun control — school shootings are personal" maps to "Gun background checks, red-flag laws" | ⬜ |
| 4.3.5 | "Admissions should be based on effort — not identity" maps to "Race-neutral admissions policy" | ⬜ |
| 4.3.6 | "Men's mental health isn't taken seriously" maps to "Male mental health access and stigma reduction" | ⬜ |
| 4.3.7 | Application identifies potential conflict between limited government stance and support for gun control | ⬜ |

### 4.4 T.J. (25, Barista and Youth Advocate, Oakland, CA)

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 4.4.1 | "Queer and trans folks are under attack" maps to "LGBTQ+ rights, anti-discrimination protections" | ⬜ |
| 4.4.2 | "Tired of fake allyship — I want real policy" maps to "Policy integrity, equity audits" | ⬜ |
| 4.4.3 | "We need police accountability, not just promises" maps to "Law enforcement reform" | ⬜ |
| 4.4.4 | "Scared of how much data is collected on me" maps to "Digital privacy, surveillance reform" | ⬜ |
| 4.4.5 | "The planet is burning... but elites fly jets" maps to "Climate justice, carbon accountability" | ⬜ |
| 4.4.6 | "Mental health is a crisis — especially for queer youth" maps to "Inclusive mental health funding" | ⬜ |
| 4.4.7 | Application provides resources that address intersectionality of T.J.'s concerns | ⬜ |

### 4.5 Gracie (22, Religious Conservative)

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 4.5.1 | "Abortion ends a life — we need to support moms instead" maps to "Pro-life policy + maternal support" | ⬜ |
| 4.5.2 | "I love my church and I want laws that respect that" maps to "Religious liberty protections" | ⬜ |
| 4.5.3 | "I back the police — but they need to earn our trust" maps to "Community policing + trust reform" | ⬜ |
| 4.5.4 | "We need more mental health support, especially for families and veterans" maps to "Family mental health + VA access" | ⬜ |
| 4.5.5 | "I believe in traditional values — family comes first" maps to "Family policy, child care, faith-friendly spaces" | ⬜ |
| 4.5.6 | "I want to believe elections are fair — but I have doubts" maps to "Election integrity + civic trust initiatives" | ⬜ |
| 4.5.7 | Application provides balanced resources that respect religious perspectives | ⬜ |

## 5. Critical Dependencies

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 5.1.1 | Plan for Google Civic API alternative by April 30, 2025 | ⬜ |
| 5.1.2 | Educational content comes only from approved sources | ⬜ |
| 5.1.3 | Application handles API failures gracefully | ⬜ |
| 5.1.4 | Fallback mechanisms exist for critical features | ⬜ |

## Testing Instructions

1. For each criterion, perform the specified test case
2. Mark as "✅" if the criterion is fully met
3. Mark as "⚠️" if the criterion is partially met (include notes)
4. Mark as "❌" if the criterion is not met
5. Document any bugs or issues encountered

## Sign-off

This document serves as the official user acceptance criteria for the VoterPrime application. All criteria must be met for the application to be considered complete and ready for release.

Approved by: __________________________ Date: ______________
