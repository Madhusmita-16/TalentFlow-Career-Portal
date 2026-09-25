import React, { useState } from 'react';
import { Candidate } from '../../types';
import { Sparkles, CheckCircle2, Download, Share2, Edit3, QrCode, Globe, ShieldCheck, Camera, Trash2, Eye, Upload, Image as ImageIcon } from 'lucide-react';

interface ProfileHeaderHeroProps {
  candidate: Candidate | null;
  headline: string;
  location: string;
  openToWork: boolean;
  onToggleOpenToWork: () => void;
  onSave: () => void;
  onOpenQR: () => void;
  onOpenPublicProfile: () => void;
  onUploadAvatar?: (file: File) => void;
  onEditAvatarUrl?: (url: string) => void;
  onDeleteAvatar?: () => void;
  onUploadBanner?: (file: File) => void;
  onEditBannerUrl?: (url: string) => void;
  onDeleteBanner?: () => void;
  onUploadResume?: (file: File) => void;
  isSaving: boolean;
}

export const ProfileHeaderHero: React.FC<ProfileHeaderHeroProps> = ({
  candidate,
  headline,
  location,
  openToWork,
  onToggleOpenToWork,
  onSave,
  onOpenQR,
  onOpenPublicProfile,
  onUploadAvatar,
  onEditAvatarUrl,
  onDeleteAvatar,
  onUploadBanner,
  onEditBannerUrl,
  onDeleteBanner,
  onUploadResume,
  isSaving,
}) => {
  const [showAvatarEditMenu, setShowAvatarEditMenu] = useState(false);

  const handlePromptAvatarUrl = () => {
    const current = candidate?.avatarUrl || '';
    const newUrl = window.prompt('Enter Profile Photo Image URL:', current);
    if (newUrl !== null && onEditAvatarUrl) {
      onEditAvatarUrl(newUrl);
    }
  };

  const handlePromptBannerUrl = () => {
    const current = candidate?.bannerUrl || '';
    const newUrl = window.prompt('Enter Cover Banner Image URL:', current);
    if (newUrl !== null && onEditBannerUrl) {
      onEditBannerUrl(newUrl);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden relative">
      
      {/* 🖼️ Cover Banner & Cover Photo Controls */}
      <div className="h-44 sm:h-48 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden group">
        {candidate?.bannerUrl ? (
          <img
            src={candidate.bannerUrl}
            alt="Cover Banner"
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
        )}
        <div className="absolute right-6 bottom-4 text-white/10 font-mono text-5xl font-black select-none tracking-widest pointer-events-none">
          LINK2CAREER
        </div>

        {/* Cover Photo Action Bar (Upload, Edit URL, Delete) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition z-20">
          {/* Upload Cover Photo */}
          {onUploadBanner && (
            <label className="p-2 bg-slate-900/80 hover:bg-sky-600 text-white rounded-xl cursor-pointer backdrop-blur-xs transition shadow-sm flex items-center gap-1 text-xs font-semibold px-2.5" title="Upload Cover Banner Photo">
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Change Cover</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0] && onUploadBanner) {
                    onUploadBanner(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>
          )}

          {/* Edit Cover URL */}
          {onEditBannerUrl && (
            <button
              type="button"
              onClick={handlePromptBannerUrl}
              className="p-2 bg-slate-900/80 hover:bg-indigo-600 text-white rounded-xl backdrop-blur-xs transition shadow-sm"
              title="Edit Banner Image URL"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete Cover Banner */}
          {candidate?.bannerUrl && onDeleteBanner && (
            <button
              type="button"
              onClick={onDeleteBanner}
              className="p-2 bg-slate-900/80 hover:bg-rose-600 text-white rounded-xl backdrop-blur-xs transition shadow-sm"
              title="Remove Cover Photo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Info Section */}
      <div className="p-6 sm:p-8 relative pt-0">
        <div className="flex flex-wrap items-end justify-between gap-4 -mt-16 mb-4">
          
          {/* 📷 Profile Photo Avatar & Hover Action Menu (Upload, Edit, Delete) */}
          <div className="relative group">
            <img
              src={candidate?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={candidate?.fullName || 'Candidate Avatar'}
              className="w-32 h-32 rounded-2xl border-4 border-white shadow-md object-cover bg-slate-100"
            />

            {/* Profile Picture Action Button Overlay */}
            <div className="absolute inset-0 rounded-2xl bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 border-4 border-white/20">
              {/* Upload Photo File */}
              {onUploadAvatar && (
                <label className="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl cursor-pointer shadow-md transition" title="Upload Profile Picture">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0] && onUploadAvatar) {
                        onUploadAvatar(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              )}

              {/* Edit Photo URL */}
              {onEditAvatarUrl && (
                <button
                  type="button"
                  onClick={handlePromptAvatarUrl}
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition"
                  title="Edit Photo URL"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}

              {/* Delete Profile Photo */}
              {candidate?.avatarUrl && onDeleteAvatar && (
                <button
                  type="button"
                  onClick={onDeleteAvatar}
                  className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md transition"
                  title="Delete Profile Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {openToWork && (
              <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border-2 border-white shadow-xs flex items-center gap-1 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> #OPEN TO WORK
              </span>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenPublicProfile}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
              title="Preview Public Profile"
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" /> View Public Profile
            </button>

            <button
              type="button"
              onClick={onToggleOpenToWork}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition border flex items-center gap-1.5 ${
                openToWork
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {openToWork ? 'Status: #OpenToWork' : 'Set #OpenToWork'}
            </button>

            <button
              type="button"
              onClick={onOpenQR}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center gap-1.5"
              title="Share QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-sky-600" /> QR
            </button>

            {onUploadResume && (
              <label className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs rounded-xl border border-sky-200 transition flex items-center gap-1.5 cursor-pointer">
                <Download className="w-3.5 h-3.5 text-sky-600 rotate-180" /> Upload Resume
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onUploadResume(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </label>
            )}

            {candidate?.resumeFilePath && (
              <a
                href={candidate?.resumeFilePath || '#'}
                download
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" /> Resume
              </a>
            )}

            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>

        {/* Identity & Verification Badges */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {candidate?.fullName || 'Madhusmita Mishra'}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
              <ShieldCheck className="w-3 h-3 text-sky-600" /> Identity Verified
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Skills Verified
            </span>
          </div>

          <p className="text-xs text-slate-700 font-semibold leading-relaxed max-w-3xl">
            {headline || 'Software Developer | Java | Spring Boot | React | REST APIs'}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" /> {location || 'San Francisco, CA · India'}
            </span>
            <span>·</span>
            <span>482 Connections</span>
            <span>·</span>
            <span>149 Profile Views This Month</span>
          </div>
        </div>
      </div>
    </div>
  );
};
