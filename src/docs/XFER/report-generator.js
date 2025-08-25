#!/usr/bin/env node

import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

// Configuration
const CONFIG = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4-turbo',
  maxTokens: 1000,
  temperature: 0.5,
  topP: 0.85,
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: CONFIG.openaiApiKey,
})

// Get city and state from zip code
async function getCityStateFromZip(zipCode) {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`)
    if (!response.ok) return null

    const data = await response.json()
    const place = data.places[0]
    return {
      city: place['place name'],
      state: place['state'],
      country: 'USA',
    }
  } catch (error) {
    console.error('Error fetching location data:', error)
    return null
  }
}

// Generate political recommendations
async function generateRecommendations(selections) {
  try {
    // Build location context
    let locationContext = ''
    let cityState = null

    if (selections.zipCode) {
      cityState = await getCityStateFromZip(selections.zipCode)
      if (cityState) {
        locationContext = `The user is located in ${cityState.city}, ${cityState.state} (zip code ${selections.zipCode}). `
      } else {
        locationContext = `The user is located in zip code ${selections.zipCode}. `
      }
      locationContext +=
        'Tailor the local information specifically to this location, including relevant local officials, upcoming elections, and local political issues.'
    }

    // Build education context
    let educationContext = ''
    if (selections.educationLevel) {
      educationContext = `The user's highest level of education completed is: ${selections.educationLevel}. Adjust the complexity and depth of information accordingly.`
    }

    // Build concerns context
    const concernsContext = []
    if (selections.category01Concern) {
      concernsContext.push(
        `For Local (${selections.category01}), they are specifically concerned about: ${selections.category01Concern}`
      )
    }
    if (selections.category02Concern) {
      concernsContext.push(
        `For National (${selections.category02}), they are specifically concerned about: ${selections.category02Concern}`
      )
    }
    if (selections.category03Concern) {
      concernsContext.push(
        `For International (${selections.category03}), they are specifically concerned about: ${selections.category03Concern}`
      )
    }

    const response = await openai.chat.completions.create({
      model: CONFIG.model,
      messages: [
        {
          role: 'system',
          content: `You are a knowledgeable political scientist who provides clear, actionable information about political topics. Your expertise helps citizens understand complex issues and take meaningful action.
          
          ${locationContext ? locationContext + 'Tailor the local information specifically to this location, including relevant local officials, upcoming elections, and specific local policies or initiatives that are currently important. ' : ''}
          
          ${concernsContext.join('\n')}
          
          For each topic, provide specific, actionable recommendations that clearly outline what steps the reader can take. Include:
          - Current key developments that make this issue timely and relevant
          - Specific actions citizens can take (e.g., contacting specific officials, participating in particular programs, attending specific types of meetings)
          - Concrete ways to stay informed (specific news sources, government websites, community organizations)
          - If applicable, important upcoming dates related to the issue (elections, public comment periods, implementation dates)`,
        },
        {
          role: 'user',
          content: `Generate comprehensive, actionable content about these political topics:
          - Local issue: ${selections.category01}
          - National issue: ${selections.category02}
          - International issue: ${selections.category03}
          
          Format the response with the following structure for each category:
          1. Start with a heading for the category (e.g., "## Local issue: Taxes")
          2. ${concernsContext.length > 0 ? 'If I have mentioned a specific concern for a category, begin with "You expressed interest in [specific concern]" and include the city and state if available for local concerns.' : 'Skip this step'} 
          3. Provide 4-5 detailed bullet points with relevant information, including current developments and context
          4. Add a section titled "**What You Can Do:**" with 3-4 specific, actionable steps citizens can take
          5. Add a line break, then write "Resources for further information:"
          6. List 3-5 specific resources as bullet points, including official websites, community organizations, and relevant news sources
          7. Add another line break after the resources section before starting the next category
          
          IMPORTANT: Do not include any greeting, conclusion, or title at the beginning of your response. Do NOT add any line like "We hope you find these recommendations helpful and informative!" at the end.`,
        },
      ],
      temperature: CONFIG.temperature,
      top_p: CONFIG.topP,
      max_tokens: CONFIG.maxTokens,
      frequency_penalty: 0.5,
      presence_penalty: 0.4,
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error generating recommendations:', error)
    throw error
  }
}

// Main function
async function main() {
  // Example usage - replace with actual input method
  const selections = {
    category01: 'Local Taxes',
    category01Concern: 'Property tax increases',
    category02: 'Healthcare',
    category02Concern: 'Medicare reform',
    category03: 'Climate Change',
    category03Concern: 'International cooperation',
    zipCode: '90210',
    educationLevel: "Bachelor's Degree",
  }

  try {
    console.log('Generating political recommendations...')
    const report = await generateRecommendations(selections)

    // Format the final report
    const formattedReport = `# Your Personalized Political Report\n\n${report}\n\nWe hope you find these recommendations helpful and informative!`

    // Output to console
    console.log('\n' + '='.repeat(80))
    console.log(formattedReport)
    console.log('='.repeat(80))

    // Optionally save to file
    const outputFile = `political-report-${Date.now()}.md`
    fs.writeFileSync(outputFile, formattedReport)
    console.log(`\nReport saved to: ${outputFile}`)
  } catch (error) {
    console.error('Failed to generate report:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { generateRecommendations }
