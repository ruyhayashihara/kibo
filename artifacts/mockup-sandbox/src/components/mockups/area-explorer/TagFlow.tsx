import {
  Monitor, Wrench, GraduationCap, Languages, Utensils, Hotel,
  HeartPulse, Package, HardHat, Coins, Palette, Leaf,
  Factory, UserCheck, Coffee, ChevronRight, type LucideProps,
} from "lucide-react";
import React from "react";

type LucideIcon = React.ComponentType<LucideProps>;

const AREAS = [
  { slug: "ti-programacao", label: "TI & Programação", description: "Software, web, infraestrutura", icon: Monitor, color: "bg-blue-100 text-blue-600", ring: "hover:ring-blue-400/50" },
  { slug: "engenharia", label: "Engenharia", description: "Mecânica, elétrica", icon: Wrench, color: "bg-orange-100 text-orange-600", ring: "hover:ring-orange-400/50" },
  { slug: "educacao", label: "Ensino & Educação", description: "Professor, tutor, escola", icon: GraduationCap, color: "bg-yellow-100 text-yellow-600", ring: "hover:ring-yellow-400/50" },
  { slug: "idiomas", label: "Idiomas & Tradução", description: "Intérprete, tradutor", icon: Languages, color: "bg-purple-100 text-purple-600", ring: "hover:ring-purple-400/50" },
  { slug: "gastronomia", label: "Gastronomia", description: "Restaurante, chef", icon: Utensils, color: "bg-rose-100 text-rose-600", ring: "hover:ring-rose-400/50" },
  { slug: "hotelaria", label: "Hotelaria & Turismo", description: "Hotel, recepção", icon: Hotel, color: "bg-teal-100 text-teal-600", ring: "hover:ring-teal-400/50" },
  { slug: "saude", label: "Saúde & Cuidados", description: "Enfermagem, clínica", icon: HeartPulse, color: "bg-pink-100 text-pink-600", ring: "hover:ring-pink-400/50" },
  { slug: "logistica", label: "Logística & Estoque", description: "Armazém, delivery", icon: Package, color: "bg-amber-100 text-amber-600", ring: "hover:ring-amber-400/50" },
  { slug: "construcao", label: "Construção & Obras", description: "Obra, arquitetura", icon: HardHat, color: "bg-slate-100 text-slate-600", ring: "hover:ring-slate-400/50" },
  { slug: "financas", label: "Finanças & Contabilidade", description: "Banco, contábil", icon: Coins, color: "bg-teal-100 text-teal-700", ring: "hover:ring-teal-400/50" },
  { slug: "design", label: "Design & Criativo", description: "UI/UX, marketing", icon: Palette, color: "bg-fuchsia-100 text-fuchsia-600", ring: "hover:ring-fuchsia-400/50" },
  { slug: "agricultura", label: "Agricultura & Campo", description: "Fazenda, colheita", icon: Leaf, color: "bg-green-100 text-green-600", ring: "hover:ring-green-400/50" },
  { slug: "fabricas", label: "Fábricas & Indústrias", description: "Linha de produção", icon: Factory, color: "bg-gray-100 text-gray-600", ring: "hover:ring-gray-400/50" },
  { slug: "autonomo", label: "Autônomo & Freelance", description: "PJ, independente", icon: UserCheck, color: "bg-indigo-100 text-indigo-600", ring: "hover:ring-indigo-400/50" },
  { slug: "arubaito", label: "Arubaito (Meio Período)", description: "Part-time, bicos", icon: Coffee, color: "bg-cyan-100 text-cyan-600", ring: "hover:ring-cyan-400/50" },
];

function AreaPill({ area }: { area: typeof AREAS[0] }) {
  const Icon = area.icon as LucideIcon;
  return (
    <button
      className={`group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-transparent bg-white shadow-sm hover:shadow-md ring-2 ring-transparent ${area.ring} transition-all duration-200 cursor-pointer`}
    >
      <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${area.color} bg-opacity-80`}>
        <Icon className="w-3.5 h-3.5" />
      </span>
      <span className="text-sm font-medium text-gray-800 leading-none whitespace-nowrap">{area.label}</span>
    </button>
  );
}

export function TagFlow() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <div className="w-full max-w-5xl mx-auto px-8 py-16">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Explorar por área</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">O que você está buscando?</h2>
          <p className="text-gray-500 text-lg">Toque em uma área para ver as vagas disponíveis.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {AREAS.map((area) => (
            <AreaPill key={area.slug} area={area} />
          ))}
        </div>

        <div className="mt-10 flex items-center gap-2 text-sm text-gray-400">
          <span>12 vagas disponíveis</span>
          <span>·</span>
          <button className="text-blue-500 font-medium hover:underline inline-flex items-center gap-1">
            Ver todas as áreas <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
