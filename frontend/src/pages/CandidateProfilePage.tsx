import React, { useState, useEffect } from 'react';
import { candidateApi } from '../api';
import { Candidate, Education, WorkExperience } from '../types';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Code, FileText, Upload, Plus, Trash2, CheckCircle2, Save, ExternalLink } from 'lucide-react';

export const CandidateProfilePage: React.FC = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const [educationList, setEducationList] = useState<Education[]>([]);
  const [workExperienceList, setWorkExperienceList] = useState<WorkExperience[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await candidateApi.getProfile();
      const c = res.data;
      setCandidate(c);
      setPhone(c.phone || '');
      setLocation(c.location || '');
      setSummary(c.summary || '');
      setLinkedinUrl(c.linkedinUrl || '');
      setGithubUrl(c.githubUrl || '');
      setPortfolioUrl(c.portfolioUrl || '');
      setEducationList(c.educationList || []);
      setWorkExperienceList(c.workExperienceList || []);
      setSkills(c.skills || []);
    } catch (err) {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);

    try {
      const updated = await candidateApi.updateProfile({
        phone,
        location,
        summary,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        educationList,
        workExperienceList,
        skills,
      });

      setCandidate(updated.data);
      setSuccessMsg('Candidate profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      // Ignore
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddEducation = () => {
    setEducationList([
      ...educationList,
      { institution: '', degree: '', fieldOfStudy: '', startYear: 2020, endYear: 2024, grade: '' },
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const handleAddExperience = () => {
    setWorkExperienceList([
      ...workExperienceList,
      { company: '', position: '', startDate: '', endDate: '', currentlyWorking: false, responsibilities: '' },
    ]);
  };

  const handleRemoveExperience = (index: number) => {
    setWorkExperienceList(workExperienceList.filter((_, i) => i !== index));
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleResumeFileUpload = async (file: File) => {
    try {
      const res = await candidateApi.uploadResume(file);
      if (candidate) {
        setCandidate({
          ...candidate,
          resumeFilename: res.data.filename,
          resumeFilePath: res.data.filePath,
        });
      }
      setSuccessMsg('Resume uploaded successfully!');
    } catch (err) {
      // Ignore
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="text-slate-400 text-xs font-semibold">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Candidate Profile</h1>
            <p className="text-xs text-slate-500 mt-1">Keep your professional experience, skills, and resume updated for recruiters.</p>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-8">
          {/* Personal & Contact Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Personal & Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  disabled
                  value={candidate?.fullName || ''}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-medium text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={candidate?.email || ''}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-medium text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City, State / Country</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 text-xs mb-1">Professional Summary</label>
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Senior Full Stack Software Engineer with 6+ years of experience..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">GitHub Profile</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Portfolio / Website</label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourname.dev"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Resume Upload & PDF Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Resume Document
            </h2>

            {candidate?.resumeFilename ? (
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-blue-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{candidate.resumeFilename}</div>
                    <div className="text-[10px] text-slate-500">Active Resume File</div>
                  </div>
                </div>
                <a
                  href={`http://localhost:8080${candidate.resumeFilePath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  View PDF
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No resume PDF uploaded yet.</p>
            )}

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Upload New Resume (PDF / DOCX)</label>
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
          </div>

          {/* Education Entries */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Education Background
              </h2>
              <button
                type="button"
                onClick={handleAddEducation}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 font-semibold text-xs rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Degree
              </button>
            </div>

            <div className="space-y-4">
              {educationList.map((edu, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative text-xs">
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Institution / University</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const list = [...educationList];
                          list[idx].institution = e.target.value;
                          setEducationList(list);
                        }}
                        placeholder="e.g. UC Berkeley"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Degree Title</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const list = [...educationList];
                          list[idx].degree = e.target.value;
                          setEducationList(list);
                        }}
                        placeholder="e.g. Bachelor of Science"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Field of Study</label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) => {
                          const list = [...educationList];
                          list[idx].fieldOfStudy = e.target.value;
                          setEducationList(list);
                        }}
                        placeholder="e.g. Computer Science"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Start Year</label>
                        <input
                          type="number"
                          value={edu.startYear || 2020}
                          onChange={(e) => {
                            const list = [...educationList];
                            list[idx].startYear = Number(e.target.value);
                            setEducationList(list);
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">End Year</label>
                        <input
                          type="number"
                          value={edu.endYear || 2024}
                          onChange={(e) => {
                            const list = [...educationList];
                            list[idx].endYear = Number(e.target.value);
                            setEducationList(list);
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience Entries */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Work Experience
              </h2>
              <button
                type="button"
                onClick={handleAddExperience}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 font-semibold text-xs rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Position
              </button>
            </div>

            <div className="space-y-4">
              {workExperienceList.map((exp, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative text-xs">
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const list = [...workExperienceList];
                          list[idx].company = e.target.value;
                          setWorkExperienceList(list);
                        }}
                        placeholder="e.g. TechCorp Solutions"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Position / Job Title</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => {
                          const list = [...workExperienceList];
                          list[idx].position = e.target.value;
                          setWorkExperienceList(list);
                        }}
                        placeholder="e.g. Senior Software Engineer"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Responsibilities & Achievements</label>
                    <textarea
                      rows={2}
                      value={exp.responsibilities || ''}
                      onChange={(e) => {
                        const list = [...workExperienceList];
                        list[idx].responsibilities = e.target.value;
                        setWorkExperienceList(list);
                      }}
                      placeholder="Key achievements and technologies utilized..."
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Tags */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-600" />
              Technical & Core Skills
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="e.g. React.js, Docker, Microservices..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-600 text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition"
              >
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-md"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
