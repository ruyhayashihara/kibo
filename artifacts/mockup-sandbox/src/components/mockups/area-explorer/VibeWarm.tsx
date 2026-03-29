import {
  Monitor, Wrench, GraduationCap, Languages, Utensils, Hotel,
  HeartPulse, Package, HardHat, Coins, Palette, Leaf,
  Factory, UserCheck, Coffee, type LucideProps,
} from "lucide-react";
import React from "react";

type LucideIcon = React.ComponentType<LucideProps>;

const AREAS = [
  { slug: "ti", label: "TI & Programação", description: "Software, web, infraestrutura", icon: Monitor, iconColor: "#c2410c", bg: "#fff7ed" },
  { slug: "eng", label: "Engenharia", description: "Mecânica, elétrica, manufatura", icon: Wrench, iconColor: "#b45309", bg: "#fffbeb" },
  { slug: "edu", label: "Ensino & Educação", description: "Professor, tutor, escola", icon: GraduationCap, iconColor: "#a16207", bg: "#fefce8" },
  { slug: "idi", label: "Idiomas & Tradução", description: "Intérprete, tradutor, localização", icon: Languages, iconColor: "#7c3aed", bg: "#faf5ff" },
  { slug: "gas", label: "Gastronomia", description: "Restaurante, chef, serviço", icon: Utensils, iconColor: "#be185d", bg: "#fdf2f8" },
  { slug: "hot", label: "Hotelaria & Turismo", description: "Hotel, recepção, turismo", icon: Hotel, iconColor: "#0f766e", bg: "#f0fdfa" },
  { slug: "sau", label: "Saúde & Cuidados", description: "Enfermagem, cuidados, clínica", icon: HeartPulse, iconColor: "#be123c", bg: "#fff1f2" },
  { slug: "log", label: "Logística & Estoque", description: "Armazém, transporte, delivery", icon: Package, iconColor: "#c2410c", bg: "#fff7ed" },
  { slug: "con", label: "Construção & Obras", description: "Operário, obra, arquitetura", icon: HardHat, iconColor: "#78716c", bg: "#fafaf9" },
  { slug: "fin", label: "Finanças & Contabilidade", description: "Banco, contábil, finanças", icon: Coins, iconColor: "#0f766e", bg: "#f0fdfa" },
  { slug: "des", label: "Design & Criativo", description: "UI/UX, gráfico, marketing", icon: Palette, iconColor: "#9333ea", bg: "#fdf4ff" },
  { slug: "agr", label: "Agricultura & Campo", description: "Fazenda, colheita, rural", icon: Leaf, iconColor: "#15803d", bg: "#f0fdf4" },
  { slug: "fab", label: "Fábricas & Indústrias", description: "Linha de produção, operador", icon: Factory, iconColor: "#57534e", bg: "#fafaf9" },
  { slug: "aut", label: "Autônomo & Freelance", description: "Trabalho independente, PJ", icon: UserCheck, iconColor: "#1d4ed8", bg: "#eff6ff" },
  { slug: "aru", label: "Arubaito (Meio Período)", description: "Part-time, bicos, casual", icon: Coffee, iconColor: "#0e7490", bg: "#ecfeff" },
];

export function VibeWarm() {
  return (
    <div style={{ background: "#fdf6ee", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 1024, margin: "0 auto", padding: "56px 40px" }}>

        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fed7aa", borderRadius: 999, padding: "4px 14px", marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#9a3412", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Explore por área
            </span>
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#292524", margin: "0 0 8px", fontFamily: "Georgia, serif", lineHeight: 1.2 }}>
            Onde você quer trabalhar?
          </h2>
          <p style={{ fontSize: 16, color: "#78716c", margin: 0, lineHeight: 1.6 }}>
            Encontre vagas nas principais áreas para estrangeiros no Japão.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
          {AREAS.map((area) => {
            const Icon = area.icon as LucideIcon;
            return (
              <button
                key={area.slug}
                style={{
                  background: "#fffdf8",
                  border: "1.5px solid #e7d8c5",
                  borderRadius: 20,
                  padding: "18px 14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 12,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "box-shadow 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(194,105,56,0.15)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)")}
              >
                <div style={{ width: 44, height: 44, borderRadius: 14, background: area.bg, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <Icon style={{ width: 20, height: 20, color: area.iconColor }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#292524", margin: "0 0 4px", lineHeight: 1.3, fontFamily: "Georgia, serif" }}>
                    {area.label}
                  </p>
                  <p style={{ fontSize: 11, color: "#a8a29e", margin: 0, lineHeight: 1.5 }}>
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
