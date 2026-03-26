import React, { useState } from 'react';
import { Bookmark, MapPin, Building, Globe, ChevronDown, Check } from 'lucide-react';

// 6. Work mode badge (Remoto = green, Híbrido = blue, Presencial = gray)
export const WorkModeBadge = ({ mode }: { mode: 'Remoto' | 'Híbrido' | 'Presencial' | string }) => {
  const colors: Record<string, string> = {
    Remoto: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    Híbrido: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    Presencial: 'bg-slate-500/10 text-muted-foreground border-slate-500/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[mode] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
      {/* DATA: supabase.jobs.work_mode */}
      {mode}
    </span>
  );
};

// 7. Job type badge (CLT = blue, PJ = purple, Freelance = orange, Estágio = teal)
export const JobTypeBadge = ({ type }: { type: 'CLT' | 'PJ' | 'Freelance' | 'Estágio' | string }) => {
  const colors: Record<string, string> = {
    CLT: 'bg-primary/10 text-primary border-primary/20',
    PJ: 'bg-accent/10 text-accent border-accent/20',
    Freelance: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    Estágio: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[type] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
      {/* DATA: supabase.jobs.job_type */}
      {type}
    </span>
  );
};

// 9. Sponsored job badge
export const SponsoredBadge = () => (
  <span className="px-3 py-1 rounded-none text-xs font-bold bg-primary text-primary-foreground shadow-sm flex items-center gap-1.5">
    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
    {/* i18n: job.sponsored */}
    Patrocinado
  </span>
);

// 5. Bookmark button (saved / unsaved states)
export const BookmarkButton = ({ initialSaved = false }: { initialSaved?: boolean }) => {
  const [saved, setSaved] = useState(initialSaved);
  return (
    <button
      onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
      className={`p-2.5 rounded-full transition-all duration-300 ${
        saved 
          ? 'bg-accent/20 text-accent hover:bg-accent/30' 
          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
      }`}
      aria-label="Salvar vaga"
    >
      <Bookmark className="w-5 h-5" fill={saved ? "currentColor" : "none"} />
    </button>
  );
};

// 1. Job card (default + featured/sponsored variant)
interface JobCardProps {
  title: string;
  company: string;
  location: string;
  workMode: string;
  jobType: string;
  isSponsored?: boolean;
  logoUrl?: string;
}

