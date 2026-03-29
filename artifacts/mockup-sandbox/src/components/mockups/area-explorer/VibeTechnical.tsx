import {
  Monitor, Wrench, GraduationCap, Languages, Utensils, Hotel,
  HeartPulse, Package, HardHat, Coins, Palette, Leaf,
  Factory, UserCheck, Coffee, type LucideProps,
} from "lucide-react";
import React from "react";

type LucideIcon = React.ComponentType<LucideProps>;

const AREAS = [
  { slug: "ti", label: "TI & Programação", description: "Software, web, infraestrutura", icon: Monitor, accent: "#22d3ee" },
  { slug: "eng", label: "Engenharia", description: "Mecânica, elétrica, manufatura", icon: Wrench, accent: "#22d3ee" },
  { slug: "edu", label: "Ensino & Educação", description: "Professor, tutor, escola", icon: GraduationCap, accent: "#22d3ee" },
  { slug: "idi", label: "Idiomas & Tradução", description: "Intérprete, tradutor, localização", icon: Languages, accent: "#22d3ee" },
  { slug: "gas", label: "Gastronomia", description: "Restaurante, chef, serviço", icon: Utensils, accent: "#22d3ee" },
  { slug: "hot", label: "Hotelaria & Turismo", description: "Hotel, recepção, turismo", icon: Hotel, accent: "#22d3ee" },
  { slug: "sau", label: "Saúde & Cuidados", description: "Enfermagem, cuidados, clínica", icon: HeartPulse, accent: "#22d3ee" },
  { slug: "log", label: "Logística & Estoque", description: "Armazém, transporte, delivery", icon: Package, accent: "#22d3ee" },
  { slug: "con", label: "Construção & Obras", description: "Operário, obra, arquitetura", icon: HardHat, accent: "#22d3ee" },
  { slug: "fin", label: "Finanças & Contabilidade", description: "Banco, contábil, finanças", icon: Coins, accent: "#22d3ee" },
  { slug: "des", label: "Design & Criativo", description: "UI/UX, gráfico, marketing", icon: Palette, accent: "#22d3ee" },
  { slug: "agr", label: "Agricultura & Campo", description: "Fazenda, colheita, rural", icon: Leaf, accent: "#22d3ee" },
  { slug: "fab", label: "Fábricas & Indústrias", description: "Linha de produção, operador", icon: Factory, accent: "#22d3ee" },
  { slug: "aut", label: "Autônomo & Freelance", description: "Trabalho independente, PJ", icon: UserCheck, accent: "#22d3ee" },
  { slug: "aru", label: "Arubaito (Meio Período)", description: "Part-time, bicos, casual", icon: Coffee, accent: "#22d3ee" },
];

export function VibeTechnical() {
  return (
    <div style={{ background: "#09090b", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 1024, margin: "0 auto", padding: "56px 40px" }}>

        <div style={{ marginBottom: 36, borderBottom: "1px solid #27272a", paddingBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontSize: 11, fontFamily: "monospace", color: "#22d3ee", letterSpacing: "0.12em" }}>
              /explore
            </span>
            <span style={{ fontSize: 11, fontFamily: "monospace", color: "#52525b" }}>
              — 15 categorias · 12 vagas
            </span>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 600, color: "#fafafa", margin: "10px 0 6px", letterSpacing: "-0.02em", fontFamily: "system-ui, sans-serif" }}>
            Explore por Área
          </h2>
          <p style={{ fontSize: 13, color: "#52525b", margin: 0, fontFamily: "monospace" }}>
            Selecione uma categoria para filtrar vagas disponíveis.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {AREAS.map((area, i) => {
            const Icon = area.icon as LucideIcon;
            return (
              <button
                key={area.slug}
                style={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: 8,
                  padding: "14px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 10,
                  cursor: "pointer",
                  textAlign: "left",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#22d3ee33";
                  e.currentTarget.style.background = "#111827";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#27272a";
                  e.currentTarget.style.background = "#18181b";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: "#27272a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon style={{ width: 15, height: 15, color: "#22d3ee" }} />
                  </div>
                  <span style={{ fontSize: 10, fontFamily: "monospace", color: "#3f3f46" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#e4e4e7", margin: "0 0 3px", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
                    {area.label}
                  </p>
                  <p style={{ fontSize: 10, color: "#3f3f46", margin: 0, lineHeight: 1.5, fontFamily: "monospace" }}>
                    {area.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 20, display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ height: 1, flex: 1, background: "#27272a" }} />
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "#3f3f46" }}>
            kibojobs.com · japan jobs for foreigners
          </span>
          <div style={{ height: 1, flex: 1, background: "#27272a" }} />
        </div>
      </div>
    </div>
  );
}
