import { create } from 'zustand'
import type { ResumeAnalysis, JobMatchResult } from '../types'

type CareerStore = {
  resumeAnalysis: ResumeAnalysis | null
  jobMatchResult: JobMatchResult | null
  setResumeAnalysis: (analysis: ResumeAnalysis) => void
  setJobMatchResult: (result: JobMatchResult) => void
}

export const useCareerStore = create<CareerStore>((set) => ({
  resumeAnalysis: null,
  jobMatchResult: null,
  setResumeAnalysis: (analysis) => set({ resumeAnalysis: analysis }),
  setJobMatchResult: (result) => set({ jobMatchResult: result }),
}))
