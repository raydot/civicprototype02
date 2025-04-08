### Product Requirements (updated 1/4/25)

Product Requirements
**1. Purpose & Value Proposition**
VoterPrime is a nonpartisan primer that makes it easy for US citizens to make confident voting decisions and become engaged participants in democracy. By entering their zip code and articulating their priorities in their own words, users receive **customized, factual recommendations** on candidates and ballot measures, copy-and-send emails to relevant elected officials, and learn about interest groups and petitions that align with their core values and concerns.

- **Empowerment:** Users make informed decisions without wading through partisan rhetoric or sensationalized news.
- **User-Friendly Detail:** Both quick summaries and in-depth details on candidates, issues, and interest groups.
- **Actionable Outputs:** Direct links, editable draft emails, and clear recommendations.
- **Party-Agnostic Approach:** Maps authentic user input (via free-text) to standardized policy categories using a **Political Priorities Mapping Engine** powered by **natural language processing (NLP)** and **sentiment analysis**.
- **Dual Modes:** Supports both **real election cycles** (using live data) and a **DEMO mode** simulating the November 2024 election with a fixed candidate set.
**Recommendation Language Standard**
- Must be **plain spoken** (assume a high school education level), **factual**, and **friendly**.

---

**2. Underlying Hypotheses**

- **Shifting Voter Engagement:** Citizens who engage with democracy based on their core values—rather than partisan outrage—will push politicians toward problem-solving policies.
- **Targeting Disengaged Voters:** This solution is designed for disengaged voters, especially younger demographics, who prefer **tech-driven, mobile-first tools** over traditional political content.

---

**3. Target Audience**

- **Primary:** **All eligible voters**, with a focus on **18–29-year-olds** (historically low voter turnout, but highly tech-savvy).

---

**4. Inputs & User Interaction4.1. Input Fields**

- **Mode Selection:**
    - **Options:** "Current Date" or "DEMO: November 2024 Election."
        - *Current Date:* Uses live election data.
        - *DEMO:* Simulates the November 2024 election with fixed candidate data.
- **Zip Code:**
    - 5-digit numeric field (exactly five digits).
- **Top 6 Priorities:**
    - Free-text entries (up to 250 characters each).
    - Users can enter multiple concerns and reorder them via drag-and-drop.
    - "Did we get this right? - input box with SUBMIT for clarifications - initiates updated evaluation and mapping
    - Yes - show me recommendations - initiates processing
    **4.2. Real-Time Editing & Feedback**
- **Dynamic Updates:** Inputs (zip code or priorities) trigger **immediate refreshes** in recommendations.
- **Conflict Detection:** NLP flags contradictory or ambiguous entries and prompts users for clarification.
- **Test Personas:**
    - Buttons for loading **predefined personas** or generating a **random persona** (populating zip code and priorities, and setting mode to demo).

---

**5. Outputs & Presentation**

### **5.1. Mode-Specific Recommendations**

VoterPrime generates outputs based on the selected mode and ballot availability. All recommendations are based on the user's mapped priorities and are ordered by level of alignment:

- 
- 
- 

---

### **A. Current Date Mode**

### If Ballots Are Available:

- **POTUS Recommendations:**
    - Show all best-matching candidates in rank order
    - Each candidate includes:
        -  or  alignment icon
        - Platform highlights (short bullets)
        - Rationale based on user priorities
        - Hyperlink to official website
- **Other Offices (State & Local):**
    - At least 3 candidates per office (e.g., Governor, Senate, House, Mayor, City Council)
    - Displayed in compare/contrast tables
    - Includes:
        - Summary of positions
        - Match rationale
        - Link to official site
- **Ballot Measure Recommendations:**
    - Brief description of the measure
    - Who supports/opposes it
    - Explanation of how it maps to the user's concerns
    - Link to Ballotpedia entry
- **Advocacy & Civic Action:**
    - Email drafts for top 3 concerns
        - Includes contact info for relevant elected officials
        - Messages tailored to stance (supportive / mixed / opposed)
    - Links to:
        - HUD interest groups relevant to priorities
        - Active petitions on Change.org
- **Civic Education Resources:**
    - Contextual learning content based on mapped concerns
    - Topics may include how elections work, roles of officials, civic rights, and how to influence policy
    - Sources include:
        - iCivics, National Constitution Center, Civic Genius
        - Ballotpedia, Annenberg Classroom, Center for Civic Education, Khan Academy Civics

---

### If No Ballots Are Available:

- **Skip candidate and ballot measure sections**
- Still include:
    - Priorities Mapping
    - Email drafts + contacts
    - HUD interest groups
    - Change.org petitions
    - **Civic Education Resources**

---

### **B. DEMO: November 2024 Mode**

Outputs are simulated using a fixed dataset as if it were November 1, 2024. Output format is identical to "Current Mode with Upcoming Election":

- POTUS + State/Local Candidate Recommendations
- Ballot Measures with Ballotpedia links
- Email drafts for simulated officials
- Interest group + petition links
- Civic education resources tailored to demo priorities

---

### **5.2. Summary Output Dashboard**

All user results are displayed in a single, scrollable dashboard, including:

- **Header Info:**
    - Mode: (Current / DEMO)
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
- **User Controls:**
    - Save/Share should use native share functionality
        - **Note:** The PDFs titled *VoterPrime_ResultMockUpCurrentElection_v01.pdf*, *VoterPrime_ResultMockUpCurrent_noElection_v01.pdf*, and *VoterPrime_ResultMockUp_DEMO_nov2024mode_v01.pdf* serve as **canonical visual formatting examples** for all user output displays. All future updates to formatting must adhere to this visual language unless explicitly revised.
    - User can edit zip code or priorities and regenerate new results at any time

