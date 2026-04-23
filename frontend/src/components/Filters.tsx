import { Filter, SortAsc, SortDesc } from 'lucide-react';
import type { ProfileFilters } from '../api';

interface Props {
  filters: ProfileFilters;
  setFilters: (f: ProfileFilters) => void;
}

export default function Filters({ filters, setFilters }: Props) {
  const updateFilter = (key: keyof ProfileFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 12 });
  };

  return (
    <div className="glass rounded-3xl p-6 mb-8 flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2 text-indigo-400">
        <Filter className="w-5 h-5" />
        <span className="font-bold uppercase tracking-wider text-sm">Filters</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 flex-1">
        <select
          value={filters.gender || ''}
          onChange={(e) => updateFilter('gender', e.target.value || undefined)}
          className="bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select
          value={filters.age_group || ''}
          onChange={(e) => updateFilter('age_group', e.target.value || undefined)}
          className="bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">All Ages</option>
          <option value="child">Child</option>
          <option value="teenager">Teenager</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
        </select>

        <select
          value={filters.sort_by || 'created_at'}
          onChange={(e) => updateFilter('sort_by', e.target.value)}
          className="bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="created_at">Sort by Date</option>
          <option value="age">Sort by Age</option>
          <option value="gender_probability">Sort by Confidence</option>
        </select>

        <button
          onClick={() => updateFilter('order', filters.order === 'asc' ? 'desc' : 'asc')}
          className="p-2 bg-slate-800/50 rounded-xl border border-white/10 hover:bg-slate-700 transition-all"
        >
          {filters.order === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
        </button>

        <button
          onClick={clearFilters}
          className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
