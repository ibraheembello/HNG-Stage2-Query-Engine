import { motion } from 'framer-motion';
import { User, MapPin, Calendar, Percent } from 'lucide-react';
import type { Profile } from '../api';

interface Props {
  profile: Profile;
  index: number;
}

export default function ProfileCard({ profile, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass p-5 rounded-2xl group hover:border-indigo-500/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="bg-indigo-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
          <User className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Confidence
          </span>
          <div className="flex items-center gap-1 text-emerald-400 font-mono">
            <Percent className="w-3 h-3" />
            {(profile.gender_probability * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-4 glowing-text capitalize">
        {profile.name}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Age</span>
          </div>
          <p className="text-slate-200 font-semibold">{profile.age} ({profile.age_group})</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <MapPin className="w-4 h-4" />
            <span>Country</span>
          </div>
          <p className="text-slate-200 font-semibold">{profile.country_name} ({profile.country_id})</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
          profile.gender === 'male' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'
        }`}>
          {profile.gender}
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          {new Date(profile.created_at).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}
