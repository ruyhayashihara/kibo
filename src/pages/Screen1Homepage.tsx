import React from 'react';
import { Search, MapPin, Briefcase, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  JobCard, CompanyCard, FilterGroup, LanguageSwitcher,
  AdSlot, ProfileProgress
} from '../components/Library';

export default function Screen1Homepage() {
  return (
    <div className="min-h-screen bg-[#080b1a] font-sans text-slate-300 selection:bg-pink-500/30">
      {/* Header */}
      <header className="bg-[#0c1222]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Stitch<span className="text-blue-500">Jobs</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-medium text-slate-400">
            <Link to="/vagas" className="text-blue-400 hover:text-white transition-colors">Vagas</Link>
            <Link to="/empresas" className="hover:text-white transition-colors">Empresas</Link>
            <Link to="/salarios" className="hover:text-white transition-colors">Salários</Link>
          </nav>
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <button className="hidden md:block px-6 py-2.5 bg-white/5 hover:bg-blue-600 text-white border border-white/10 hover:border-blue-500 rounded-xl font-bold transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]">
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Search */}
      <section className="relative py-24 px-4 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[url('https://s2-techtudo.glbimg.com/Zs4T1iF4hfsETxYBeV3emauxCs4=/0x0:1300x733/1000x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2026/G/i/OyOBEgSyq3q0sNU8QBaA/stitch-keyword-hero-visual.width-1300.png')] opacity-[0.03] bg-cover bg-center mix-blend-screen" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Mais de 2.500 vagas abertas hoje
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            Encontre o emprego dos <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500">seus sonhos</span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Milhares de vagas nas melhores empresas de tecnologia.
          </p>

          <div className="bg-[#0c1222]/80 backdrop-blur-xl p-3 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center px-5 bg-[#080b1a] rounded-2xl border border-white/5 focus-within:border-blue-500/50 transition-colors group">
              <Search className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Cargo, palavra-chave ou empresa"
                className="w-full bg-transparent border-none focus:ring-0 px-4 py-4 text-white placeholder-slate-500 outline-none"
              />
            </div>
            <div className="flex-1 flex items-center px-5 bg-[#080b1a] rounded-2xl border border-white/5 focus-within:border-blue-500/50 transition-colors group">
              <MapPin className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Cidade, estado ou remoto"
                className="w-full bg-transparent border-none focus:ring-0 px-4 py-4 text-white placeholder-slate-500 outline-none"
              />
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-pink-500 hover:from-blue-500 hover:to-pink-400 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40">
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 flex flex-col gap-8">
          <ProfileProgress percentage={65} />

          <div className="bg-[#0c1222] rounded-2xl p-8 border border-white/10 shadow-xl">
            <FilterGroup
              title="Modalidade"
              options={['Remoto', 'Híbrido', 'Presencial']}
            />
            <FilterGroup
              title="Tipo de Contrato"
              options={['CLT', 'PJ', 'Freelance', 'Estágio']}
            />
            <FilterGroup
              title="Nível de Experiência"
              options={['Júnior', 'Pleno', 'Sênior', 'Especialista']}
            />
          </div>

          {/* AD SLOT: sidebar_left */}
          <AdSlot type="square" name="sidebar_left" />
        </aside>

        {/* Feed */}
        <div className="w-full lg:w-3/4 flex flex-col gap-8">
          {/* AD SLOT: leaderboard_top */}
          <AdSlot type="leaderboard" name="leaderboard_top" />

          <div className="flex items-end justify-between mt-4 mb-2">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Vagas Recomendadas</h2>
              <p className="text-slate-400">Exibindo 243 vagas baseadas no seu perfil</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {/* Sponsored Jobs */}
            <JobCard
              title="Desenvolvedor Frontend Sênior (React)"
              company="TechCorp Brasil"
              location="São Paulo, SP"
              workMode="Híbrido"
              jobType="CLT"
              isSponsored={true}
              logoUrl="https://placehold.co/100x100/3b82f6/ffffff?text=TC"
            />
            <JobCard
              title="Engenheiro de Software Backend"
              company="InnovaTech"
              location="Remoto"
              workMode="Remoto"
              jobType="PJ"
              isSponsored={true}
              logoUrl="https://placehold.co/100x100/ec4899/ffffff?text=IN"
            />

            {/* AD SLOT: native_feed_1 */}
            <AdSlot type="native" name="native_feed_1" />

            {/* Regular Jobs */}
            <JobCard
              title="UX/UI Designer Pleno"
              company="Creative Studio"
              location="Rio de Janeiro, RJ"
              workMode="Presencial"
              jobType="CLT"
              logoUrl="https://placehold.co/100x100/8b5cf6/ffffff?text=CS"
            />
            <JobCard
              title="Desenvolvedor Mobile (Flutter)"
              company="AppMakers"
              location="Remoto"
              workMode="Remoto"
              jobType="Freelance"
              logoUrl="https://placehold.co/100x100/10b981/ffffff?text=AM"
            />
            <JobCard
              title="Estágio em Análise de Dados"
              company="DataSmart"
              location="Curitiba, PR"
              workMode="Híbrido"
              jobType="Estágio"
              logoUrl="https://placehold.co/100x100/f59e0b/ffffff?text=DS"
            />
          </div>

          <button className="w-full py-4 bg-[#0c1222] hover:bg-[#131b2f] border border-white/10 text-blue-400 rounded-2xl font-bold transition-colors mt-4 flex items-center justify-center gap-2 group">
            Carregar mais vagas
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Top Companies Section */}
          <div className="mt-12 mb-8">
            <h2 className="text-3xl font-bold text-white mb-8">Empresas em Destaque</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <CompanyCard name="TechCorp Brasil" openJobs={12} logoUrl="https://placehold.co/100x100/3b82f6/ffffff?text=TC" />
              <CompanyCard name="InnovaTech" openJobs={8} logoUrl="https://placehold.co/100x100/ec4899/ffffff?text=IN" />
              <CompanyCard name="Creative Studio" openJobs={3} logoUrl="https://placehold.co/100x100/8b5cf6/ffffff?text=CS" />
              <CompanyCard name="DataSmart" openJobs={5} logoUrl="https://placehold.co/100x100/f59e0b/ffffff?text=DS" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
