import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { mockJobRequirements } from '../mocks/mockData'
import type { Job } from '../types'

const JOB_STEPS = [
  'Reading job description',
  'Identifying role & company details',
  'Extracting required skills',
]

type Panel = 'entry' | 'analyzing'
type Method = 'ai' | 'manual'

type AddJobModalProps = {
  onAdd: (data: Omit<Job, 'id'>, openDetail: boolean) => void
  onClose: () => void
}

export default function AddJobModal({ onAdd, onClose }: AddJobModalProps) {
  const [panel, setPanel] = useState<Panel>('entry')
  const [method, setMethod] = useState<Method>('ai')
  const [jdText, setJdText] = useState('')
  const [step, setStep] = useState(0)

  // Manual form state
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [location, setLocation] = useState('')
  const [workArrangement, setWorkArrangement] = useState('')
  const [salary, setSalary] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [workingHours, setWorkingHours] = useState('')
  const [citizenshipRequirement, setCitizenshipRequirement] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [applicationUrl, setApplicationUrl] = useState('')
  const [skillsText, setSkillsText] = useState('')
  const [fieldError, setFieldError] = useState(false)
  const row1Ref = useRef<HTMLDivElement>(null)

  // Drive analyzing animation
  useEffect(() => {
    if (panel !== 'analyzing') return
    if (step >= JOB_STEPS.length) {
      const t = setTimeout(() => {
        onAdd(
          {
            ...mockJobRequirements,
            savedDate: new Date().toISOString().split('T')[0],
          },
          true,
        )
        onClose()
      }, 350)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStep((s) => s + 1), 680)
    return () => clearTimeout(t)
  }, [panel, step, onAdd, onClose])

  const handleExtract = () => {
    if (!jdText.trim()) return
    setStep(0)
    setPanel('analyzing')
  }

  const handleManualSave = () => {
    if (!company.trim() || !role.trim()) {
      setFieldError(true)
      row1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      return
    }
    setFieldError(false)
    const requiredSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    onAdd(
      {
        company: company.trim() || undefined,
        role: role.trim() || undefined,
        employmentType: employmentType.trim() || undefined,
        location: location.trim() || undefined,
        workArrangement: workArrangement.trim() || undefined,
        salaryRange: salary.trim() || undefined,
        startDate: startDate.trim() || undefined,
        endDate: endDate.trim() || undefined,
        workingHours: workingHours.trim() || undefined,
        citizenshipRequirement: citizenshipRequirement.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        applicationUrl: applicationUrl.trim() || undefined,
        requiredSkills,
        savedDate: new Date().toISOString().split('T')[0],
      },
      false,
    )
    onClose()
  }

  const inputCls =
    'w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-violet-500'

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-8 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[560px]"
      >
        {/* ── Panel A: Entry ── */}
        {panel === 'entry' && (
          <div className="bg-white rounded-2xl shadow-2xl w-full h-[82vh] max-h-[88vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-7 pt-7 flex-none">
              <h2 className="text-xl font-bold text-slate-900">Add a job</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center"
              >
                <X size={15} />
              </button>
            </div>

            {/* Method tabs */}
            <div className="flex gap-2 px-7 pt-5 flex-none">
              {(['ai', 'manual'] as Method[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${
                    method === m
                      ? 'bg-violet-50 border-violet-200 text-violet-600'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {m === 'ai' ? '✦ Paste description' : '✎ Enter manually'}
                </button>
              ))}
            </div>

            <div className="flex-1 flex flex-col min-h-0 p-7 pt-5">
              {/* AI tab */}
              {method === 'ai' && (
                <div className="flex-1 flex flex-col min-h-0">
                  <textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="flex-1 min-h-0 w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 resize-none focus:outline-none focus:border-violet-500 mb-4"
                  />
                  <button
                    onClick={handleExtract}
                    disabled={!jdText.trim()}
                    className="flex-none w-full py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Extract Requirements
                  </button>
                </div>
              )}

              {/* Manual tab */}
              {method === 'manual' && (
                <div className="flex-1 overflow-y-auto -mr-3 pr-3">
                  {/* Row 1: Company + Role */}
                  <div ref={row1Ref} className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Company <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={company}
                        onChange={(e) => {
                          setCompany(e.target.value)
                          setFieldError(false)
                        }}
                        placeholder="aiDevelop"
                        className={
                          fieldError && !company.trim()
                            ? `${inputCls} !border-red-400 !bg-red-50`
                            : inputCls
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={role}
                        onChange={(e) => {
                          setRole(e.target.value)
                          setFieldError(false)
                        }}
                        placeholder="Frontend Developer"
                        className={
                          fieldError && !role.trim()
                            ? `${inputCls} !border-red-400 !bg-red-50`
                            : inputCls
                        }
                      />
                    </div>
                  </div>

                  {/* Row 2: Type + Work Arrangement */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Employment Type
                      </label>
                      <input
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                        placeholder="Full-time"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Work Arrangement
                      </label>
                      <input
                        value={workArrangement}
                        onChange={(e) => setWorkArrangement(e.target.value)}
                        placeholder="Hybrid"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Row 3: Location + Salary */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Location
                      </label>
                      <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Melbourne, VIC"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Salary
                      </label>
                      <input
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        placeholder="$90,000 – $110,000"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Row 4: Start Date + End Date */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Start Date
                      </label>
                      <input
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="2026-08-01"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        End Date
                      </label>
                      <input
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="2027-08-01"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Row 5: Working Hours + Citizenship/Visa */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Working Hours
                      </label>
                      <input
                        value={workingHours}
                        onChange={(e) => setWorkingHours(e.target.value)}
                        placeholder="38 hrs/week"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Citizenship / Visa
                      </label>
                      <input
                        value={citizenshipRequirement}
                        onChange={(e) =>
                          setCitizenshipRequirement(e.target.value)
                        }
                        placeholder="AU citizen or PR"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Row 6: Contact Email + Application Link */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Contact Email
                      </label>
                      <input
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="careers@company.com"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Application Link
                      </label>
                      <input
                        value={applicationUrl}
                        onChange={(e) => setApplicationUrl(e.target.value)}
                        placeholder="https://..."
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Required Skills{' '}
                      <span className="font-normal text-slate-400">
                        comma-separated
                      </span>
                    </label>
                    <input
                      value={skillsText}
                      onChange={(e) => setSkillsText(e.target.value)}
                      placeholder="React, TypeScript, AWS"
                      className={inputCls}
                    />
                  </div>

                  <button
                    onClick={handleManualSave}
                    className="w-full py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700"
                  >
                    Save job
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Panel B: Analyzing ── */}
        {panel === 'analyzing' && (
          <div className="bg-white rounded-2xl shadow-2xl w-full p-11 text-center">
            <div className="w-12 h-12 border-[3px] border-violet-100 border-t-violet-600 rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-lg font-bold text-slate-900 mb-7">
              Extracting requirements
            </h3>
            <div className="text-left flex flex-col gap-3.5 w-full max-w-xs mx-auto">
              {JOB_STEPS.map((label, i) => {
                const done = i < step
                const active = i === step
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 text-sm transition-colors ${
                      done
                        ? 'text-slate-900'
                        : active
                          ? 'text-violet-600 font-semibold'
                          : 'text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-none transition-all ${
                        done
                          ? 'bg-green-700 border-green-700'
                          : active
                            ? 'border-violet-500'
                            : 'border-slate-200'
                      }`}
                    >
                      {done && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    {label}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
