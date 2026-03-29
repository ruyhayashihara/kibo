import {
  Monitor, Wrench, GraduationCap, Languages, Utensils, Hotel,
  HeartPulse, Package, HardHat, Coins, Palette, Leaf,
  Factory, UserCheck, Coffee, type LucideProps,
} from "lucide-react";
import React from "react";

type LucideIcon = React.ComponentType<LucideProps>;

const AREAS = [
  { slug: "ti", label: "TI & Programação", description: "Software, web, infraestrutura", icon: Monitor, bg: "#dbeafe", iconBg: "#3b82f6", textColor: "#1e3a8a" },
  { slug: "eng", label: "Engenharia", description: "Mecânica, elétrica, manufatura", icon: Wrench, bg: "#ffedd5", iconBg: "#f97316", textColor: "#7c2d12" },
  { slug: "edu", label: "Ensino & Educação", description: "Professor, tutor, escola", icon: GraduationCap, bg: "#fef9c3", iconBg: "#eab308", textColor: "#713f12" },
  { slug: "idi", label: "Idiomas & Tradução", description: "Intérprete, tradutor, localização", icon: Languages, bg: "#ede9fe", iconBg: "#7c3aed", textColor: "#3b0764" },
  { slug: "gas", label: "Gastronomia", description: "Restaurante, chef, serviço", icon: Utensils, bg: "#fce7f3", iconBg: "#ec4899", textColor: "#831843" },
  { slug: "hot", label: "Hotelaria & Turismo", description: "Hotel, recepção, turismo", icon: Hotel, bg: "#ccfbf1", iconBg: "#14b8a6", textColor: "#134e4a" },
  { slug: "sau", label: "Saúde & Cuidados", description: "Enfermagem, cuidados, clínica", icon: HeartPulse, bg: "#ffe4e6", iconBg: "#f43f5e", textColor: "#881337" },
  { slug: "log", label: "Logística & Estoque", description: "Armazém, transporte, delivery", icon: Package, bg: "#fed7aa", iconBg: "#f97316", textColor: "#7c2d12" },
  { slug: "con", label: "Construção & Obras", description: "Operário, obra, arquitetura", icon: HardHat, bg: "#e2e8f0", iconBg: "#64748b", textColor: "#1e293b" },
  { slug: "fin", label: "Finanças & Contabilidade", description: "Banco, contábil, finanças", icon: Coins, bg: "#ccfbf1", iconBg: "#0d9488", textColor: "#134e4a" },
  { slug: "des", label: "Design & Criativo", description: "UI/UX, gráfico, marketing", icon: Palette, bg: "#fae8ff", iconBg: "#a855f7", textColor: "#581c87" },
  { slug: "agr", label: "Agricultura & Campo", description: "Fazenda, colheita, rural", icon: Leaf, bg: "#dcfce7", iconBg: "#22c55e", textColor: "#14532d" },
  { slug: "fab", label: "Fábricas & Indústrias", description: "Linha de produção, operador", icon: Factory, bg: "#f1f5f9", iconBg: "#94a3b8", textColor: "#334155" },
  { slug: "aut", label: "Autônomo & Freelance", description: "Trabalho independente, PJ", icon: UserCheck, bg: "#e0e7ff", iconBg: "#4f46e5", textColor: "#1e1b4b" },
  { slug: "aru", label: "Arubaito (Meio Período)", description: "Part-time, bicos, casual", icon: Coffee, bg: "#cffafe", iconBg: "#06b6d4", textColor: "#164e63" },
];

export function VibeVibrant() {
  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 1024, margin: "0 auto", padding: "56px 40px" }}>

        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 34, fontWeight: 900, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Explore por Área
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", margin: 0 }}>
            Encontre vagas nas principais áreas para estrangeiros no Japão.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {AREAS.map((area) => {
            const Icon = area.icon as LucideIcon;
            return (
              <button
                key={area.slug}
                style={{
                  background: area.bg,
                  border: "none",
                  borderRadius: 18,
                  padding: "18px 14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 11,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  boxShadow: "none",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: area.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon style={{ width: 20, height: 20, color: "#fff" }} />
                </div>
                <div>
                  <p style={{ fontSize: 12.5, fontWeight: 800, color: area.textColor, margin: "0 0 4px", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
                    {area.label}
                  </p>
                  <p style={{ fontSize: 11, color: area.textColor, margin: 0, lineHeight: 1.5, opacity: 0.6 }}>
                    {area.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
