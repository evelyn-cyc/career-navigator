import { useState, useEffect } from 'react'
import type { ResumeAnalysis } from '../types'

const STORAGE_KEY = 'career-navigator-resumes'

function loadResumes(): ResumeAnalysis[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function useResumes() {
  const [resumes, setResumes] = useState<ResumeAnalysis[]>(loadResumes)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
  }, [resumes])

  const addResume = (data: Omit<ResumeAnalysis, 'id'>) => {
    const newResume: ResumeAnalysis = { ...data, id: crypto.randomUUID() }
    setResumes((prev) => [...prev, newResume])
  }

  const deleteResume = (id: string) => {
    setResumes((prev) => prev.filter((resume) => resume.id !== id))
  }

  const togglePin = (id: string) => {
    setResumes((prev) =>
      prev.map((resume) =>
        resume.id === id ? { ...resume, pinned: !resume.pinned } : resume,
      ),
    )
  }

  return { resumes, addResume, deleteResume, togglePin }
}
