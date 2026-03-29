import {
  Monitor, Wrench, GraduationCap, Languages, Utensils, Hotel,
  HeartPulse, Package, HardHat, Coins, Palette, Leaf,
  Factory, UserCheck, Coffee, ArrowRight, TrendingUp, type LucideProps,
} from "lucide-react";
import React from "react";

type LucideIcon = React.ComponentType<LucideProps>;

const AREAS = [
  { slug: "ti-programacao", label: "TI & Programação", description: "Software, web, infraestrutura", icon: Monitor, iconBg: "bg-blue-100", iconColor: "text-blue-600", jobs: 5 },
  { slug: "fabricas", label: "Fábricas & Indústrias", description: "Linha de produção, operador", icon: Factory, iconBg: "bg-gray-100", iconColor: "text-gray-600", jobs: 4 },
  { slug: "gastronomia", label: "Gastronomia", description: "Restaurante, chef, serviço", icon: Utensils, iconBg: "bg-rose-100", iconColor: "text-rose-600", jobs: 3 },
  { slug: "saude", label: "Saúde & Cuidados", description: "Enfermagem, clínica", icon: HeartPulse, iconBg: "bg-pink-100", iconColor: "text-pink-600", jobs: 2 },
  { slug: "construcao", label: "Construção & Obras", description: "Obra, arquitetura", icon: HardHat, iconBg: "bg-slate-100", iconColor: "text-slate-600", jobs: 2 },
  { slug: "logistica", label: "Logística & Estoque", description: "Armazém, delivery", icon: Package, iconBg: "bg-amber-100", iconColor: "text-amber-600", jobs: 1 },
  { slug: "educacao", label: "Ensino & Educação", description: "Professor, tutor", icon: GraduationCap, iconBg: "bg-yellow-100", iconColor: "text-yellow-600", jobs: 1 },
  { slug: "engenharia", label: "Engenharia", description: "Mecânica, elétrica", icon: Wrench, iconBg: "bg-orange-100", iconColor: "text-orange-600", jobs: 1 },
  { slug: "hotelaria", label: "Hotelaria & Turismo", description: "Hotel, recepção, turismo", icon: Hotel, iconBg: "bg-teal-100", iconColor: "text-teal-600", jobs: 1 },
  { slug: "idiomas", label: "Idiomas & Tradução", description: "Intérprete, tradutor", icon: Languages, iconBg: "bg-purple-100", iconColor: "text-purple-600", jobs: 0 },
  { slug: "financas", label: "Finanças & Contabilidade", description: "Banco, contábil", icon: Coins, iconBg: "bg-teal-100", iconColor: "text-teal-700", jobs: 0 },
  { slug: "design", label: "Design & Criativo", description: "UI/UX, marketing", icon: Palette, iconBg: "bg-fuchsia-100", iconColor: "text-fuchsia-600", jobs: 0 },
  { slug: "agricultura", label: "Agricultura & Campo", description: "Fazenda, colheita", icon: Leaf, iconBg: "bg-green-100", iconColor: "text-green-600", jobs: 0 },
  { slug: "autonomo", label: "Autônomo & Freelance", description: "PJ, freelance", icon: UserCheck, iconBg: "bg-indigo-100", iconColor: "text-indigo-600", jobs: 0 },
  { slug: "arubaito", label: "Arubaito (Meio Período)", description: "Part-time, bicos", icon: Coffee, iconBg: "bg-cyan-100", iconColor: "text-cyan-600", jobs: 0 },
];

const featured = AREAS[0];
const rest = AREAS.slice(1);

export function Spotlight() {
  const FeaturedIcon = featured.icon as LucideIcon;
  return (
    <div className="min-h-screen bg-slate-50 flex items-center">
      <div className="w-full max-w-6xl mx-auto px-8 py-14">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-1">Explore por Área</h2>
          <p className="text-slate-500">Encontre vagas nas principais áreas para estrangeiros no Japão.</p>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {/* Spotlight / featured card */}
          <div className="col-span-2 relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 flex flex-col justify-between text-white overflow-hidden cursor-pointer group">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white" />
              <div className="absolute -left-4 -bottom-4 w-32 h-32 rounded-full bg-white" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-4 h-4 text-blue-200" />
                <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Mais vagas</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <FeaturedIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{featured.label}</h3>
              <p className="text-blue-200 text-sm mb-6">{featured.description}</p>
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white text-blue-700 text-sm font-bold">
                {featured.jobs} vagas abertas
              </div>
            </div>
            <button className="relative z-10 mt-8 flex items-center gap-2 text-sm text-white/80 hover:text-white group-hover:gap-3 transition-all">
              Ver vagas <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Compact list of rest */}
          <div className="col-span-3 grid grid-cols-2 gap-3">
            {rest.map((area) => {
              const Icon = area.icon as LucideIcon;
              return (
                <button
                  key={area.slug}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer text-left group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${area.iconBg}`}>
                    <Icon className={`w-5 h-5 ${area.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                      {area.label}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{area.description}</p>
                  </div>
                  {area.jobs > 0 && (
                    <span className="ml-auto shrink-0 text-xs font-bold text-blue-600 bg-blue-50 rounded-full px-2 py-0.5">
                      {area.jobs}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
