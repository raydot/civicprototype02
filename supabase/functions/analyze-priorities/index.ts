import { serve } from "std/http/server.ts";
import "xhr";
import { BallotMeasure, BallotpediaApiResponse } from '../types/ballotpedia.ts';
import { FECCandidate, FECCommittee, FECApiResponse } from '../types/fec.ts';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const googleCivicApiKey = Deno.env.get('GOOGLE_CIVIC_API_KEY') || Deno.env.get('CIVIC_API_KEY');
const fecApiKey = Deno.env.get('FEC_API_KEY');
const ballotpediaApiKey = Deno.env.get('BALLOTPEDIA_API_KEY');

if (!openAIApiKey) {
  console.warn('OPENAI_API_KEY is not set');
}

// Function to fetch representatives from Google Civic API
async function fetchRepresentatives(zipCode: string) {
  if (!googleCivicApiKey) {
    throw new Error('Google Civic API key is not configured');
  }

  try {
    const url = `https://civicinfo.googleapis.com/civicinfo/v2/representatives?address=${zipCode}&key=${googleCivicApiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Civic API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching representatives:', error);
    throw error;
  }
}

// Function to identify issue areas for officials
async function identifyOfficialIssueAreas(official: any, mappingResult: any) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a political analyst. Given information about a political official, identify their key issue areas and policy positions.'
          },
          {
            role: 'user',
            content: `Analyze this official's information and identify their key issue areas:\n${JSON.stringify(official)}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze official issue areas');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error identifying official issue areas:', error);
    throw error;
  }
}

