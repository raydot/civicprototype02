# VoterPrime Prototype Product Requirements (updated 4/8/25)

## Overview

VoterPrime is a nonpartisan digital primer that helps eligible US voters make confident voting decisions and become engaged participants in democracy. The application maps user priorities to policy terms and provides actionable civic engagement recommendations.

## Core Features

### 1. Data Integrity & Rules
- No AI-generated election data
- All election data sourced from FEC and Google Civic APIs
- NLP/ChatGPT used only for natural language processing and input structuring
- Priority mapping must use `src/config/issueTerminology.json`
- Email drafts must follow templates in `supabase/functions/analyze-priorities/index.ts`

### 2. Modes
- **Current Mode**: Uses real-time data for current date
- **Election SIM Mode**: Uses most recent past election data to demonstrate election-time functionality

### 3. User Input Flow
1. Mode Selection (Current/Election SIM)
2. Zip Code Entry (5 digits)
3. Priority Input (1-6 concerns, 250 chars each)
4. Priority Mapping Review
5. Get Recommendations

### 4. Political Priorities Mapping Engine (PPME)
- Maps free-text priorities to standardized policy terms
- Uses `src/config/issueTerminology.json` as source of truth
- Detects conflicts and ambiguities
- Supports expert curation and continuous learning
- Version controlled terminology updates

### 5. Outputs (Based on Mode)

#### Current Mode with Upcoming Election
- Priority mapping
- Candidate recommendations (FEC/Google Civic data)
- Ballot measure explanations
- Draft emails to officials
- Relevant interest groups (HUD)
- Related petitions (Change.org)
- Civic education resources

#### Current Mode (No Election)
- Priority mapping
- Advocacy emails
- Interest groups
- Petitions
- Civic education

#### Election SIM Mode
- Demonstrates election-time features using past election data
- Includes all features for testing/demo purposes

### 6. Email Generation
- Categorizes officials (Aligned/Opposing/Key Decision Makers)
- Prioritizes by influence on user's top concerns
- Customizes message tone based on alignment
- Direct email client integration

### 7. Critical Dependencies
- Google Civic API alternative needed by April 30, 2025
- Approved educational content sources:
  - iCivics
  - National Constitution Center
  - Civic Genius
  - Ballotpedia
  - Annenberg Classroom
  - Center for Civic Education
  - Khan Academy (Civics & Government)

## Success Metrics

### Prototype Performance
- 100% data accuracy from verified sources
- Accurate PPME translations
- Zero incorrect information
- 3-second response time
- Seamless email integration
- 100% external link reliability

## Timeline
- Working Prototype: April 15, 2025
- Google Civic API Migration: April 30, 2025

## **SUMMARY**

### 1. **Executive Summary** 
- 86% of young eligible voters (ages 18-29) in the US are not participating in elections or engaging in civic activity mainly because of apathy, disillusionment, and mistrust of government
- VoterPrime is a nonpartisan digital primer that makes it easy for eligible US voters to make confident voting decisions and to quickly become engaged participants in democracy whether or not there is an upcoming election.
    - By entering their zip code and articulating their priorities in their own words, users receive **customized, factual recommendations** on candidates and ballot measures, copy-and-send emails to relevant elected officials, and learn about interest groups and petitions that align with their core values and concerns.
- Unlike political action tools which require users to analyzing complex partisan political information or engage in heated discussions, this solution puts the user's top priorities at the center, and delivers civic engagement plan based on what they care about most.
- The application delivers value by returning actionable recommendations regardless of whether or not there is an upcoming election
- Hypotheses:
    - Civic engagement based on core values is intrinsically motivating
    - Clear actionable steps reinforce a sense agency and can build long-term habits
    - Everyone wants help engaging with ballot measures
    - If a user engages with this application they are more likely to register, vote, and take other civic actions
    - Citizens who engage with democracy based on their core values—rather than partisan outrage—will push politicians toward problem-solving policies.
    - This solution will appeal to Digital Natives who prefer tech-driven, mobile-first tools over traditional political content.

