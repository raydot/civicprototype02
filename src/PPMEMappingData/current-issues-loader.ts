interface Topic {
  name: string;
  description: string;
  public_concern: string;
  sources: Array<{
    title: string;
    url: string;
  }>;
}

interface CategoryIssue {
  category: string;
  topics: Topic[];
}

interface CurrentIssuesData {
  timestamp: string;
  location: string;
  issues: CategoryIssue[];
}

// Import the JSON data
import currentIssuesJson from './current-issues.json';

// Type assertion to ensure the JSON has the expected structure
export const currentIssues = currentIssuesJson as CurrentIssuesData;

// Export a function to get topics by category
export function getTopicsByCategory(category: string): Topic[] {
  const categoryData = currentIssues.issues.find(
    issue => issue.category.toLowerCase() === category.toLowerCase()
  );
  
  return categoryData?.topics || [];
}

// Export a function to get all topic names
export function getAllTopicNames(): string[] {
  return currentIssues.issues.flatMap(issue => 
    issue.topics.map(topic => topic.name)
  );
}

// Export a function to search topics by keyword
export function searchTopics(keyword: string): Topic[] {
  const lowerKeyword = keyword.toLowerCase();
  
  return currentIssues.issues.flatMap(issue => 
    issue.topics.filter(topic => 
      topic.name.toLowerCase().includes(lowerKeyword) || 
      topic.description.toLowerCase().includes(lowerKeyword)
    )
  );
}

// Export the last updated timestamp
export const lastUpdated = new Date(currentIssues.timestamp);
