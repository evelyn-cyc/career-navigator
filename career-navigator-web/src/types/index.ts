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
  
  export type ApplicationStatus = 'Saved' | 'Applied' | 'OA' | 'Interview' | 'Offer' | 'Rejected'

  export type Application = {
    id: string
    company: string
    role: string
    status: ApplicationStatus
    appliedDate: string
    matchLevel?: MatchLevel
    notes: string
  }