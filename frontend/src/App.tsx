import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, Database } from 'lucide-react';
import { fetchProfiles } from './api';
import type { ProfileFilters } from './api';
import SearchSection from './components/SearchSection';
import Filters from './components/Filters';
import ProfileCard from './components/ProfileCard';

export default function App() {
  const [filters, setFilters] = useState<ProfileFilters>({
    page: 1,
    limit: 12,
    order: 'desc'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['profiles', filters],
    queryFn: () => fetchProfiles(filters),
  });

  const handleSearch = () => {
    setFilters({ ...filters, q: searchQuery, page: 1 });
  };

  const totalPages = data ? Math.ceil(data.total / (filters.limit || 12)) : 0;

  return (
    <div className="min-h-screen relative p-4 md:p-8 lg:p-12">
      <div className="parallax-bg" />
      
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-16 pt-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.5)]">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight glowing-text">
              Insighta<span className="text-indigo-500">Labs</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Intelligence Query Engine: Advanced demographic analysis through natural language and structured filters.
          </motion.p>
        </header>

        <SearchSection 
          query={searchQuery} 
          setQuery={setSearchQuery} 
          onSearch={handleSearch} 
        />

        <Filters filters={filters} setFilters={setFilters} />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
            <p className="font-bold uppercase tracking-widest text-sm">Analyzing Intelligence...</p>
          </div>
        ) : isError ? (
          <div className="glass p-12 rounded-3xl text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">Query Failure</h2>
            <p className="text-slate-500">The intelligence engine encountered an error. Please refine your query.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between text-slate-400 text-sm font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <span className="text-indigo-400">{data?.total}</span>
                <span>Profiles Identified</span>
              </div>
              <div>
                Page {filters.page} of {totalPages}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              <AnimatePresence mode="popLayout">
                {data?.data.map((profile, i) => (
                  <ProfileCard key={profile.id} profile={profile} index={i} />
                ))}
              </AnimatePresence>
            </div>

            {data && data.data.length === 0 && (
              <div className="glass p-20 rounded-3xl text-center">
                <p className="text-slate-500 text-lg">No profiles match the current intelligence criteria.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  disabled={filters.page === 1}
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                  className="p-3 glass rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex gap-2">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = filters.page! > 3 ? filters.page! - 3 + i + 1 : i + 1;
                    if (pageNum > totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setFilters({ ...filters, page: pageNum })}
                        className={`w-12 h-12 rounded-2xl font-bold transition-all ${
                          filters.page === pageNum 
                            ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
                            : 'glass hover:bg-white/10'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  disabled={filters.page === totalPages}
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                  className="p-3 glass rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        )}

        <footer className="mt-24 py-12 border-t border-white/5 text-center text-slate-500 text-xs uppercase tracking-[0.3em]">
          Powered by Insighta Labs Intelligent Engine &copy; 2026
        </footer>
      </main>
    </div>
  );
}
