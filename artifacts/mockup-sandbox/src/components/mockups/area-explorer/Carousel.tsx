import {
  Monitor, Wrench, GraduationCap, Languages, Utensils, Hotel,
  HeartPulse, Package, HardHat, Coins, Palette, Leaf,
  Factory, UserCheck, Coffee, ChevronLeft, ChevronRight, type LucideProps,
} from "lucide-react";
import React, { useState, useRef } from "react";

type LucideIcon = React.ComponentType<LucideProps>;

const AREAS = [
  { slug: "ti-programacao", label: "TI & Programação", description: "Software, web, infraestrutura", icon: Monitor, bg: "from-blue-500 to-blue-700", badge: "bg-blue-400/30 text-white", jobs: 5, emoji: "💻" },
  { slug: "fabricas", label: "Fábricas & Indústrias", description: "Linha de produção, operador, fábrica", icon: Factory, bg: "from-slate-500 to-slate-700", badge: "bg-slate-400/30 text-white", jobs: 4, emoji: "🏭" },
  { slug: "gastronomia", label: "Gastronomia", description: "Restaurante, chef, serviço", icon: Utensils, bg: "from-rose-500 to-rose-700", badge: "bg-rose-400/30 text-white", jobs: 3, emoji: "🍜" },
  { slug: "saude", label: "Saúde & Cuidados", description: "Enfermagem, cuidados, clínica", icon: HeartPulse, bg: "from-pink-500 to-pink-700", badge: "bg-pink-400/30 text-white", jobs: 2, emoji: "🏥" },
  { slug: "construcao", label: "Construção & Obras", description: "Operário, obra, arquitetura", icon: HardHat, bg: "from-amber-500 to-amber-700", badge: "bg-amber-400/30 text-white", jobs: 2, emoji: "🏗️" },
  { slug: "logistica", label: "Logística & Estoque", description: "Armazém, transporte, delivery", icon: Package, bg: "from-orange-500 to-orange-700", badge: "bg-orange-400/30 text-white", jobs: 1, emoji: "🚛" },
  { slug: "educacao", label: "Ensino & Educação", description: "Professor, tutor, escola", icon: GraduationCap, bg: "from-yellow-500 to-yellow-600", badge: "bg-yellow-400/30 text-white", jobs: 1, emoji: "📚" },
  { slug: "hotelaria", label: "Hotelaria & Turismo", description: "Hotel, recepção, turismo", icon: Hotel, bg: "from-teal-500 to-teal-700", badge: "bg-teal-400/30 text-white", jobs: 1, emoji: "🏨" },
  { slug: "engenharia", label: "Engenharia", description: "Mecânica, elétrica, manufatura", icon: Wrench, bg: "from-orange-400 to-orange-600", badge: "bg-orange-300/30 text-white", jobs: 1, emoji: "🔧" },
  { slug: "idiomas", label: "Idiomas & Tradução", description: "Intérprete, tradutor, localização", icon: Languages, bg: "from-purple-500 to-purple-700", badge: "bg-purple-400/30 text-white", jobs: 0, emoji: "🌐" },
  { slug: "financas", label: "Finanças & Contabilidade", description: "Banco, contábil, finanças", icon: Coins, bg: "from-emerald-500 to-emerald-700", badge: "bg-emerald-400/30 text-white", jobs: 0, emoji: "💰" },
  { slug: "design", label: "Design & Criativo", description: "UI/UX, gráfico, marketing", icon: Palette, bg: "from-fuchsia-500 to-fuchsia-700", badge: "bg-fuchsia-400/30 text-white", jobs: 0, emoji: "🎨" },
  { slug: "agricultura", label: "Agricultura & Campo", description: "Fazenda, colheita, rural", icon: Leaf, bg: "from-green-500 to-green-700", badge: "bg-green-400/30 text-white", jobs: 0, emoji: "🌿" },
  { slug: "autonomo", label: "Autônomo & Freelance", description: "Trabalho independente, PJ", icon: UserCheck, bg: "from-indigo-500 to-indigo-700", badge: "bg-indigo-400/30 text-white", jobs: 0, emoji: "🧑‍💼" },
  { slug: "arubaito", label: "Arubaito (Meio Período)", description: "Part-time, bicos, trabalho casual", icon: Coffee, bg: "from-cyan-500 to-cyan-700", badge: "bg-cyan-400/30 text-white", jobs: 0, emoji: "☕" },
];

const CARD_W = 220;
const GAP = 16;

export function Carousel() {
  const [offset, setOffset] = useState(0);
  const maxOffset = (AREAS.length - 4) * (CARD_W + GAP);

  const prev = () => setOffset(Math.max(0, offset - (CARD_W + GAP) * 3));
  const next = () => setOffset(Math.min(maxOffset, offset + (CARD_W + GAP) * 3));

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center">
      <div className="w-full py-14">
        <div className="max-w-6xl mx-auto px-8 mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Explore por Área</h2>
            <p className="text-neutral-400">Deslize para descobrir oportunidades em cada setor.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={offset === 0}
              className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white hover:bg-neutral-700 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={offset >= maxOffset}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-neutral-900 hover:bg-neutral-100 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="pl-8 overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${offset}px)` }}
          >
            {AREAS.map((area) => {
              const Icon = area.icon as LucideIcon;
              return (
                <button
                  key={area.slug}
                  className={`shrink-0 w-[220px] h-[300px] rounded-3xl bg-gradient-to-b ${area.bg} p-6 flex flex-col justify-between cursor-pointer group hover:scale-[1.02] hover:brightness-110 transition-all duration-200`}
                  style={{ width: CARD_W }}
                >
                  <div>
                    <span className="text-4xl block mb-4">{area.emoji}</span>
                    <h3 className="text-white font-bold text-base leading-snug">{area.label}</h3>
                    <p className="text-white/60 text-xs mt-1 leading-relaxed">{area.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    {area.jobs > 0 ? (
                      <span className={`text-xs font-semibold rounded-full px-3 py-1 ${area.badge}`}>
                        {area.jobs} {area.jobs === 1 ? "vaga" : "vagas"}
                      </span>
                    ) : (
                      <span className="text-white/30 text-xs">Em breve</span>
                    )}
                    <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
