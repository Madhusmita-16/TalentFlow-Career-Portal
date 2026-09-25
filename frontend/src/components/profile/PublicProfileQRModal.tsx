import React, { useState } from 'react';
import { X, Copy, Check, Download, QrCode } from 'lucide-react';

interface PublicProfileQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
}

export const PublicProfileQRModal: React.FC<PublicProfileQRModalProps> = ({
  isOpen,
  onClose,
  username = 'madhusmita-mishra',
}) => {
  const [copied, setCopied] = useState(false);
  const profileUrl = `https://talentflow.com/in/${username}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <QrCode className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900">Digital Professional Identity</h3>
            <p className="text-xs text-slate-500 font-medium">Scan QR code to view public candidate portfolio</p>
          </div>

          {/* QR Code Placeholder Graphic */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block shadow-inner">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(profileUrl)}`}
              alt="TalentFlow Public Profile QR Code"
              className="w-44 h-44 rounded-xl"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-600 truncate mr-2">{profileUrl}</span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shrink-0 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