### 2. **Business Context**
- Market opportunity: This is a philanthropic endeavor which will seek funding.
- User pain points:
    - As a young eligible voter I want…
        - to be an engaged citizen but I don't know where to start
        - to learn how my concerns map to common policy terms and political stances
        - help making voting decisions based on my concerns without having to get a degree in political science, without having to argue with my friends and family, and without reading 10 pages of confusing ballot measure rhetoric
        - to have an impact on the decisions made by elected officials
        - to find easy ways to support groups and petitions that are relevant to my concerns
    - As a busy person who doesn't enjoy or have time to engage with politics, I want a trustworthy tool to help me engage with government and voice my concerns.
    - As a product designer I want…
        - to give voters of all ages a sense of agency
        - to make political engagement personal, easy, convenient, and delightful
        - to simplify the voter decision making process
        - to increase civic engagement because it is critical for a healthy democracy
- Strategic alignment with company goals
    - Our mission is to promote personalized positive civic engagement

### 3. **User Requirements**
- **Primary user personas:**
    - **Primary user personas:**
    - **Sal, age 19, College sophomore, student athlete**
        - **ZIP Code:** 48104 *(Ann Arbor, MI)*
        - **Summary:**  Sal is a mixed-race student athlete who’s thoughtful but cautious. He’s grown up hearing strong opinions from both sides of his family, but keeps his own close. He values free expression, individual liberty, and isn’t sure where he fits politically. He worries about climate change, censorship, and losing his right to disagree.
        - **Sal’s 6 Free-Text Priorities:**
            1. *“I don’t want to be labeled or canceled just for having questions. It gives me a lot of anxiety so I tend to keep quiet.”* 
            2. *“I think we should be doing way more about the environment, but not just forcing people to drive electric cars.”*
            3. *“People should be free to say their pronouns if they want, but I don’t want it forced on me.”*
            4. *“Censorship freaks me out — like how social media hides stuff depending on who posts it.”*
            5. *“I feel like most people in politics are probably corrupt so it’s hard to get excited about politics. Can it be fixed?”*
            6. *“I’m lucky to be on scholarship, but I don’t get how college costs so much when we say education matters.”*
    - **Danielle, age 23, Cosmetologist**
        - **ZIP Code:** 63118 *(St. Louis, MO)*
        - **Summary :** Danielle struggles with anxiety and often feels overwhelmed by the news and life. Her views are a mix of pro-women politics, personal fear, and economic frustration. She shares feminist memes and supports choice, but also believes stories about violent immigrant criminals, even though she’s never had a bad experience herself.
        - **Danielle’s 6 Free-Text Priorities:**
            1. *“I want women to have choices and control over our bodies.”*
            2. *“I’m scared about what I see in the news — violent immigrant rapists, home invasions… I feel unsafe. Also, what’s with pardoning criminals? That’s nuts!”*
            3. *“The rich keep getting richer while regular people can’t even pay rent. It’s rigged.”*
            4. *“We need better mental health care, especially for people like me who can’t afford therapy.”*
            5. *“I think it is important that the law protects LGBTQ+ rights, prevents racial discrimination.”*
            6. *“I voted once, but it felt forced, like I didn’t have anyone great to choose from. Just because a candidate is a woman doesn’t mean she’s going to be any better.”*
    - **Joe, age 20, struggling econ major**
        - **ZIP Code:** 15237 *(Pittsburgh suburb — middle class, mixed politics)*
            - **Summary:** Joe grew up with strong conservative values and still holds many of them, especially around personal freedom and limited government. He supports gun control and wants fairness, but feels alienated on campus and frustrated by what he sees as one-sided “woke” culture.  He is tired of feeling like he's a bad person for being white and male. He's afraid to discuss politics on campus.
            - **Joe’s 6 Free-Text Priorities:**
                1. *“I believe in personal freedom — the government should stay out of most things.”*
                2. *“Woke politics just make everything about race and gender — I don’t feel like I’m allowed to have a voice and honestly it just divides us.”*
                3. *“My parents think government spending is a disaster — and I’m starting to agree.”*
                4. *“I support gun control.  My girlfriend lost a sibling in a school shooting.”*
                5. *“I don’t think race or gender should factor into college admissions — it should be about effort and results.”*
                6. *“There’s all this talk about mental health, but guys like me still feel like we can’t say when we’re struggling.”*
    - **T.J, age 25, barista and youth advocate**
        - **ZIP Code:** 94612 *(Oakland, CA)*
        - **Summary:** T.J. is a 25-year-old gay, Asian American barista and part-time youth advocate. He’s emotionally intelligent, civically engaged, and deeply concerned about human rights and systemic injustice. T.J. follows politics closely but is exhausted by performative allyship and polarized media. He cares about queer safety, digital privacy, and real accountability — not just hashtags.
        - **T.J.’s 6 Free-Text Priorities:**
            1. *“I want to live in a country where queer people and trans folks aren’t constantly under attack.”*
            2. *“I’m sick of fake ally brands and politicians — support us with policies, not just flags in June.”*
            3. *“We need police accountability, not just promises.”*
            4. *“I’m scared of how much data is being collected about me online — and who controls it.”*
            5. *“The planet is burning and powerful people are still flying private jets.”*
            6. *“Mental health is a crisis — especially for queer youth like me.”*
