const express = require('express');
const cors = require('cors');
const app = express();
const port = 54321;

// Enable CORS
app.use(cors());
app.use(express.json());

// Mock analyze-priorities endpoint
app.post('/functions/v1/analyze-priorities', async (req, res) => {
  try {
    const { zipCode, priorities, mode } = req.body;
    
    // Mock response data
    const response = {
      mappings: {
        "Healthcare": ["Healthcare Reform", "Medicare", "Affordable Care Act"],
        "Environment": ["Climate Change", "Environmental Protection", "Clean Energy"],
        "Education": ["Public Education", "Student Loans", "School Funding"]
      },
      analysis: "Your priorities focus on social services and environmental protection. There may be some policy trade-offs to consider between immediate healthcare needs and long-term environmental investments.",
      representatives: [
        {
          name: "Jane Smith",
          role: "Senator",
          party: "Democratic Party",
          alignment: "✅",
          issueAreas: ["Healthcare", "Environment"],
          contactInfo: {
            email: "jane.smith@senate.gov",
            phone: "(555) 123-4567"
          }
        }
      ],
      candidates: [
        {
          name: "John Doe",
          party: "Democratic Party",
          office: "Senate",
          alignment: "✅",
          platformHighlights: [
            "Universal Healthcare",
            "Climate Action",
            "Education Reform"
          ],
          rationale: "Strong alignment with healthcare and environmental priorities"
        }
      ],
      ballotMeasures: [
        {
          title: "Clean Energy Initiative",
          description: "Proposal to increase renewable energy investment",
          supporters: ["Environmental Groups", "Clean Energy Coalition"],
          opposers: ["Traditional Energy Companies"],
          userConcernMapping: "Environment"
        }
      ]
    };

    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Mock Edge Functions server running at http://localhost:${port}`);
});
