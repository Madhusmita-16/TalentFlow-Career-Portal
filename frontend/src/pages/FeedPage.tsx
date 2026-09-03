import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { feedApi, candidateApi, jobsApi } from '../api';
import { Post, Candidate, Job } from '../types';
import { 
  ThumbsUp, MessageSquare, Repeat, Share2, Image, Briefcase, 
  Sparkles, Send, Eye, Users, Bookmark, ChevronRight, X, TrendingUp, Filter
} from 'lucide-react';
import { EasyApplyModal } from '../components/EasyApplyModal';

export const FeedPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [candidateProfile, setCandidateProfile] = useState<Candidate | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HIRING' | 'ADVICE'>('ALL');
  
  // Post modal state
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<number | undefined>();

  // Comment state
  const [openCommentPostId, setOpenCommentPostId] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Easy Apply modal state from feed
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  useEffect(() => {
    fetchFeedData();
  }, []);

  const fetchFeedData = async () => {
    try {
      const [postsRes, candidateRes, jobsRes] = await Promise.all([
        feedApi.getPosts(),
        candidateApi.getProfile().catch(() => null),
        jobsApi.getJobs()
      ]);
      setPosts(postsRes.data);
      if (candidateRes?.data) setCandidateProfile(candidateRes.data);
      if (jobsRes?.data?.jobs) setJobs(jobsRes.data.jobs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const res = await feedApi.likePost(postId);
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isLiked: res.data.isLiked,
            likesCount: res.data.likesCount
          };
        }
        return p;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId: number) => {
    if (!commentInput.trim()) return;
    try {
      await feedApi.addComment(postId, commentInput);
      setCommentInput('');
      fetchFeedData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const taggedJob = jobs.find(j => j.id === selectedJobId);

    try {
      await feedApi.createPost({
        content: postContent,
        imageUrl: postImage || undefined,
        taggedJobId: taggedJob?.id,
        taggedJobTitle: taggedJob?.title,
        hashtags: ['#career', '#talentflow', '#tech'],
        authorName: candidateProfile?.fullName || user?.fullName || 'Alex Morgan',
        authorTitle: candidateProfile?.headline || 'Senior Full-Stack Engineer',
        authorAvatar: candidateProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        authorBadge: candidateProfile?.openToWork ? 'OPEN_TO_WORK' : undefined
      });

      setPostContent('');
      setPostImage('');
      setSelectedJobId(undefined);
      setIsComposerOpen(false);
      fetchFeedData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'HIRING') return post.authorBadge === 'HIRING' || post.taggedJobId;
    if (activeFilter === 'ADVICE') return post.hashtags.some(h => h.includes('advice') || h.includes('tips'));
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ================= LEFT SIDEBAR (PROFILE WIDGET) ================= */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Profile Banner */}
              <div 
                className="h-20 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${candidateProfile?.bannerUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'})` }}
              />
              
              <div className="p-4 relative pt-0 text-center">
                {/* Avatar with Open To Work Ring */}
                <div className="relative inline-block -mt-10 mb-2">
                  <img
                    src={candidateProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
                  />
                  {candidateProfile?.openToWork && (
                    <span className="absolute bottom-0 right-0 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white shadow-xs">
                      #OPEN TO WORK
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                  {candidateProfile?.fullName || user?.fullName || 'Alex Morgan'}
                </h3>
                <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-1 px-2">
                  {candidateProfile?.headline || 'Senior Full-Stack Engineer | Java 21, React, Spring Boot'}
                </p>

                {/* Profile Stats */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-2 text-left px-1">
                  <div className="flex items-center justify-between text-slate-600 hover:bg-slate-50 p-1.5 rounded-lg transition">
                    <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Eye className="w-3.5 h-3.5 text-slate-400" /> Profile views
                    </span>
                    <span className="font-bold text-sky-600">{candidateProfile?.profileViewsCount || 149}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 hover:bg-slate-50 p-1.5 rounded-lg transition">
                    <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> Connections
                    </span>
                    <span className="font-bold text-sky-600">{candidateProfile?.connectionsCount || 482}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-left px-1">
                  <Link 
                    to="/candidate/profile"
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center justify-between"
                  >
                    <span>View Full Profile</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs text-xs space-y-2.5">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-amber-500" /> AI Profile Strength</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">94%</span>
              </div>
              
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-sky-500 to-emerald-500 h-full w-[94%] rounded-full animate-pulse" />
              </div>

              <p className="text-[11px] text-slate-500 font-medium">
                💡 AI Tip: Add 2 recent certifications to reach 100% recruiter visibility.
              </p>

              <Link to="/candidate/profile" className="block text-center text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 py-1.5 rounded-xl transition">
                Optimize with AI →
              </Link>
            </div>
          </div>

          {/* ================= CENTER FEED STREAM ================= */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Post Creator Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={candidateProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt="User"
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
                <button
                  onClick={() => setIsComposerOpen(true)}
                  className="flex-grow text-left bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200 rounded-full py-3 px-5 text-xs font-medium text-slate-500 transition"
                >
                  Start a post about career updates, hiring, or advice...
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600 px-2">
                <button 
                  onClick={() => setIsComposerOpen(true)}
                  className="flex items-center gap-1.5 hover:bg-slate-50 p-2 rounded-lg text-sky-600 transition"
                >
                  <Image className="w-4 h-4" /> Media
                </button>
                <button 
                  onClick={() => setIsComposerOpen(true)}
                  className="flex items-center gap-1.5 hover:bg-slate-50 p-2 rounded-lg text-emerald-600 transition"
                >
                  <Briefcase className="w-4 h-4" /> Job Post
                </button>
                <button 
                  onClick={() => setIsComposerOpen(true)}
                  className="flex items-center gap-1.5 hover:bg-slate-50 p-2 rounded-lg text-amber-600 transition"
                >
                  <Sparkles className="w-4 h-4" /> Career Advice
                </button>
              </div>
            </div>

            {/* Feed Filter Bar */}
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" /> Sort Feed by:
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveFilter('ALL')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${activeFilter === 'ALL' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter('HIRING')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${activeFilter === 'HIRING' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Hiring & Jobs
                </button>
                <button
                  onClick={() => setActiveFilter('ADVICE')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${activeFilter === 'ADVICE' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Career Advice
                </button>
              </div>
            </div>

            {/* Posts Stream */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  
                  {/* Post Author Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        />
                        {post.authorBadge === 'HIRING' && (
                          <span className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-[8px] font-black px-1 py-0.2 rounded-md">
                            HIRING
                          </span>
                        )}
                        {post.authorBadge === 'OPEN_TO_WORK' && (
                          <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[8px] font-black px-1 py-0.2 rounded-md">
                            OPEN
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{post.authorName}</h4>
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-1.5 py-0.5 rounded">1st</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{post.authorTitle}</p>
                        <span className="text-[10px] text-slate-400">{post.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                    {post.content}
                  </p>

                  {/* Tagged Job Card inside Feed */}
                  {post.taggedJobId && (
                    <div className="bg-sky-50/60 border border-sky-200 p-4 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">Featured Job Opening</span>
                        <h5 className="font-bold text-slate-900 text-sm mt-1">{post.taggedJobTitle}</h5>
                        <p className="text-xs text-slate-600">Apply directly using Easy Apply</p>
                      </div>
                      <button
                        onClick={() => {
                          const j = jobs.find(job => job.id === post.taggedJobId);
                          if (j) setSelectedJobForApply(j);
                        }}
                        className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 shrink-0"
                      >
                        <Send className="w-3 h-3" /> Easy Apply
                      </button>
                    </div>
                  )}

                  {/* Post Image */}
                  {post.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-200">
                      <img src={post.imageUrl} alt="Post Attachment" className="w-full h-64 object-cover" />
                    </div>
                  )}

                  {/* Hashtags */}
                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.hashtags.map((tag, i) => (
                        <span key={i} className="text-xs font-bold text-sky-600 hover:underline cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats Line */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-medium">
                      👍 {post.likesCount} Likes
                    </span>
                    <div className="space-x-3">
                      <span>{post.commentsCount} comments</span>
                      <span>{post.repostsCount} reposts</span>
                    </div>
                  </div>

                  {/* Action Buttons Bar */}
                  <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-100 text-xs font-semibold text-slate-600">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition hover:bg-slate-100 ${post.isLiked ? 'text-sky-600 font-extrabold' : ''}`}
                    >
                      <ThumbsUp className="w-4 h-4" /> {post.isLiked ? 'Liked' : 'Like'}
                    </button>
                    
                    <button
                      onClick={() => setOpenCommentPostId(openCommentPostId === post.id ? null : post.id)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg transition hover:bg-slate-100"
                    >
                      <MessageSquare className="w-4 h-4" /> Comment
                    </button>
                    
                    <button className="flex items-center justify-center gap-1.5 py-2 rounded-lg transition hover:bg-slate-100">
                      <Repeat className="w-4 h-4" /> Repost
                    </button>
                    
                    <button className="flex items-center justify-center gap-1.5 py-2 rounded-lg transition hover:bg-slate-100">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>

                  {/* Comments Section */}
                  {openCommentPostId === post.id && (
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      {/* Comment Input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-grow text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl"
                        >
                          Post
                        </button>
                      </div>

                      {/* Comment list */}
                      <div className="space-y-2 pt-2">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900">{comment.authorName}</span>
                              <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                            </div>
                            <p className="text-xs text-slate-700">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>

          {/* ================= RIGHT SIDEBAR (TRENDING NEWS & RECOMMENDED JOBS) ================= */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* TalentFlow News Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-sky-600" /> Career Insights & Tech News
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className="hover:bg-slate-50 p-1.5 rounded-lg transition cursor-pointer">
                  <h5 className="font-bold text-slate-900 leading-snug">Software Engineer Demand Surges by 32%</h5>
                  <span className="text-[10px] text-slate-400 font-medium">Top stories · 4,820 readers</span>
                </div>
                <div className="hover:bg-slate-50 p-1.5 rounded-lg transition cursor-pointer">
                  <h5 className="font-bold text-slate-900 leading-snug">Spring Boot 3.3 & Java 21 Adoption Trends</h5>
                  <span className="text-[10px] text-slate-400 font-medium">Tech insights · 2,190 readers</span>
                </div>
                <div className="hover:bg-slate-50 p-1.5 rounded-lg transition cursor-pointer">
                  <h5 className="font-bold text-slate-900 leading-snug">Remote Work Policy Updates in 2026</h5>
                  <span className="text-[10px] text-slate-400 font-medium">Workplace news · 9,410 readers</span>
                </div>
              </div>
            </div>

            {/* Recommended Top Jobs Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-sky-600" /> Top Job Picks for You
              </h4>

              <div className="space-y-3 divide-y divide-slate-100">
                {jobs.slice(0, 2).map((job) => (
                  <div key={job.id} className="pt-2 first:pt-0 space-y-1.5">
                    <h5 className="font-bold text-slate-900 text-xs hover:text-sky-600 transition">
                      <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    </h5>
                    <p className="text-[11px] text-slate-500">{job.location} · {job.workMode}</p>
                    <button
                      onClick={() => setSelectedJobForApply(job)}
                      className="bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-[11px] font-bold px-2.5 py-1 rounded-lg w-full flex items-center justify-center gap-1"
                    >
                      <Send className="w-3 h-3" /> Easy Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Post Creator Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Create a Post</h3>
              <button onClick={() => setIsComposerOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                rows={4}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What do you want to talk about? Share an achievement, hiring update, or career advice..."
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Attach Image URL (Optional)</label>
                <input
                  type="url"
                  value={postImage}
                  onChange={(e) => setPostImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tag a Job Opening (Optional)</label>
                <select
                  value={selectedJobId || ''}
                  onChange={(e) => setSelectedJobId(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="">No job tagged</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Easy Apply Modal from Feed */}
      {selectedJobForApply && candidateProfile && (
        <EasyApplyModal
          job={selectedJobForApply}
          candidate={candidateProfile}
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={() => setSelectedJobForApply(null)}
        />
      )}
    </div>
  );
};
