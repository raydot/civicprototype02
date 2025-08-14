# Mapping Engine Technical Approach

## **Hybrid Rule-Based Lookup + NLP Assist**

> “ML based on a human created table of terms mapped to common words that people use to reference them”

- **Build your `issueTerminology.json`**
  - Categories (e.g., free speech, housing, climate)
  - Synonyms / user expressions / flags
  - Optional stances or polarity (`support`, `oppose`, `conflicted`)
- **Use ChatGPT or OpenAI API to:**
  - Parse the user’s 6 free-text entries
  - Match against your table
  - Ask clarifying questions if there’s ambiguity
  - Output the mapped priorities (with a plainspoken summary)

---

### 1. Data Model & Preprocessing

- **Terminology Store**
  - Load `issueTerminology.json` containing for each category:
    - `termId`, `standardTerm`, `plainEnglish`
    - `keywords[]`, `synonyms[]`, `opposites[]` (for stance)
    - `nuance` weight map (support vs. oppose)
- **Input Normalization**
  - On user entry (`rawPriority`): lowercase, strip punctuation, singularize, remove stop-words.

### 2. Match Generation & Scoring

- **Rule-based Match**
  - Exact keyword/synonym lookup in normalized text.
- **Fuzzy/Semantic Match**
  - Compute similarity against each category’s `keywords` + `plainEnglish`.
- **Confidence Calculation**
  - Combine rule hits and similarity score into a single confidence value per category.

### 3. Match Selection Logic

- **High-Confidence (> T_high)**
  - If one category’s score ≥ T_high and ≥ 2× next best, mark as **single** candidate.
- **Low-Confidence or Ambiguous (≤ T_high or multiple close scores)**
  - Select **top 2–3** categories as **multiple** candidates.

**Is this the right User Experience?  
How do we show this without it feeling text heavy/overwhelming?**

### 4. User-In-The-Loop UI Flow

1. **Single-Match Path**
   - Display the top **match** (`standardTerm` + `plainEnglish`).
   - Ask for 👍/👎 feedback.
     - 👍 → **Accept** mapping.
     - 👎 → **Proceed to Multiple-Match Path** (step 2).
2. **Multiple-Match Path**
   - Show the top 2–3 **matches** side-by-side (each with `standardTerm` + `plainEnglish`).
   - User taps “This matches” → **Accept** that mapping.
   - Or taps “None of these” → **Clarification Step** (step 3).
3. **Clarification Step**
   - Prompt:
     > “Can you please clarify your stance on ‘[rawPriority]’?”
   - Capture follow-up input, then re-run the matching logic.

### 5. Feedback Loop & Logging

- **Capture Outcomes**
  - Log `{ rawPriority, selectedTermId, confidence, feedbackType }` to `needsTermMapping.json`.
- **Automated Weight Adjustment** (optional)
  - On 👍: boost matched keywords/nuance weights.
  - On 👎 or “None”: flag terms for expert review.

### 6. Testing & Continuous Improvement

- **Random Input Generator (for testing and eventually expert refinement)**
  - Provide a script/API that emits a JSON array of 6 free-text concerns matching these rules:
    - Casual, 18–30 yr-old style; avoid policy jargon; use everyday language, like something someone would say in a group chat or text.
    - Priorities should come from a mix of perspectives:
      - Some liberal (e.g., worried about climate change, LGBTQ+ rights)
      - Some conservative (e.g., personal freedom, pro-life, border security)
      - Some mixed or unclear (e.g., frustrated with both parties, wants fairness)
      - Some neutral but youth-focused (e.g., student debt, mental health, housing, online safety, censorship)
    Output format:
    - Return as a JSON array of 6 strings, e.g.:
      ["I feel like rent is so high I’ll never move out of my parents’ place.",
      "Why does it feel like you get judged just for asking questions about gender stuff?",
      ...]
- **Ideally — we have Iteration Cadence**
  - Weekly review of logged ambiguous inputs by policy experts to refine `issueTerminology.json`.
