import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobsApi } from '../api';
import { Job } from '../types';
import { JobCard } from '../components/JobCard';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, X, RefreshCw } from 'lucide-react';

export const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [department, setDepartment] = useState(searchParams.get('department') || 'ALL');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || 'ALL');
  const [employmentType, setEmploymentType] = useState(searchParams.get('employmentType') || 'ALL');
  const [workMode, setWorkMode] = useState(searchParams.get('workMode') || 'ALL');
  const [minSalary, setMinSalary] = useState<number | undefined>(
    searchParams.get('minSalary') ? Number(searchParams.get('minSalary')) : undefined
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'recent');
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchJobs();
  }, [search, department, locationFilter, employmentType, workMode, minSalary, sortBy, currentPage]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        size: 9,
        sortBy,
      };
      if (search) params.search = search;
      if (department !== 'ALL') params.department = department;
      if (locationFilter !== 'ALL') params.location = locationFilter;
      if (employmentType !== 'ALL') params.employmentType = employmentType;
      if (workMode !== 'ALL') params.workMode = workMode;
      if (minSalary) params.minSalary = minSalary;

      const res = await jobsApi.getJobs(params);
      setJobs(res.data.jobs);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
    } catch (err) {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setDepartment('ALL');
    setLocationFilter('ALL');
    setEmploymentType('ALL');
    setWorkMode('ALL');
    setMinSalary(undefined);
    setSortBy('recent');
    setCurrentPage(0);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Career Opportunities</h1>
          <p className="text-sm text-slate-600 mt-1">
            Discover active positions across our global departments and apply directly.
          </p>
        </div>

        {/* Search Bar & Top Sort Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(0);
              }}
              placeholder="Search by job title, skills, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-600 focus:bg-white transition text-slate-900"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(0);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="salaryHigh">Salary: High to Low</option>
                <option value="salaryLow">Salary: Low to High</option>
                <option value="title">Job Title (A-Z)</option>
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5"
              title="Reset all filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-card h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                Filter Roles
              </h3>
              <span className="text-xs font-medium text-slate-500">{totalItems} Jobs</span>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Department</label>
              <select
                value={department}
                onChange={(e) => { setDepartment(e.target.value); setCurrentPage(0); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-600"
              >
                <option value="ALL">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            {/* Work Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => { setWorkMode(e.target.value); setCurrentPage(0); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-600"
              >
                <option value="ALL">All Work Modes</option>
                <option value="ON_SITE">On-Site</option>
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => { setEmploymentType(e.target.value); setCurrentPage(0); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-600"
              >
                <option value="ALL">All Types</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            {/* Minimum Salary Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Min Salary</label>
                <span className="text-xs font-semibold text-blue-600">
                  {minSalary ? `$${(minSalary / 1000).toFixed(0)}k+` : 'Any'}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="200000"
                step="10000"
                value={minSalary || 50000}
                onChange={(e) => {
                  setMinSalary(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>$50k</span>
                <span>$200k+</span>
              </div>
            </div>
          </div>

          {/* Job Grid & Pagination */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-12 bg-slate-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-card">
                <p className="text-slate-600 font-semibold text-lg">No matching jobs found</p>
                <p className="text-slate-400 text-xs mt-1">Try resetting your filters or adjusting your search query.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-500 transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-8">
                    <button
                      disabled={currentPage === 0}
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      className="px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <span className="text-xs text-slate-600 font-medium">
                      Page <strong className="text-slate-900">{currentPage + 1}</strong> of {totalPages}
                    </span>

                    <button
                      disabled={currentPage >= totalPages - 1}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                      className="px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
