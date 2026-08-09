import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobsApi, candidateApi, applicationsApi } from '../api';
import { Job, Candidate, ScreeningQuestion, ScreeningAnswer } from '../types';
import { CheckCircle2, User, FileText, Briefcase, HelpCircle, CheckSquare, ArrowRight, ArrowLeft, Upload, FileCheck, AlertCircle } from 'lucide-react';

export const ApplicationFlowPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [job, setJob] = useState<Job | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Application Data State
  const [coverNote, setCoverNote] = useState('');
  const [selectedResumePath, setSelectedResumePath] = useState('');
  const [newResumeFile, setNewResumeFile] = useState<File | null>(null);
  const [screeningAnswers, setScreeningAnswers] = useState<Record<number, string>>({});
  const [accuracyConfirmed, setAccuracyConfirmed] = useState(false);

  // Result state after submission
  const [submittedApplicationId, setSubmittedApplicationId] = useState<number | null>(null);

  useEffect(() => {
    if (jobId) {
      loadInitialData();
    }
  }, [jobId]);

  const loadInitialData = async () => {
    try {
      const [jobRes, candRes] = await Promise.all([
        jobsApi.getJobById(Number(jobId)),
        candidateApi.getProfile(),
      ]);

      setJob(jobRes.data);
      setCandidate(candRes.data);
      if (candRes.data.resumeFilePath) {
        setSelectedResumePath(candRes.data.resumeFilePath);
      }
    } catch (err: any) {
      setErrorMessage('Failed to load application details. Please login as a candidate.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeFileUpload = async (file: File) => {
    setNewResumeFile(file);
    try {
      const res = await candidateApi.uploadResume(file);
      setSelectedResumePath(res.data.filePath);
    } catch (err) {
      // Fallback
    }
  };

  const handleScreeningAnswerChange = (qId: number, val: string) => {
    setScreeningAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmitApplication = async () => {
    if (!accuracyConfirmed) {
      setErrorMessage('You must confirm that your provided information is accurate and complete.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formattedAnswers: ScreeningAnswer[] = Object.entries(screeningAnswers).map(([qId, ans]) => ({
        questionId: Number(qId),
        answerText: ans,
      }));

      const res = await applicationsApi.submitApplication({
        jobId: Number(jobId),
        coverNote,
        resumeFilePath: selectedResumePath,
        answers: formattedAnswers,
      });

      setSubmittedApplicationId(res.data.id);
      setStep(6); // Step 6 Confirmation Screen
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit application. You may have already applied.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-semibold">Initializing Multi-Step Application Form...</p>
        </div>
      </div>
    );
  }

  if (!job || !candidate) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-card">
          <p className="text-rose-600 font-semibold text-sm mb-4">{errorMessage || 'Unable to open application.'}</p>
          <Link to="/jobs" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Personal Details', icon: User },
    { num: 2, label: 'Resume', icon: FileText },
    { num: 3, label: 'Experience', icon: Briefcase },
    { num: 4, label: 'Questions', icon: HelpCircle },
    { num: 5, label: 'Review', icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Job Title Bar */}
        <div className="mb-6 flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Application for</span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">{job.title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{job.department} · {job.location} · {job.employmentType.replace('_', ' ')}</p>
          </div>
          <Link to={`/jobs/${job.id}`} className="text-xs text-slate-500 hover:text-slate-900 underline">
            Cancel & Exit
          </Link>
        </div>

        {/* Multi-Step Wizard Progress Bar */}
        {step <= 5 && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 mb-8 shadow-subtle">
            <div className="flex items-center justify-between relative">
              {steps.map((s, idx) => {
                const IconComponent = s.icon;
                const isCurrent = step === s.num;
                const isCompleted = step > s.num;
                return (
                  <div key={s.num} className="flex-1 flex flex-col items-center relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white shadow-sm ring-4 ring-blue-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <IconComponent className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-[11px] font-semibold mt-2 hidden sm:block ${
                        isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step Cards Container */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-card">
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Step 1 — Verify Personal Details</h2>
              <p className="text-xs text-slate-500">Your profile details will be attached to this job application.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={candidate.fullName}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={candidate.email}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    disabled
                    value={candidate.phone || 'Not provided'}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Location</label>
                  <input
                    type="text"
                    disabled
                    value={candidate.location || 'Not provided'}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Note / Introduction (Optional)</label>
                <textarea
                  rows={4}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Introduce yourself to the hiring team and highlight why you are a strong fit for this role..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition flex items-center gap-2"
                >
                  Continue to Resume
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Resume */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Step 2 — Attach Your Resume</h2>

              {candidate.resumeFilename && (
                <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileCheck className="w-6 h-6 text-blue-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Saved Resume: {candidate.resumeFilename}</div>
                      <div className="text-[10px] text-slate-500">Uploaded {candidate.resumeUploadedAt ? new Date(candidate.resumeUploadedAt).toLocaleDateString() : 'Previously'}</div>
                    </div>
                  </div>
                  <label className="flex items-center space-x-2 text-xs text-blue-700 font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="resumeSelection"
                      checked={selectedResumePath === candidate.resumeFilePath}
                      onChange={() => setSelectedResumePath(candidate.resumeFilePath!)}
                      className="accent-blue-600"
                    />
                    <span>Use Saved Resume</span>
                  </label>
                </div>
              )}

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition bg-slate-50">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-700 mb-1">Upload New Resume Document</div>
                <p className="text-[11px] text-slate-400 mb-4">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleResumeFileUpload(e.target.files[0]);
                    }
                  }}
                  className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  disabled={!selectedResumePath}
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition flex items-center gap-2 disabled:opacity-40"
                >
                  Continue to Experience
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Education & Experience */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Step 3 — Education & Work History</h2>

              {/* Education Summary */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Education Background</h3>
                {candidate.educationList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No education entries added in candidate profile.</p>
                ) : (
                  <div className="space-y-2">
                    {candidate.educationList.map((edu, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                        <div className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</div>
                        <div className="text-slate-600">{edu.institution} ({edu.startYear} - {edu.endYear})</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Work Experience Summary */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Work Experience</h3>
                {candidate.workExperienceList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No work experience entries added in candidate profile.</p>
                ) : (
                  <div className="space-y-2">
                    {candidate.workExperienceList.map((exp, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                        <div className="font-bold text-slate-900">{exp.position} @ {exp.company}</div>
                        <div className="text-slate-600">{exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}</div>
                        {exp.responsibilities && <p className="text-slate-500 mt-1 line-clamp-2">{exp.responsibilities}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition flex items-center gap-2"
                >
                  Continue to Questions
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Screening Questions */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Step 4 — Screening Questions</h2>

              {(!job.screeningQuestions || job.screeningQuestions.length === 0) ? (
                <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                  No additional screening questions required for this position. Proceed to review.
                </div>
              ) : (
                <div className="space-y-5">
                  {job.screeningQuestions.map((q) => (
                    <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <label className="block text-xs font-bold text-slate-900">
                        {q.questionText} {q.required && <span className="text-rose-500">*</span>}
                      </label>

                      {q.questionType === 'TEXT' && (
                        <textarea
                          rows={3}
                          value={screeningAnswers[q.id] || ''}
                          onChange={(e) => handleScreeningAnswerChange(q.id, e.target.value)}
                          placeholder="Type your response..."
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-600 text-slate-900"
                        />
                      )}

                      {q.questionType === 'YES_NO' && (
                        <div className="flex gap-4 text-xs font-semibold text-slate-700 pt-1">
                          <label className="flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`q_${q.id}`}
                              value="Yes"
                              checked={screeningAnswers[q.id] === 'Yes'}
                              onChange={(e) => handleScreeningAnswerChange(q.id, e.target.value)}
                              className="accent-blue-600"
                            />
                            <span>Yes</span>
                          </label>
                          <label className="flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`q_${q.id}`}
                              value="No"
                              checked={screeningAnswers[q.id] === 'No'}
                              onChange={(e) => handleScreeningAnswerChange(q.id, e.target.value)}
                              className="accent-blue-600"
                            />
                            <span>No</span>
                          </label>
                        </div>
                      )}

                      {q.questionType === 'SINGLE_CHOICE' && q.optionsJson && (
                        <div className="space-y-1.5 pt-1">
                          {q.optionsJson.split(',').map((opt, idx) => (
                            <label key={idx} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                              <input
                                type="radio"
                                name={`q_${q.id}`}
                                value={opt.trim()}
                                checked={screeningAnswers[q.id] === opt.trim()}
                                onChange={(e) => handleScreeningAnswerChange(q.id, e.target.value)}
                                className="accent-blue-600"
                              />
                              <span>{opt.trim()}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition flex items-center gap-2"
                >
                  Review Application
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Confirm */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Step 5 — Final Review & Submission</h2>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl space-y-1 border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Position</div>
                  <div className="font-bold text-slate-900 text-sm">{job.title}</div>
                  <div className="text-slate-600">{job.department} · {job.location}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-1 border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Candidate</div>
                  <div className="font-bold text-slate-900">{candidate.fullName} ({candidate.email})</div>
                  <div className="text-slate-600">Selected Resume Path: {selectedResumePath}</div>
                </div>

                {coverNote && (
                  <div className="p-4 bg-slate-50 rounded-xl space-y-1 border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Cover Note</div>
                    <div className="text-slate-700 italic">{coverNote}</div>
                  </div>
                )}
              </div>

              {/* Legal Confirmation Checkbox */}
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="confirmCheck"
                  checked={accuracyConfirmed}
                  onChange={(e) => setAccuracyConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="confirmCheck" className="text-xs text-slate-800 leading-relaxed cursor-pointer font-medium">
                  I confirm that all information provided in this job application is true, accurate, and complete to the best of my knowledge. I understand that misrepresentation may lead to disqualification.
                </label>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setStep(4)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  disabled={!accuracyConfirmed || isSubmitting}
                  onClick={handleSubmitApplication}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition shadow-sm disabled:opacity-40 flex items-center gap-2"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application Now'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Confirmation Screen */}
          {step === 6 && (
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Success</span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Application Submitted Successfully</h2>
                <p className="text-xs text-slate-500 mt-1">Your application has been received and logged in our candidate pipeline.</p>
              </div>

              <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 text-left">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-400">Application ID:</span>
                  <span className="font-bold text-slate-900">#APP-{submittedApplicationId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-400">Target Role:</span>
                  <span className="font-semibold text-slate-900">{job.title}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-400">Submission Date:</span>
                  <span className="font-semibold text-slate-900">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Initial Status:</span>
                  <span className="font-bold text-blue-600">SUBMITTED</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link
                  to="/candidate/applications"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition shadow-sm"
                >
                  View Status Timeline
                </Link>
                <Link
                  to="/candidate/dashboard"
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200 transition"
                >
                  Go to Candidate Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
