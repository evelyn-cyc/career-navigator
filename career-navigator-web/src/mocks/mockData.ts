import type { ResumeAnalysis, JobMatchResult } from '../types'

export const mockResumeAnalysis: ResumeAnalysis = {
    extractedSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Git'],
    projects: ['Aussie EcoLens - Image classification web app', 'Lumora - Canvas-based recognition app'],
    experience: ['Frontend Developer Intern, 6 months'],
    suggestions: ['Add more detail to project impact/results', 'Mention any testing experience'],
  }
  
  export const mockJobMatchResult: JobMatchResult = {
    matchLevel: 'good',
    matchedSkills: ['React', 'TypeScript', 'Git'],
    missingSkills: ['Docker', 'AWS', 'CI/CD'],
    suggestedKeywords: ['cloud deployment', 'containerization', 'continuous integration'],
  }