// Function to generate email draft
async function generateEmailDraft(official: any, userPriorities: string[], issueAreas: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at drafting constituent emails to political representatives.'
          },
          {
            role: 'user',
            content: `Draft an email to ${official.name} about these priorities: ${userPriorities.join(', ')}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate email draft');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating email draft:', error);
    throw error;
  }
}

async function analyzePriorities(priorities: string[], mode: "current" | "demo") {
  console.log('Analyzing priorities:', priorities);
  
  try {
    // Step 1: Use GPT-4 to analyze and map priorities
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a political analyst expert who maps voter priorities to standardized policy terms and identifies potential conflicts.

Instructions:
1. Map each priority to relevant policy areas and political terminology
2. Identify any conflicting priorities
3. Generate a brief analysis explaining the relationships
4. Provide confidence scores for each mapping

Output Format (JSON):
{
  "mappings": {
    "[priority]": ["mapped term 1", "mapped term 2"]
  },
  "analysis": "Multi-paragraph analysis with line breaks",
  "conflicts": [
    {
      "priority1": "first priority",
      "priority2": "second priority",
      "reason": "explanation of conflict"
    }
  ],
  "confidenceScores": {
    "[priority]": 0.95
  }
}`
          },
          {
            role: 'user',
            content: `Analyze these voter priorities: ${JSON.stringify(priorities)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    const mappingResult = JSON.parse(data.choices[0].message.content);
    console.log('Priority mapping result:', mappingResult);

    // Step 2: Get representatives data
    const zipCode = '94105'; // TODO: Get from request
    const representatives = await fetchRepresentatives(zipCode);
    console.log('Representatives:', representatives);

    // Step 3: Get candidates data
    const state = 'CA'; // TODO: Get from Google Civic API response
    const candidates = await fetchCandidatesByState(state, mode);
    console.log('Candidates:', candidates);

    // Step 4: Get ballot measures
    const ballotMeasures = await fetchBallotMeasures(state, mode);
    console.log('Ballot measures:', ballotMeasures);

    // Step 5: Analyze representatives' issue areas
    const issueAreas = await Promise.all(
      representatives.map(rep => identifyOfficialIssueAreas(rep, mappingResult.mappings))
    );
    console.log('Issue areas:', issueAreas);

    // Step 6: Generate email drafts
    const emailDrafts = await Promise.all(
      representatives.map((rep, index) => 
        generateEmailDraft(rep, priorities, issueAreas[index])
      )
    );
    console.log('Email drafts:', emailDrafts);

    return {
      mode,
      zipCode,
      region: state,
      analysis: mappingResult.analysis,
      mappings: mappingResult.mappings,
      candidates,
      ballotMeasures,
      draftEmails: emailDrafts,
      interestGroups: [], // TODO: Implement interest group matching
      petitions: [], // TODO: Implement petition matching
      recommendations: [], // TODO: Implement recommendation generation
      conflictingPriorities: mappingResult.conflicts || []
    };
  } catch (err) {
    console.error('Error in analyzePriorities:', err);
    throw err;
  }
}

async function fetchCandidatesByState(state: string, mode: "current" | "demo"): Promise<any[]> {
  if (!fecApiKey) {
    throw new Error('FEC API key is not configured');
  }

  try {
    const electionYear = mode === "demo" ? 2024 : new Date().getFullYear();
    
    // Fetch candidates
    const candidatesUrl = `https://api.open.fec.gov/v1/candidates/search/?api_key=${fecApiKey}&state=${state}&election_year=${electionYear}&sort=-total_receipts&per_page=10`;
    const candidatesResponse = await fetch(candidatesUrl);

    if (!candidatesResponse.ok) {
      const errorText = await candidatesResponse.text();
      console.error('FEC API error (candidates):', errorText);
      throw new Error(`FEC API error: ${candidatesResponse.status} - ${errorText}`);
    }

    const candidatesData = await candidatesResponse.json() as FECApiResponse<FECCandidate>;
    
    // Process each candidate
    const processedCandidates = await Promise.all(
      candidatesData.results.map(async (candidate) => {
        // Only fetch committee data if we have principal committees
        let committeeData: FECCommittee | null = null;
        if (candidate.principal_committees && candidate.principal_committees.length > 0) {
          const committeeId = candidate.principal_committees[0].committee_id;
          const committeeUrl = `https://api.open.fec.gov/v1/committee/${committeeId}/?api_key=${fecApiKey}`;
          
          try {
            const committeeResponse = await fetch(committeeUrl);
            if (committeeResponse.ok) {
              const committeeJson = await committeeResponse.json() as { results: FECCommittee[] };
              committeeData = committeeJson.results[0];
            }
          } catch (error) {
            console.warn(`Failed to fetch committee data for ${candidate.name}:`, error);
          }
        }

        // Map to our application's candidate format
        return {
          name: candidate.name,
          party: candidate.party_full,
          office: candidate.office_full || candidate.office,
          alignment: "⚠️", // This will be determined by the priority analysis
          platformHighlights: [], // This would need to be determined through additional analysis
          rationale: "Alignment to be determined based on priorities",
          officialWebsite: "", // FEC API doesn't provide this
          positionSummary: `${candidate.incumbent_challenge_full || ''} candidate for ${candidate.office_full || candidate.office}`,
          financialSummary: committeeData ? {
            totalReceipts: committeeData.total_receipts,
            totalDisbursements: committeeData.total_disbursements,
            cashOnHand: committeeData.cash_on_hand_end_period
          } : undefined
        };
      })
    );

    return processedCandidates;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
}

async function fetchBallotMeasures(state: string, mode: "current" | "demo"): Promise<BallotMeasure[]> {
  if (!ballotpediaApiKey) {
    console.warn('BALLOTPEDIA_API_KEY not set');
    throw new Error('Ballotpedia API key is not configured');
  }

  try {
    const year = mode === "demo" ? 2024 : new Date().getFullYear();
    const url = `https://api.ballotpedia.org/v3/measures?access_token=${ballotpediaApiKey}&state=${state}&year=${year}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ballotpedia API error:', errorText);
      throw new Error(`Ballotpedia API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as BallotpediaApiResponse;
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format from Ballotpedia API');
    }

    return data.data.map((measure): BallotMeasure => ({
      title: measure.title || measure.name || 'Untitled Measure',
      description: measure.summary || measure.description || 'No description available',
      supporters: measure.supporters || [],
      opposers: measure.opponents || [],
      userConcernMapping: measure.topic || measure.category || 'Uncategorized',
      ballotpediaLink: measure.url || ''
    }));
  } catch (error) {
    console.error('Error fetching ballot measures:', error);
    throw error; // Re-throw to let the caller handle the error
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { zipCode, priorities } = await req.json()
    
    if (!priorities || !Array.isArray(priorities)) {
      throw new Error('Invalid priorities format')
    }

    const mode = req.headers.get('x-voter-mode') === 'demo' ? 'demo' : 'current';
    const results = await analyzePriorities(priorities, mode);

    return new Response(
      JSON.stringify(results),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})
