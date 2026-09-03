import React, { useState, useEffect } from 'react';
import { candidateApi, cloudStorageApi } from '../api';
import { 
  Candidate, Education, WorkExperience, Certification, 
  ProjectExperience, Publication, HonorAward, Patent, LanguageProficiency, MediaAttachment 
} from '../types';
import { 
  User, Phone, MapPin, Briefcase, GraduationCap, Code, FileText, Upload, Plus, Trash2, 
  CheckCircle2, Save, ExternalLink, Sparkles, Award, ThumbsUp, FolderGit2, BookOpen, 
  Trophy, Globe, FileCheck2, CloudUpload, Play 
} from 'lucide-react';

export const CandidateProfilePage: React.FC = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [headline, setHeadline] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [openToWork, setOpenToWork] = useState(true);

  // Lists
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [workExperienceList, setWorkExperienceList] = useState<WorkExperience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [projects, setProjects] = useState<ProjectExperience[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [awards, setAwards] = useState<HonorAward[]>([]);
  const [patents, setPatents] = useState<Patent[]>([]);
  const [languages, setLanguages] = useState<LanguageProficiency[]>([]);
  const [mediaAttachments, setMediaAttachments] = useState<MediaAttachment[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [skillEndorsements, setSkillEndorsements] = useState<Record<string, number>>({
    'Java 21': 14,
    'Spring Boot': 19,
    'React.js': 12,
    'TypeScript': 9,
    'MySQL': 7
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await candidateApi.getProfile();
      const c = res.data;
      setCandidate(c);
      setHeadline(c.headline || 'Senior Full-Stack Engineer at TechCorp Solutions | Java 21, React, Spring Boot');
      setPhone(c.phone || '');
      setLocation(c.location || '');
      setSummary(c.summary || '');
      setLinkedinUrl(c.linkedinUrl || '');
      setGithubUrl(c.githubUrl || '');
      setPortfolioUrl(c.portfolioUrl || '');
      setEducationList(c.educationList || []);
      setWorkExperienceList(c.workExperienceList || []);
      setCertifications(c.certifications || []);
      setProjects(c.projects || []);
      setPublications(c.publications || []);
      setAwards(c.awards || []);
      setPatents(c.patents || []);
      setLanguages(c.languages || []);
      setMediaAttachments(c.mediaAttachments || []);
      setSkills(c.skills || []);
      setOpenToWork(c.openToWork ?? true);
    } catch (err) {
      console.error(err);
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
        headline,
        phone,
        location,
        summary,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        educationList,
        workExperienceList,
        certifications,
        projects,
        publications,
        awards,
        patents,
        languages,
        mediaAttachments,
        skills,
        openToWork
      });

      setCandidate(updated.data);
      setSuccessMsg('Profile changes saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEndorseSkill = (skillName: string) => {
    setSkillEndorsements(prev => ({
      ...prev,
      [skillName]: (prev[skillName] || 0) + 1
    }));
  };

  /* ================= ADD & REMOVE HANDLERS FOR ALL SECTIONS ================= */
  
  // 1. Education
  const handleAddEducation = () => {
    setEducationList(prev => [...prev, { institution: '', degree: '', fieldOfStudy: '', startYear: 2020, endYear: 2024, grade: '' }]);
  };
  const handleRemoveEducation = (idx: number) => {
    setEducationList(prev => prev.filter((_, i) => i !== idx));
  };

  // 2. Experience
  const handleAddExperience = () => {
    setWorkExperienceList(prev => [...prev, { company: '', position: '', startDate: '', endDate: '', currentlyWorking: false, responsibilities: '' }]);
  };
  const handleRemoveExperience = (idx: number) => {
    setWorkExperienceList(prev => prev.filter((_, i) => i !== idx));
  };

  // 3. Certifications
  const handleAddCertification = () => {
    setCertifications(prev => [...prev, { id: Date.now(), name: 'New Certification', issuingOrganization: 'Certification Issuer', issueDate: new Date().toISOString().split('T')[0], credentialId: `CERT-${Date.now().toString().slice(-6)}` }]);
  };
  const handleRemoveCertification = (idx: number) => {
    setCertifications(prev => prev.filter((_, i) => i !== idx));
  };

  // 4. Projects
  const handleAddProject = () => {
    setProjects(prev => [...prev, { id: Date.now(), title: 'New Cloud Project', role: 'Full-Stack Developer', description: 'Architected high-scale web application.', technologies: ['React', 'Java 21'], liveUrl: 'https://demo.com', githubUrl: 'https://github.com' }]);
  };
  const handleRemoveProject = (idx: number) => {
    setProjects(prev => prev.filter((_, i) => i !== idx));
  };

  // 5. Media Attachments
  const handleRemoveMedia = (idx: number) => {
    setMediaAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  // 6. Publications
  const handleAddPublication = () => {
    setPublications(prev => [...prev, { id: Date.now(), title: 'New Engineering Publication', publisher: 'IEEE / Tech Journal', publicationDate: new Date().toISOString().split('T')[0], paperUrl: 'https://doi.org', abstractText: 'Paper abstract summary...' }]);
  };
  const handleRemovePublication = (idx: number) => {
    setPublications(prev => prev.filter((_, i) => i !== idx));
  };

  // 7. Awards
  const handleAddAward = () => {
    setAwards(prev => [...prev, { id: Date.now(), title: 'Engineering Excellence Award', issuer: 'Tech Organization', issueDate: new Date().toISOString().split('T')[0], description: 'Awarded for outstanding system architecture.' }]);
  };
  const handleRemoveAward = (idx: number) => {
    setAwards(prev => prev.filter((_, i) => i !== idx));
  };

  // 8. Patents
  const handleAddPatent = () => {
    setPatents(prev => [...prev, { id: Date.now(), title: 'Distributed Cloud System Patent', patentNumber: `US${Date.now().toString().slice(-8)}B2`, issueDate: new Date().toISOString().split('T')[0] }]);
  };
  const handleRemovePatent = (idx: number) => {
    setPatents(prev => prev.filter((_, i) => i !== idx));
  };

  // 9. Languages
  const handleAddLanguage = () => {
    setLanguages(prev => [...prev, { id: Date.now(), language: 'New Language', proficiency: 'PROFESSIONAL' }]);
  };
  const handleRemoveLanguage = (idx: number) => {
    setLanguages(prev => prev.filter((_, i) => i !== idx));
  };

  // 10. Skills
  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills(prev => [...prev, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleCloudFileUpload = async (file: File) => {
    try {
      const res = await cloudStorageApi.uploadMedia(file);
      const newMedia: MediaAttachment = {
        id: Date.now(),
        title: file.name,
        mediaUrl: res.data.mediaUrl,
        mediaType: file.type.includes('image') ? 'IMAGE' : file.type.includes('video') ? 'VIDEO' : 'DOCUMENT'
      };
      setMediaAttachments(prev => [...prev, newMedia]);
      setSuccessMsg(`Uploaded "${file.name}" to Cloud Storage!`);
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Hero Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div 
            className="h-36 bg-cover bg-center"
            style={{ backgroundImage: `url(${candidate?.bannerUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'})` }}
          />

          <div className="p-6 relative pt-0">
            <div className="flex flex-wrap items-end justify-between gap-4 -mt-14 mb-4">
              <div className="relative">
                <img
                  src={candidate?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
                />
                {openToWork && (
                  <span className="absolute bottom-0 right-0 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white shadow-xs">
                    #OPEN TO WORK
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpenToWork(!openToWork)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition border flex items-center gap-1.5 ${
                    openToWork ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {openToWork ? 'Status: #OpenToWork (On)' : 'Set #OpenToWork'}
                </button>

                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900">{candidate?.fullName || 'Alex Morgan'}</h1>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">{headline}</p>
              <p className="text-xs text-slate-400 font-medium mt-1">{location || 'San Francisco, CA'} · 482 connections · Cloud Verified</p>
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">

          {/* 1. Personal & Contact Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-600" />
              Personal & Professional Headline
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Professional Title & Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Senior Full-Stack Engineer | Java 21, React, Spring Boot"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City, State / Country</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 text-xs mb-1">Professional Executive Summary</label>
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Senior Full Stack Software Engineer with 6+ years of experience..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:border-sky-600 focus:bg-white"
              />
            </div>
          </div>

          {/* 2. Projects & Engineering Portfolio */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-sky-600" />
                Featured Projects & Engineering Work ({projects.length})
              </h2>
              <button
                type="button"
                onClick={handleAddProject}
                className="px-3 py-1.5 bg-sky-50 text-sky-700 font-semibold text-xs rounded-xl hover:bg-sky-100 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative text-xs">
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(idx)}
                    title="Remove Project"
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition p-1 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const list = [...projects];
                          list[idx].title = e.target.value;
                          setProjects(list);
                        }}
                        placeholder="e.g. TalentFlow Cloud Gateway"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Your Role</label>
                      <input
                        type="text"
                        value={proj.role}
                        onChange={(e) => {
                          const list = [...projects];
                          list[idx].role = e.target.value;
                          setProjects(list);
                        }}
                        placeholder="e.g. Lead Architect"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Live Demo URL</label>
                      <input
                        type="url"
                        value={proj.liveUrl || ''}
                        onChange={(e) => {
                          const list = [...projects];
                          list[idx].liveUrl = e.target.value;
                          setProjects(list);
                        }}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">GitHub Repo URL</label>
                      <input
                        type="url"
                        value={proj.githubUrl || ''}
                        onChange={(e) => {
                          const list = [...projects];
                          list[idx].githubUrl = e.target.value;
                          setProjects(list);
                        }}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description & Architecture Highlights</label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const list = [...projects];
                        list[idx].description = e.target.value;
                        setProjects(list);
                      }}
                      placeholder="Key achievements and microservices architecture..."
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Featured Media & Cloud Storage Attachments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CloudUpload className="w-4 h-4 text-sky-600" />
                Featured Portfolio Media & Cloud Attachments ({mediaAttachments.length})
              </h2>
              <label className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs">
                <Upload className="w-3.5 h-3.5" /> Upload File
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleCloudFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mediaAttachments.map((media, idx) => (
                <div key={media.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between relative group">
                  <div className="flex items-center gap-3">
                    {media.mediaType === 'VIDEO' ? (
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                        <Play className="w-5 h-5" />
                      </div>
                    ) : (
                      <img src={media.mediaUrl} alt={media.title} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                    )}
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{media.title}</h4>
                      <span className="text-[10px] text-slate-500 font-semibold">{media.mediaType} · Cloud Hosted</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <a
                      href={media.mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-slate-400 hover:text-sky-600 transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      title="Remove Media"
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Certifications Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-sky-600" />
                Licenses & Certifications ({certifications.length})
              </h2>
              <button
                type="button"
                onClick={handleAddCertification}
                className="px-3 py-1.5 bg-sky-50 text-sky-700 font-semibold text-xs rounded-xl hover:bg-sky-100 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Certification
              </button>
            </div>

            <div className="space-y-3">
              {certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between relative">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-sky-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{cert.name}</h4>
                      <p className="text-[11px] text-slate-500">{cert.issuingOrganization} · Issued {cert.issueDate}</p>
                      {cert.credentialId && (
                        <span className="text-[10px] text-slate-400 font-mono">Credential ID: {cert.credentialId}</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveCertification(idx)}
                    title="Remove Certification"
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Publications & Research Papers */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                Publications & Technical Papers ({publications.length})
              </h2>
              <button
                type="button"
                onClick={handleAddPublication}
                className="px-3 py-1.5 bg-sky-50 text-sky-700 font-semibold text-xs rounded-xl hover:bg-sky-100 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Publication
              </button>
            </div>

            <div className="space-y-3">
              {publications.map((pub, idx) => (
                <div key={pub.id || idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative text-xs">
                  <button
                    type="button"
                    onClick={() => handleRemovePublication(idx)}
                    title="Remove Publication"
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition p-1 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Paper Title</label>
                      <input
                        type="text"
                        value={pub.title}
                        onChange={(e) => {
                          const list = [...publications];
                          list[idx].title = e.target.value;
                          setPublications(list);
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Journal / Publisher</label>
                      <input
                        type="text"
                        value={pub.publisher}
                        onChange={(e) => {
                          const list = [...publications];
                          list[idx].publisher = e.target.value;
                          setPublications(list);
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Honors, Awards & Patents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Honors & Awards */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Honors & Awards ({awards.length})
                </h2>
                <button
                  type="button"
                  onClick={handleAddAward}
                  className="px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-lg hover:bg-amber-100 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>

              <div className="space-y-3">
                {awards.map((award, idx) => (
                  <div key={award.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveAward(idx)}
                      title="Remove Award"
                      className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center justify-between pr-6">
                      <span className="font-bold text-slate-900">{award.title}</span>
                      <span className="text-[10px] text-slate-400">{award.issueDate}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{award.issuer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Patents */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-sky-600" />
                  Patents & Innovations ({patents.length})
                </h2>
                <button
                  type="button"
                  onClick={handleAddPatent}
                  className="px-2.5 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-lg hover:bg-sky-100 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>

              <div className="space-y-3">
                {patents.map((pat, idx) => (
                  <div key={pat.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 relative">
                    <button
                      type="button"
                      onClick={() => handleRemovePatent(idx)}
                      title="Remove Patent"
                      className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center justify-between pr-6">
                      <span className="font-bold text-slate-900">{pat.title}</span>
                      <span className="text-[10px] text-slate-400">{pat.issueDate}</span>
                    </div>
                    <span className="text-[10px] font-mono text-sky-600 bg-sky-50 px-2 py-0.5 rounded">Patent: {pat.patentNumber}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 7. Education Entries */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-sky-600" />
                Education Background ({educationList.length})
              </h2>
              <button
                type="button"
                onClick={handleAddEducation}
                className="px-3 py-1.5 bg-sky-50 text-sky-700 font-semibold text-xs rounded-xl hover:bg-sky-100 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Degree
              </button>
            </div>

            <div className="space-y-4">
              {educationList.map((edu, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative text-xs">
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(idx)}
                    title="Remove Degree"
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition p-1 hover:bg-rose-50 rounded-lg"
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
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Work Experience Entries */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-sky-600" />
                Work Experience ({workExperienceList.length})
              </h2>
              <button
                type="button"
                onClick={handleAddExperience}
                className="px-3 py-1.5 bg-sky-50 text-sky-700 font-semibold text-xs rounded-xl hover:bg-sky-100 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Position
              </button>
            </div>

            <div className="space-y-4">
              {workExperienceList.map((exp, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative text-xs">
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(idx)}
                    title="Remove Position"
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition p-1 hover:bg-rose-50 rounded-lg"
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
                </div>
              ))}
            </div>
          </div>

          {/* 9. Spoken Languages & Fluency */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-600" />
                Languages & Spoken Fluency ({languages.length})
              </h2>
              <button
                type="button"
                onClick={handleAddLanguage}
                className="px-3 py-1.5 bg-sky-50 text-sky-700 font-semibold text-xs rounded-xl hover:bg-sky-100 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Language
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {languages.map((lang, idx) => (
                <div key={lang.id || idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{lang.language}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
                      {lang.proficiency}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(idx)}
                      title="Remove Language"
                      className="text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 10. Skills & Peer Endorsements */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-sky-600" />
              Technical & Core Skills ({skills.length})
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="e.g. React.js, Docker, Spring Boot..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-sky-600 text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition"
              >
                Add Skill
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {skills.map((skill, i) => (
                <div key={i} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{skill}</span>
                    <span className="text-[10px] text-slate-500">
                      {skillEndorsements[skill] || 5} endorsements from peers
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEndorseSkill(skill)}
                      className="bg-white border border-slate-200 hover:border-sky-400 hover:text-sky-600 text-slate-600 text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1 transition"
                    >
                      <ThumbsUp className="w-3 h-3 text-sky-600" /> Endorse
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      title="Remove Skill"
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
