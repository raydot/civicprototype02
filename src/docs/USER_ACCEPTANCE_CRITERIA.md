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
| 2.1.3 | Candidate recommendations are displayed using FEC/Google Civic data | ⬜ |
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

### 4.1 Sal (College Student)

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 4.1.1 | Application correctly maps Sal's concerns about free expression and censorship | ⬜ |
| 4.1.2 | Environmental priorities are mapped to appropriate policy terms | ⬜ |
| 4.1.3 | Concerns about education costs are addressed in recommendations | ⬜ |
| 4.1.4 | Application detects potential conflicts in Sal's priorities | ⬜ |

### 4.2 Danielle (Cosmetologist)

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 4.2.1 | Women's rights concerns are properly mapped to policy terms | ⬜ |
| 4.2.2 | Safety and criminal justice concerns are addressed | ⬜ |
| 4.2.3 | Economic inequality concerns are reflected in recommendations | ⬜ |
| 4.2.4 | Mental health priorities are mapped to appropriate resources | ⬜ |

### 4.3 Joe (Economics Student)

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 4.3.1 | Personal freedom and limited government concerns are properly mapped | ⬜ |
| 4.3.2 | Gun control stance is reflected in recommendations | ⬜ |
| 4.3.3 | Concerns about government spending are addressed | ⬜ |
| 4.3.4 | Application detects potential conflicts in Joe's priorities | ⬜ |

### 4.4 T.J. (Barista and Youth Advocate)

| ID | Acceptance Criteria | Status |
|----|---------------------|--------|
| 4.4.1 | LGBTQ+ rights concerns are properly mapped | ⬜ |
| 4.4.2 | Police accountability priorities are reflected in recommendations | ⬜ |
| 4.4.3 | Digital privacy concerns are addressed | ⬜ |
| 4.4.4 | Environmental and mental health priorities are mapped appropriately | ⬜ |

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
