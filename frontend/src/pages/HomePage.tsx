import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsApi } from '../api';
import { Job } from '../types';
import { JobCard } from '../components/JobCard';
import { Search, ArrowRight, TrendingUp, Users, Target, BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const res = await jobsApi.getJobs({ page: 0, size: 6 });
      setFeaturedJobs(res.data.jobs);
    } catch (err) {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-28 border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/50 mb-6">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                  Official Enterprise Recruitment Portal
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
                  Build Your Career <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                    With Us
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed font-normal">
                  Discover meaningful opportunities, apply with confidence, and take the next step in your professional journey with a team dedicated to excellence.
                </p>

                {/* Hero Quick Search Bar */}
                <div className="bg-white p-2 rounded-xl shadow-panel border border-slate-200 flex flex-col sm:flex-row items-center gap-2 max-w-2xl mb-8 text-slate-900">
                  <div className="flex items-center flex-1 px-3 py-2 w-full">
                    <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Job title, skills, or department..."
                      className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-400 text-slate-900"
                    />
                  </div>
                  <Link
                    to={`/jobs?search=${encodeURIComponent(searchQuery)}`}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition flex items-center justify-center gap-2 shadow-sm shrink-0"
                  >
                    <span>Search Jobs</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Stat Badges */}
                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-800 text-left">
                  <div>
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-xs text-slate-400">Open Roles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">98%</div>
                    <div className="text-xs text-slate-400">Candidate Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-xs text-slate-400">Equal Opportunity</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Opportunities</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Featured Openings</h2>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 mt-3 md:mt-0 transition"
            >
              View All Jobs ({featuredJobs.length}+)
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-12 bg-slate-100 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
              <p className="text-slate-600">No open positions available right now. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>

        {/* Why Join Us Section */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Our Culture</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-1">Why Join TalentFlow?</h2>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                We believe in fostering an environment where innovation thrives, contributions are celebrated, and professional development is continuous.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition shadow-subtle">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-5 font-bold">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Career Growth</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Clear promotion pathways, mentorship programs, and leadership development tracks designed to advance your trajectory.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition shadow-subtle">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5 font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Collaborative Culture</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Work alongside passionate, talented colleagues in a supportive environment built on open communication and mutual respect.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition shadow-subtle">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 font-bold">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Meaningful Work</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Tackle mission-critical challenges that deliver tangible value to global enterprise customers and millions of end users.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition shadow-subtle">
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-5 font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Continuous Learning</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Annual education stipends, conference sponsorships, certification coverage, and dedicated learning time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Take the Next Step?</h2>
            <p className="text-slate-300 text-base max-w-2xl mx-auto mb-8">
              Explore our current job openings or create your candidate profile to get discovered by our talent acquisition team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/jobs"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm transition flex items-center gap-2"
              >
                Explore All Jobs
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 transition"
              >
                Create Candidate Profile
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
