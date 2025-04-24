import fs from 'fs';
import path from 'path';

interface IssueTerm {
  id: string;
  term: string;
  category: string;
  synonyms: string[];
  mappedPolicies: string[];
  dateAdded: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface IssueTerminology {
  version: string;
  lastUpdated: string;
  pendingTerms: IssueTerm[];
  approvedTerms: IssueTerm[];
}

export class IssueTerminologyService {
  private terminologyPath: string;
  private terminology: IssueTerminology;

  constructor(dataPath = '/src/data') {
    // In browser environment, we'll use API endpoints instead of direct file access
    this.terminologyPath = path.join(process.cwd(), dataPath, 'issueTerminology.json');
    this.terminology = this.loadTerminology();
  }

  /**
   * Load terminology from the JSON file
   */
  private loadTerminology(): IssueTerminology {
    try {
      if (typeof window !== 'undefined') {
        // Browser environment - would use fetch in a real implementation
        throw new Error('Direct file access not available in browser');
      }
      
      const data = fs.readFileSync(this.terminologyPath, 'utf8');
      return JSON.parse(data) as IssueTerminology;
    } catch (error) {
      console.error('Error loading terminology:', error);
      // Return default structure if file doesn't exist or can't be parsed
      return {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        pendingTerms: [],
        approvedTerms: []
      };
    }
  }

  /**
   * Save terminology to the JSON file
   */
  private saveTerminology(): boolean {
    try {
      if (typeof window !== 'undefined') {
        // Browser environment - would use API in a real implementation
        console.log('Would save terminology via API in browser environment');
        return true;
      }
      
      this.terminology.lastUpdated = new Date().toISOString();
      fs.writeFileSync(
        this.terminologyPath,
        JSON.stringify(this.terminology, null, 2),
        'utf8'
      );
      return true;
    } catch (error) {
      console.error('Error saving terminology:', error);
      return false;
    }
  }

  /**
   * Add a new pending term to the terminology
   */
  public addPendingTerm(
    term: string,
    category: string = 'Uncategorized',
    synonyms: string[] = [],
    mappedPolicies: string[] = []
  ): boolean {
    try {
      // Check if term already exists in approved or pending terms
      const existingApproved = this.terminology.approvedTerms.find(
        t => t.term.toLowerCase() === term.toLowerCase() ||
             t.synonyms.some(s => s.toLowerCase() === term.toLowerCase())
      );
      
      const existingPending = this.terminology.pendingTerms.find(
        t => t.term.toLowerCase() === term.toLowerCase() ||
             t.synonyms.some(s => s.toLowerCase() === term.toLowerCase())
      );
      
      if (existingApproved || existingPending) {
        console.log('Term already exists in terminology');
        return false;
      }
      
      // Create new term
      const newTerm: IssueTerm = {
        id: Date.now().toString(),
        term,
        category,
        synonyms,
        mappedPolicies,
        dateAdded: new Date().toISOString(),
        status: 'pending'
      };
      
      // Add to pending terms
      this.terminology.pendingTerms.push(newTerm);
      
      // Save terminology
      return this.saveTerminology();
    } catch (error) {
      console.error('Error adding pending term:', error);
      return false;
    }
  }

  /**
   * Get all approved terms
   */
  public getApprovedTerms(): IssueTerm[] {
    return this.terminology.approvedTerms;
  }

  /**
   * Get all pending terms
   */
  public getPendingTerms(): IssueTerm[] {
    return this.terminology.pendingTerms;
  }

  /**
   * Check if a term exists in the terminology
   */
  public termExists(term: string): boolean {
    const normalizedTerm = term.toLowerCase();
    
    // Check in approved terms
    const existsInApproved = this.terminology.approvedTerms.some(
      t => t.term.toLowerCase() === normalizedTerm ||
           t.synonyms.some(s => s.toLowerCase() === normalizedTerm)
    );
    
    // Check in pending terms
    const existsInPending = this.terminology.pendingTerms.some(
      t => t.term.toLowerCase() === normalizedTerm ||
           t.synonyms.some(s => s.toLowerCase() === normalizedTerm)
    );
    
    return existsInApproved || existsInPending;
  }
}

// Create a browser-compatible version for client-side use
export class BrowserIssueTerminologyService {
  /**
   * Add a pending term via API
   */
  public async addPendingTerm(
    term: string,
    category: string = 'Uncategorized',
    synonyms: string[] = [],
    mappedPolicies: string[] = []
  ): Promise<boolean> {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll just store in localStorage for demo purposes
      const storedTerms = localStorage.getItem('pendingTerms') || '[]';
      const pendingTerms = JSON.parse(storedTerms);
      
      // Check if term already exists
      const exists = pendingTerms.some(
        (t: any) => t.term.toLowerCase() === term.toLowerCase() ||
                   (t.synonyms && t.synonyms.some((s: string) => s.toLowerCase() === term.toLowerCase()))
      );
      
      if (exists) {
        console.log('Term already exists in pending terms');
        return false;
      }
      
      // Add new term
      pendingTerms.push({
        id: Date.now().toString(),
        term,
        category,
        synonyms,
        mappedPolicies,
        dateAdded: new Date().toISOString(),
        status: 'pending'
      });
      
      // Save to localStorage
      localStorage.setItem('pendingTerms', JSON.stringify(pendingTerms));
      
      console.log('Added pending term:', term);
      return true;
    } catch (error) {
      console.error('Error adding pending term:', error);
      return false;
    }
  }

  /**
   * Check if a term exists in localStorage
   */
  public termExists(term: string): boolean {
    try {
      const normalizedTerm = term.toLowerCase();
      const storedTerms = localStorage.getItem('pendingTerms') || '[]';
      const pendingTerms = JSON.parse(storedTerms);
      
      return pendingTerms.some(
        (t: any) => t.term.toLowerCase() === normalizedTerm ||
                   (t.synonyms && t.synonyms.some((s: string) => s.toLowerCase() === normalizedTerm))
      );
    } catch (error) {
      console.error('Error checking if term exists:', error);
      return false;
    }
  }
}

// Export a singleton instance for browser use
export const browserIssueTerminologyService = new BrowserIssueTerminologyService();
