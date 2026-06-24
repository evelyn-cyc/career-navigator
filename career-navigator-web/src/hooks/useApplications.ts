import { useState, useEffect } from 'react'
import type { Application, ApplicationStatus } from '../types'

const STORAGE_KEY = 'career-navigator-applications'

function loadApplications(): Application[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>(loadApplications)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  }, [applications])

  const addApplication = (data: Omit<Application, 'id'>) => {
    const newApplication: Application = { ...data, id: crypto.randomUUID() }
    setApplications((prev) => [...prev, newApplication])
  }

  const updateStatus = (id: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    )
  }

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id))
  }

  return { applications, addApplication, updateStatus, deleteApplication }
}