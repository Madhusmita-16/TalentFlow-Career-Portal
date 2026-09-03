import React, { useState, useEffect } from 'react';
import { networkApi } from '../api';
import { ConnectionRequest, NetworkUser } from '../types';
import { Users, UserPlus, Check, X, MessageSquare, MapPin, Building2, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NetworkPage: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<NetworkUser[]>([]);
  const [activeTab, setActiveTab] = useState<'GROW' | 'CONNECTIONS'>('GROW');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    try {
      const [reqsRes, suggRes] = await Promise.all([
        networkApi.getPendingRequests(),
        networkApi.getSuggestedUsers()
      ]);
      setPendingRequests(reqsRes.data);
      setSuggestedUsers(suggRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRespondRequest = async (requestId: number, action: 'ACCEPT' | 'IGNORE') => {
    try {
      await networkApi.respondConnectionRequest(requestId, action);
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnect = async (userId: number) => {
    try {
      await networkApi.sendConnectionRequest(userId);
      setSuggestedUsers(prev => prev.map(u => u.id === userId ? { ...u, hasPendingRequest: true } : u));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSuggested = suggestedUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-sky-100 text-sky-700 p-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                <Users className="w-4 h-4" /> My Network
              </span>
              <h2 className="text-xl font-black text-slate-900">Manage Professional Connections</h2>
            </div>
            <p className="text-xs text-slate-600">Grow your professional career network, connect with recruiters, and explore opportunities.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('GROW')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'GROW' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              Grow Network
            </button>
            <button
              onClick={() => setActiveTab('CONNECTIONS')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'CONNECTIONS' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              My Connections (482)
            </button>
          </div>
        </div>

        {/* Pending Connection Invitations */}
        {pendingRequests.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
                Pending Invitations ({pendingRequests.length})
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {pendingRequests.map((req) => (
                <div key={req.id} className="py-4 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={req.senderAvatar} alt={req.senderName} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{req.senderName}</h4>
                      <p className="text-xs text-slate-600">{req.senderTitle}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{req.mutualConnections} mutual connections · Received {req.createdAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRespondRequest(req.id, 'IGNORE')}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Ignore
                    </button>
                    <button
                      onClick={() => handleRespondRequest(req.id, 'ACCEPT')}
                      className="px-4 py-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Accept Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Suggestions Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">People You May Know in SF Bay Area</h3>
              <p className="text-xs text-slate-500">Based on your skills (Java 21, React, Spring Boot) and mutual connections</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates, companies..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Grid of Network Users */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredSuggested.map((person) => (
              <div key={person.id} className="bg-slate-50/70 rounded-2xl border border-slate-200 p-4 text-center space-y-3 hover:shadow-md transition flex flex-col justify-between group">
                <div className="space-y-2">
                  {/* Avatar & Connection Badge */}
                  <div className="relative inline-block mt-2">
                    <img src={person.avatar} alt={person.name} className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-white shadow-xs" />
                    <span className="absolute bottom-0 right-0 bg-slate-800 text-white text-[9px] font-black px-1.5 rounded-full border border-white">
                      {person.connectionLevel}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition">{person.name}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-snug">{person.headline}</p>
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" /> {person.company}
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {person.location}
                    </div>
                    <div className="font-semibold text-slate-500 pt-1">
                      {person.mutualConnections} mutual connections
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  {person.hasPendingRequest ? (
                    <span className="block text-xs font-bold text-slate-500 bg-slate-200 py-2 rounded-xl">
                      Pending Request
                    </span>
                  ) : (
                    <button
                      onClick={() => handleConnect(person.id)}
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
