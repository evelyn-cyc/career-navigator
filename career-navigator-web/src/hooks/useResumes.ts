import { useState, useEffect } from 'react'
import type { ResumeAnalysis } from '../types'
import { deleteFile } from '../utils/fileStore'

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

  const addResume = (data: Omit<ResumeAnalysis, 'id'>, providedId?: string) => {
    const newResume: ResumeAnalysis = {
      ...data,
      id: providedId ?? crypto.randomUUID(),
    }
    setResumes((prev) => [...prev, newResume])
  }

  const deleteResume = (id: string) => {
    setResumes((prev) => prev.filter((resume) => resume.id !== id))
    deleteFile(id)
  }

  const togglePin = (id: string) => {
    setResumes((prev) =>
      prev.map((resume) =>
        resume.id === id ? { ...resume, pinned: !resume.pinned } : resume,
      ),
    )
  }

  const reorderResumes = (sourceId: string, targetId: string) => {
    setResumes((prev) => {
      const from = prev.findIndex((r) => r.id === sourceId)
      const to = prev.findIndex((r) => r.id === targetId)
      if (from === -1 || to === -1 || from === to) return prev
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  const renameResume = (id: string, name: string) => {
    setResumes((prev) =>
      prev.map((resume) => (resume.id === id ? { ...resume, name } : resume)),
    )
  }

  return {
    resumes,
    addResume,
    deleteResume,
    togglePin,
    reorderResumes,
    renameResume,
  }
}