---

**6. Outputs Summary (Regardless of Election Cycle)**

- **Priorities Mapping:**
    - The **Political Priorities Mapping Engine** converts free-text input into **standardized policy categories** using **`src/config/issueTerminology.json`**.
    - Users can refine their mapped priorities before receiving recommendations.
- **Candidate & Ballot Measure Matching:**
    - **Election Cycle:** Matches candidates and ballot measures to user priorities.
- **Advocacy Email Generation:**
    - Provides **email addresses** and **draft messages** to local elected officials regarding the user's top 3 concerns.
    - **Uses logic defined in** `supabase/functions/analyze-priorities/index.ts`.
- **Additional Recommendations:**
    - **Interest Groups via HUD website** https://www.hud.gov/program_offices/gov_relations/oirpublicinterestgroups
    - **Petitions ([Change.org](http://change.org/)).**
- **User Options:**
    - **Save/Share** recommendations (native share via device)
- **Civic Education Content:**
    - All civic education content should be curated from **reputable, nonpartisan educational institutions**.
    - Acceptable sources **include and are limited to**:
        - [iCivics](https://www.icivics.org/)
        - [National Constitution Center](https://constitutioncenter.org/)
        - [Civic Genius](https://www.civicgenius.org/)
        - [Ballotpedia](https://www.ballotpedia.org/)
        - [Annenberg Classroom](https://www.annenbergclassroom.org/)
        - [The Center for Civic Education](https://www.civiced.org/)
        - [Khan Academy – Civics & Government](https://www.khanacademy.org/)

---

**7. Application Interface Components7.1. API Connection Verification**

- **API Connection Buttons:**
    - **Check Google Civic API Connection**
    - **Check FEC API Connection**
    - **Visual Indicators:** Green checkmark (success) or red alert (failure).
    - **Toast Notifications:** Display connection status details.
    **7.2. Debug Tools**
- **Terminology Debug Tool:**
    - Tests the **terminology mapping system** (via `src/config/issueTerminology.json`).
    - Displays **matched categories, confidence scores, and recognized standardized terms**.
    **7.3. Email Generation Logic**
- **Evaluation of Elected Officials:**
    - Officials are categorized into three groups:
        1. **Aligned Officials:** Likely to support user's priorities.
        2. **Opposing Officials:** Likely to oppose user's priorities.
        3. **Key Decision Makers:** Those with a mixed/neutral stance.
- **Email Drafts Use Defined Messaging Strategies:**
    - **Supportive:** Thank-you and reinforcement.
    - **Opposing:** Educational and persuasive.
    - **Mixed:** Acknowledgment with persuasion.

---

**8. Rules & Data Integrity**

- **Data Authenticity:**
    - **No AI-generated election data.**
    - **All election data must be sourced from FEC and Google Civic APIs.**
- **NLP & Mapping Constraints:**
    - ChatGPT is **only** used for **natural language processing (NLP)** and structuring user input.
    - **Mapping of priorities must use** `src/config/issueTerminology.json`.
    - **Email drafts must follow templates in** `supabase/functions/analyze-priorities/index.ts`.

---

**9. Data Integration & Sources9.1. Primary Data Sources**

- **FEC API:**
    - **Candidate profiles, finance data, and official records.**
    - **Mapped to user priorities.**
- **Google Civic API:**
    - **Provides ballot options & measures.**
    - **Used for local, state, and national election recommendations.**
    - **API keys stored securely.9.2. External Links & Curated Content**
- **Interest Groups:**
    - Uses **HUD interest group** database ([HUD](https://www.hud.gov/program_offices/gov_relations/oirpublicinterestgroups)).
- **Petition Sites:**
    - [**Change.org](http://change.org/) petitions** ([Change.org](https://www.change.org/search)) mapped to user priorities.

---

**10. System Architecture & Technical Considerations10.1. Front-End**

- **User Interface:**
    - **Clean, intuitive, mobile-first** design.
    - **Real-time dashboard updates** and **accessibility features**.
    **10.2. Back-End**
- **Real-Time Processing:**
    - **Zip code and priorities** trigger **immediate refreshes.**
- **Scalability:**
    - **Designed for up to 100 concurrent users.**

### Result Mockups

The following PDFs serve as canonical visual formatting examples for the application:

- [VoterPrime_ResultMockUpCurrentElection_v01.pdf](../docs/VoterPrime_ResultMockUpCurrentElection_v01.pdf)
- [VoterPrime_ResultMockUp_DEMO_nov2024mode_v01.pdf](../docs/VoterPrime_ResultMockUp_DEMO_nov2024mode_v01.pdf)
- [VoterPrime_ResultMockUpCurrent_noElection_v01.pdf](../docs/VoterPrime_ResultMockUpCurrent_noElection_v01.pdf)

**ADDITIONAL MVP Output Features:**

- **Notifications:** Real-time alerts and push notifications about election updates, new recommendations, and changes to candidate or ballot measure information.
- **Share Functionality:** Enables users to share their priorities mapping, recommendations, and civic education content via social media or email to boost civic engagement.
- **Comprehensive List of Elected Officials & Contacts:** Offers a complete directory of elected officials from local to national levels along with contact details for extended outreach.
