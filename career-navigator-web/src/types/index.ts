export type ResumeAnalysis = {
    extractedSkills: string[]
    projects: string[]
    experience: string[]
    suggestions: string[]
  }
  
  export type MatchLevel = 'strong' | 'good' | 'moderate' | 'weak' | 'mismatch'
  
  export type JobMatchResult = {
    matchLevel: MatchLevel
    matchedSkills: string[]
    missingSkills: string[]
    suggestedKeywords: string[]
  }
  