- **Key user journeys/use cases**
    - **First-time engagement journey**
        - User downloads app/visits website and enters zip code
        - Enters their top 6 concerns in their own words
        - Receives personalized dashboard with translated political terminology matching their priorities
        - Gets immediate actionable steps based on their concerns (register to vote, upcoming elections, draft emails to elected officials, relevant petitions)
    - **Election preparation use case**
        - User receives notification about upcoming election relevant to their location
        - Views simplified, neutral explanations of ballot measures filtered by their priority concerns
        - Accesses candidate comparison tool showing positions specifically on user's priority issues
        - Creates and saves a personalized voting plan they can reference at the polls
    - **Ongoing civic engagement journey**
        - User discovers and connects with local/national groups aligned with their priorities
        - Tracks voting record of their representatives on their priority issues
        - Gets alerts about petitions and non-electoral civic actions related to their concerns
    - **Knowledge-building pathway**
        - User accesses educational content explaining how their concerns translate to policy areas
        - Builds confidence through "civic literacy" modules tailored to their interests
        - Receives simplified updates on legislation related to their priorities
        - Gradually expands their engagement across more civic areas as comfort grows

### 4. **Solution Overview**
- High-level functionality description: By entering their zip code and articulating their priorities in their own words, users receive **customized, factual recommendations** on candidates and ballot measures, copy-and-send emails to relevant elected officials, and learn about interest groups, petitions, and civic educational content related to their core values and concerns.
    - **Party-Agnostic Approach:** Maps authentic user input (via free-text) to standardized policy categories using a **Political Priorities Mapping Engine** **(PPME)** powered by **natural language processing (NLP)** and **sentiment analysis**.
    - **User-Friendly Detail for making election decisions:** Both quick summaries of why candidates or ballots map to user concerns; and compare and contrast tables with playful icons; call outs for conflicts (where the candidate maps to the user's concerns in one way but not in another)
    - **Actionable Outputs:** Save or share your voter cheat sheet. Direct links, editable draft emails, and clear recommendations.
    - **Dual Modes:** Supports **CURRENT** (using real live data pulled from trusted databases for the current date) and an **ELECTION SIM mode** to demonstrate how it will work in an election cycle (This for testing, attracting funding and partners, and to show users what they can expect)
    - **Recommendation Language Standard** Must be **plain spoken** (assume a high school education level), **factual**, **caring, and optimistic**.

### 5. **Success Metrics:** 
- **Prototype Performance Metrics:**
    - **Data Accuracy:** Application returns correct, factual data from verified sources and APIs based on user inputs 100% of the time
    - **Political Priorities Mapping:** PPME accurately translates user concerns into political terminology and improves through user feedback/corrections
    - **Information Integrity:** Zero instances of incorrect or unverified information presented to users
    - **Response Time:** Application returns results within 3 seconds; displays progress animations for any operations exceeding 1 second
    - **Email Functionality:** Seamless email client integration with proper handling on both desktop (new window) and mobile (new tab) environments
    - **Link Reliability:** 100% functionality of all clickable links to external resources (candidates, ballot measures, interest groups, petitions, and educational content)

### 6. **Timeline & Dependencies**
- Major milestones:
    - Working Prototype by 4/15/25
    - Demonstrates completely working Prototype Functional Requirements
    - Is built with potential to accommodate Future Functional Requirements
- Critical dependencies
    - Google Civic's representative data will become unavailable April 30, 2025 so will need to find an alternative database and API call to return that data

## **Prototype Functional Requirements**

### **1. RULES & DATA INTEGRITY**

- **Data Authenticity:**
    - No AI-generated election data.
    - All election data must be sourced from FEC and Google Civic APIs.
- **NLP & Mapping Constraints:**
    - ChatGPT is **only** used for **natural language processing (NLP)** and structuring user input.
    - **Mapping of priorities must use** `src/config/issueTerminology.json`.
    - **Email drafts must follow templates in** `supabase/functions/analyze-priorities/index.ts`.

### **2. INPUTS & USER INTERACTIONS**

- **Mode Selection:**
    - **Options:** "Current" or "Election SIM Mode"
- *Current Date:* uses the current date to return real election and civic engagement options per the user's zip code
- Simulates results for the user's zip code for an upcoming general election based on the most recent prior general election data (just for demo purposes)
- **Zip Code:**
    - 5-digit numeric field (exactly five digits).
- **Top 6 Priorities:**
    - Free-text entries (up to 250 characters each).
    - Users can enter up to 6 priority concerns.
    - The minimal number is 1.
    - Users can reorder their concerns to express prioritization via drag-and-drop.
- "SUBMIT" button initiates policy mapping
    - This is the highest value feature of this application. Our **Political Priorities Mapping Engine** converts free-text input into **standardized policy categories** using **`src/config/issueTerminology.json`**.
    - This returns for the user a table mapping their inputs to policy terms
        - **Conflict Detection:** NLP flags contradictory or ambiguous entries and prompts users for clarification.
    - Dynamic updates: The user can edit their original inputs (zip code or priorities) trigger **immediate refreshes** in recommendations.
    - When the user is satisfied with the mapping they can click Get Recommendations
- "Get Recommendations"
    - Yes - show me recommendations - initiates processing and displays policy mapping and recommendation results to the user

### **3. TESTING FEATURES**

- **Persona autofill functionality**
    - As a developer I want buttons to preload the user inputs with our 4 defined personas and a random persona for ease and speed of testing the application. These will be removed later. Please label them with just names:  Sal, Joe, Danielle, TJ & Random
    - The random persona will help feed new terms for mapping into the PPME so that it can build and improve
- **API Connection Verification**
    - **API Connection Buttons:**
        - **Check Google Civic API Connection**
        - **Check FEC API Connection**
        - **Visual Indicators:** Green checkmark (success) or red alert (failure).
        - **Toast Notifications:** Display connection status details.
- **Terminology Debug Tool:**
    - Tests the **terminology mapping system** (via `src/config/issueTerminology.json`).
    - Displays **matched categories, confidence scores, and recognized standardized terms**.

### **4. POLICY MAPPING SYSTEM**

#### 4.1. External Policy Terminology File

- Policy mappings must be maintained in `src/config/issueTerminology.json`
- This file serves as the single source of truth for policy term mappings
- File structure must support:
    - Standard policy terms
    - Plain language alternatives
    - Contextual relationships
    - Nuanced distinctions (e.g., "fair hiring" vs "affirmative action")
    - Confidence weights
    - Potential conflicts

#### 4.2. Expert Curation

- Policy experts must be able to review and update terminology mappings
- Updates should focus on:
    - Adding new policy terms
    - Refining existing mappings
    - Improving nuanced distinctions
    - Adding contextual relationships
    - Resolving ambiguities

#### 4.3. Learning System

- The system must log and learn from:
    - User inputs and their mapped terms
    - User clarifications and corrections
    - Detected ambiguities and conflicts
    - Success rates of mappings
- Learning outcomes should:
    - Suggest new policy terms
    - Identify gaps in terminology
    - Highlight common user phrasings
    - Track confidence scores
    - Flag potential improvements

#### 4.4. Continuous Improvement

- Regular review cycles for terminology updates
- Data-driven recommendations for mapping improvements
- Version control for terminology file
- Documentation of mapping changes
- Validation system for updates
- All outputs are ordered by alignment with user's mapped concerns

### 5. Mode-Specific Outputs

#### 5.1 Current Mode (When Election is Upcoming)

- **Candidate Recommendations:**
    - These must be pulled from FEC or Google Civic databases via APIs, not generated from ChatGPT
    - **POTUS:** Best-matching candidates with alignment icons, platform highlights, rationale tied to user priorities, and official website links
    - **State & Local:** At least 3 candidates per office in compare/contrast tables with position summaries and match rationales
- **Ballot Measures:** Brief descriptions, supporter/opposition info, relevance to user concerns, and Ballotpedia links
- **Advocacy Tools:** Email drafts to relevant officials using logic in `supabase/functions/analyze-priorities/index.ts`
- **Interest groups** (HUD website)
- **Petitions (Change.org)**
- **Civic education content**
    - All civic education content should be curated from **reputable, nonpartisan educational institutions**. Acceptable sources **include and are limited to**:
        - [iCivics](https://www.icivics.org/)
        - [National Constitution Center](https://constitutioncenter.org/)
        - [Civic Genius](https://www.civicgenius.org/)
        - [Ballotpedia](https://www.ballotpedia.org/)
        - [Annenberg Classroom](https://www.annenbergclassroom.org/)
        - [The Center for Civic Education](https://www.civiced.org/)
        - [Khan Academy – Civics & Government](https://www.khanacademy.org/)

#### Current Mode (No Upcoming Election)

- Provides priorities mapping, advocacy emails, interest groups, petitions, and civic education resources
- Skips candidate and ballot measure sections

#### Election Simulation Mode

*User Story: As a developer, potential funder, potential partner, I want to see how the application will work when there is an upcoming election*

- Displays recommendations based on most recent past election for user's location
- Includes all features: candidate matches, ballot measures, email drafts, interest groups, petitions, and education resources

### 4.4 Email Generation Logic

*User Stories:*
- *As a user I don't want to be overwhelmed with all of the possible elected officials I might contact via email. I want the application to identify the most important ones who may have real sway in terms of my top 3 priority issues.*
- *As a user, I want the application to provide drafted emails, actual email addresses, and allow me to launch my email client, prefilling the email address, subject line, and draft content*

- **Official Categorization:** Groups officials as Aligned, Opposing, or Key Decision Makers
- Prioritize Key Decision Makers, then Opposing, then Aligned
- **Messaging Strategy:**
    - Supportive: Thank-you and reinforcement
    - Opposing: Educational and persuasive
    - Mixed: Acknowledgment with persuasion

### 4.5 Summary Output Dashboard

All user results are displayed in a single, scrollable dashboard, including:

- **Header Info:**
    - Mode: (Current / Election SIM)
    - Zip Code + Region
- **Priorities Mapping Section:**
    - NLP analysis of user-stated concerns → standardized policy issues
    - Clarify / Get Recommendations buttons
    - Each concern summarized with:
        - Issue mapping
        - Any ambiguity or conflicting signals flagged for review
- **Recommendations Section:**
    - All available outputs based on mode and ballot availability:
        - Candidate Tables
        - Ballot Measures
        - Email Drafts + Contacts
        - Interest Groups + Petitions
        - Civic Education
