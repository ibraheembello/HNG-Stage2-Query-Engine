import { Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
}

export default function SearchSection({ query, setQuery, onSearch }: Props) {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-2 flex items-center shadow-[0_0_30px_rgba(99,102,241,0.2)] focus-within:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all"
      >
        <div className="pl-4 text-indigo-400">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          placeholder="Ask in plain English (e.g., 'young males from nigeria')"
          className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 py-3 px-4 text-lg"
        />
        <button
          onClick={onSearch}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2"
        >
          <Search className="w-5 h-5" />
          Search
        </button>
      </motion.div>
      <div className="mt-3 flex gap-4 justify-center text-xs text-slate-500 uppercase tracking-widest font-bold">
        <span>Try: "females above 30"</span>
        <span>•</span>
        <span>"teenagers from kenya"</span>
      </div>
    </div>
  );
}