export const JobCard = ({
  title, company, location, workMode, jobType, isSponsored = false, logoUrl
}: JobCardProps) => {
  return (
    <div className={`relative bg-[#0c1222] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 border ${
      isSponsored 
        ? 'border-accent/50 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]' 
        : 'border-white/10 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]'
    }`}>
      {isSponsored && (
        <div className="absolute -top-3 left-6">
          <SponsoredBadge />
        </div>
      )}
      <div className="flex items-start gap-5">
        <div className="w-16 h-16 rounded-xl bg-white/5 p-2 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
          <img src={logoUrl || "https://placehold.co/64x64/1e293b/94a3b8?text=Logo"} alt={company} className="w-full h-full object-contain rounded-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-lg font-bold text-white truncate group-hover:text-primary transition-colors">
                {/* DATA: supabase.jobs.title */}
                {title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mt-2">
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4" />
                  {/* DATA: supabase.companies.name */}
                  <span className="truncate max-w-[150px]">{company}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {/* DATA: supabase.jobs.location */}
                  <span className="truncate max-w-[150px]">{location}</span>
                </div>
              </div>
            </div>
            <BookmarkButton />
          </div>
          <div className="flex flex-wrap gap-2 mt-5">
            <WorkModeBadge mode={workMode} />
            <JobTypeBadge type={jobType} />
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Company logo card
interface CompanyCardProps {
  name: string;
  openJobs: number;
  logoUrl?: string;
}

export const CompanyCard = ({ name, openJobs, logoUrl }: CompanyCardProps) => (
  <div className="bg-[#0c1222] rounded-2xl p-6 border border-white/10 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)] transition-all duration-300 text-center group cursor-pointer">
    <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 p-3 border border-white/10 mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
      <img src={logoUrl || "https://placehold.co/80x80/1e293b/94a3b8?text=Logo"} alt={name} className="w-full h-full object-contain rounded-xl" />
    </div>
    <h4 className="font-bold text-white truncate">{name}</h4>
    <p className="text-sm text-primary mt-1.5 font-medium">{openJobs} vagas abertas</p>
  </div>
);

// 3. Filter checkbox group
export const FilterGroup = ({ title, options }: { title: string, options: string[] }) => (
  <div className="mb-8">
    <h4 className="font-bold text-white mb-4 text-lg">{title}</h4>
    <div className="space-y-3">
      {options.map((opt, i) => (
        <label key={i} className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center w-5 h-5 border-2 border-slate-600 rounded-md group-hover:border-primary transition-colors">
            <input type="checkbox" className="peer sr-only" />
            <div className="absolute inset-0 bg-primary rounded-sm scale-0 peer-checked:scale-100 transition-transform duration-200 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
          </div>
          <span className="text-slate-300 group-hover:text-white transition-colors">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

// 4. Language switcher dropdown
export const LanguageSwitcher = () => (
  <div className="relative group">
    <button className="flex items-center gap-2 text-slate-300 hover:text-white font-medium transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10">
      <Globe className="w-4 h-4 text-primary" />
      {/* i18n: nav.language */}
      <span>PT-BR</span>
      <ChevronDown className="w-4 h-4 opacity-50" />
    </button>
    <div className="absolute right-0 mt-2 w-40 bg-[#0c1222] rounded-xl shadow-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden">
      <div className="py-1">
        <button className="w-full text-left px-4 py-2.5 text-sm text-primary bg-primary/10 font-medium">Português (BR)</button>
        <button className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">English</button>
        <button className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">日本語</button>
      </div>
    </div>
  </div>
);

// 8. Ad slot placeholder (leaderboard, sidebar, native, square)
export const AdSlot = ({ type, name }: { type: 'leaderboard' | 'sidebar' | 'native' | 'square', name: string }) => {
  const dimensions = {
    leaderboard: 'w-full h-[90px]',
    sidebar: 'w-full h-[600px]',
    native: 'w-full h-[120px]',
    square: 'w-full aspect-square',
  };
  return (
    <div className={`${dimensions[type]} bg-muted/50 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground p-4 text-center relative overflow-hidden group hover:border-primary/30 transition-colors`}>
      {/* AD SLOT: ${name} */}
      <span className="text-[10px] font-bold tracking-widest uppercase mb-1.5 text-slate-600">Publicidade</span>
      <span className="text-sm font-medium text-slate-400">{type}</span>
      <span className="text-xs text-slate-500 mt-1 font-mono">{name}</span>
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

// 10. Profile completion progress card
export const ProfileProgress = ({ percentage }: { percentage: number }) => (
  <div className="bg-card rounded-none p-6 border border-border shadow-sm relative overflow-hidden group">
    {/* Decorative Stitch-inspired blobs */}
    <div className="absolute -right-12 -top-12 w-32 h-32 bg-accent/20 rounded-full blur-2xl group-hover:bg-accent/30 transition-colors duration-500" />
    <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors duration-500" />

    <div className="relative z-10">
      <h3 className="font-bold text-lg text-white mb-1">Complete seu perfil</h3>
      <p className="text-slate-400 text-sm mb-5">Perfis completos recebem 3x mais visualizações de recrutadores.</p>

      <div className="flex justify-between items-end mb-3">
        <span className="text-4xl font-black text-primary">
          {/* DATA: supabase.profiles.completion_percentage */}
          {percentage}%
        </span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Concluído</span>
      </div>

      <div className="w-full bg-slate-800/50 rounded-full h-3 mb-5 overflow-hidden border border-white/5">
        <div
          className="bg-primary h-full rounded-none relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] -skew-x-12" />
        </div>
      </div>

      <button className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg shadow-primary/20">
        Atualizar Perfil
      </button>
    </div>
  </div>
);
