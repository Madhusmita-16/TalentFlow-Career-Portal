import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Globe, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">TalentFlow</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Empowering top talent to discover meaningful career opportunities at world-class enterprise technology organizations.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/jobs" className="hover:text-white transition">Explore Openings</Link></li>
              <li><a href="#" className="hover:text-white transition">Culture & Values</a></li>
              <li><a href="#" className="hover:text-white transition">Leadership</a></li>
              <li><a href="#" className="hover:text-white transition">News & Press</a></li>
            </ul>
          </div>

          {/* Careers & Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">Resources & Legal</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/candidate/dashboard" className="hover:text-white transition">Candidate Portal</Link></li>
              <li><a href="#" className="hover:text-white transition">Application Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Security & Compliance</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">Corporate Office</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>100 Technology Plaza, Suite 800, San Francisco, CA 94105</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+1 (800) 555-TALENT</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>careers@talentflow.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} TalentFlow Enterprise Recruitment Systems. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-400 transition">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition">Terms</a>
            <a href="#" className="hover:text-slate-400 transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
