import {
  Monitor, Wrench, GraduationCap, Languages, Utensils, Hotel,
  HeartPulse, Package, HardHat, Coins, Palette, Leaf,
  Factory, UserCheck, Coffee, Search, ArrowRight, type LucideProps,
} from "lucide-react";
import React, { useState } from "react";

type LucideIcon = React.ComponentType<LucideProps>;

const AREAS = [
  { slug: "ti-programacao", label: "TI & Programação", description: "Software, web, infraestrutura", icon: Monitor, iconBg: "bg-blue-100", iconColor: "text-blue-600", accentBorder: "border-l-blue-500", jobs: 5 },
  { slug: "fabricas", label: "Fábricas & Indústrias", description: "Linha de produção, operador, fábrica", icon: Factory, iconBg: "bg-slate-100", iconColor: "text-slate-600", accentBorder: "border-l-slate-500", jobs: 4 },
  { slug: "gastronomia", label: "Gastronomia", description: "Restaurante, chef, serviço", icon: Utensils, iconBg: "bg-rose-100", iconColor: "text-rose-600", accentBorder: "border-l-rose-500", jobs: 3 },
  { slug: "saude", label: "Saúde & Cuidados", description: "Enfermagem, cuidados, clínica", icon: HeartPulse, iconBg: "bg-pink-100", iconColor: "text-pink-600", accentBorder: "border-l-pink-500", jobs: 2 },
  { slug: "construcao", label: "Construção & Obras", description: "Operário, obra, arquitetura", icon: HardHat, iconBg: "bg-amber-100", iconColor: "text-amber-600", accentBorder: "border-l-amber-500", jobs: 2 },
  { slug: "logistica", label: "Logística & Estoque", description: "Armazém, transporte, delivery", icon: Package, iconBg: "bg-orange-100", iconColor: "text-orange-600", accentBorder: "border-l-orange-500", jobs: 1 },
  { slug: "educacao", label: "Ensino & Educação", description: "Professor, tutor, escola", icon: GraduationCap, iconBg: "bg-yellow-100", iconColor: "text-yellow-600", accentBorder: "border-l-yellow-500", jobs: 1 },
  { slug: "engenharia", label: "Engenharia", description: "Mecânica, elétrica, manufatura", icon: Wrench, iconBg: "bg-orange-100", iconColor: "text-orange-500", accentBorder: "border-l-orange-400", jobs: 1 },
  { slug: "hotelaria", label: "Hotelaria & Turismo", description: "Hotel, recepção, turismo", icon: Hotel, iconBg: "bg-teal-100", iconColor: "text-teal-600", accentBorder: "border-l-teal-500", jobs: 1 },
  { slug: "idiomas", label: "Idiomas & Tradução", description: "Intérprete, tradutor, localização", icon: Languages, iconBg: "bg-purple-100", iconColor: "text-purple-600", accentBorder: "border-l-purple-500", jobs: 0 },
  { slug: "financas", label: "Finanças & Contabilidade", description: "Banco, contábil, finanças", icon: Coins, iconBg: "bg-teal-100", iconColor: "text-teal-700", accentBorder: "border-l-teal-600", jobs: 0 },
  { slug: "design", label: "Design & Criativo", description: "UI/UX, gráfico, marketing", icon: Palette, iconBg: "bg-fuchsia-100", iconColor: "text-fuchsia-600", accentBorder: "border-l-fuchsia-500", jobs: 0 },
  { slug: "agricultura", label: "Agricultura & Campo", description: "Fazenda, colheita, rural", icon: Leaf, iconBg: "bg-green-100", iconColor: "text-green-600", accentBorder: "border-l-green-500", jobs: 0 },
  { slug: "autonomo", label: "Autônomo & Freelance", description: "Trabalho independente, PJ, freelance", icon: UserCheck, iconBg: "bg-indigo-100", iconColor: "text-indigo-600", accentBorder: "border-l-indigo-500", jobs: 0 },
  { slug: "arubaito", label: "Arubaito (Meio Período)", description: "Part-time, bicos, trabalho casual", icon: Coffee, iconBg: "bg-cyan-100", iconColor: "text-cyan-600", accentBorder: "border-l-cyan-500", jobs: 0 },
];

export function SearchExplorer() {
  const [query, setQuery] = useState("");

  const filtered = AREAS.filter(
    (a) =>
      a.label.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex items-start justify-center pt-0">
      <div className="w-full max-w-4xl mx-auto px-8 py-14">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Explore por Área</h2>
          <p className="text-gray-500">Pesquise ou escolha uma área para filtrar as vagas.</p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar área... (ex: engenharia, saúde)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-base text-gray-800 bg-gray-50 placeholder-gray-400 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full px-2 py-0.5 transition-colors"
            >
              limpar
            </button>
          )}
        </div>

        {/* Quick filters */}
        {!query && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {["Com vagas", "TI", "Saúde", "Fábricas"].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag === "Com vagas" ? "" : tag)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma área encontrada para "{query}"</p>
            </div>
          ) : (
            filtered.map((area, i) => {
              const Icon = area.icon as LucideIcon;
              return (
                <button
                  key={area.slug}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border border-l-4 ${area.accentBorder} border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-all cursor-pointer group text-left`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${area.iconBg}`}>
                    <Icon className={`w-5 h-5 ${area.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                      {area.label}
                    </p>
                    <p className="text-xs text-gray-400">{area.description}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {area.jobs > 0 ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-1">
                        {area.jobs} {area.jobs === 1 ? "vaga" : "vagas"}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">Sem vagas</span>
                    )}
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {!query && (
          <p className="text-center text-xs text-gray-400 mt-6">
            {filtered.filter((a) => a.jobs > 0).length} de {AREAS.length} áreas com vagas abertas
          </p>
        )}
        {query && filtered.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-4">
            {filtered.length} {filtered.length === 1 ? "área encontrada" : "áreas encontradas"}
          </p>
        )}
      </div>
    </div>
  );
}
