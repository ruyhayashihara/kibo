export const JAPAN_PROVINCES = [
  "Hokkaido", "Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima",
  "Ibaraki", "Tochigi", "Gunma", "Saitama", "Chiba", "Tóquio (Tokyo)", "Kanagawa",
  "Niigata", "Toyama", "Ishikawa", "Fukui", "Yamanashi", "Nagano",
  "Gifu", "Shizuoka", "Aichi", "Mie",
  "Shiga", "Kyoto", "Osaka", "Hyogo", "Nara", "Wakayama",
  "Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi",
  "Tokushima", "Kagawa", "Ehime", "Kochi",
  "Fukuoka", "Saga", "Nagasaki", "Kumamoto", "Oita", "Miyazaki", "Kagoshima",
  "Okinawa",
]

export const JLPT_LEVELS = [
  { value: "N1", label: "N1 – Avançado" },
  { value: "N2", label: "N2 – Intermediário-Avançado" },
  { value: "N3", label: "N3 – Intermediário" },
  { value: "N4", label: "N4 – Básico-Intermediário" },
  { value: "N5", label: "N5 – Básico" },
  { value: "Nenhum", label: "Nenhum / Em estudo" },
]

export const VISA_TYPES = [
  { value: "永住者", label: "Residente Permanente (永住者)" },
  { value: "日本人配偶者等", label: "Cônjuge/Filho(a) de Japonês(a) (日本人の配偶者等)" },
  { value: "永住者配偶者等", label: "Cônjuge/Filho(a) de Residente Permanente (永住者の配偶者等)" },
  { value: "定住者", label: "Residente de Longa Duração / Nikkei (定住者)" },
  { value: "技術人文国際", label: "Engenheiro / Humanidades / Serviços Internacionais (技術・人文知識・国際業務)" },
  { value: "技能", label: "Trabalhador com Habilidade Técnica (技能)" },
  { value: "特定技能1号", label: "Qualificado Específico Tipo 1 (特定技能1号)" },
  { value: "特定技能2号", label: "Qualificado Específico Tipo 2 (特定技能2号)" },
  { value: "高度専門職", label: "Profissional Altamente Qualificado (高度専門職)" },
  { value: "技能実習", label: "Estágio Técnico / Trainee (技能実習)" },
  { value: "企業内転勤", label: "Transferência Intraempresarial (企業内転勤)" },
  { value: "経営管理", label: "Gestor / Empresário (経営・管理)" },
  { value: "特定活動", label: "Working Holiday / Atividade Designada (特定活動)" },
  { value: "留学資格外", label: "Estudante com permissão de trabalho (留学 + 資格外活動)" },
  { value: "outros", label: "Outros (especificar abaixo)" },
]

export const RELOCATION_OPTIONS = [
  { value: "same_province", label: "Sim, apenas na mesma província" },
  { value: "any_province", label: "Sim, posso mudar para outras províncias" },
  { value: "no", label: "Não" },
]

export const CALL_TIME_OPTIONS = [
  { value: "manha", label: "Manhã (08h ~ 12h)" },
  { value: "tarde", label: "Tarde (12h ~ 18h)" },
  { value: "noite", label: "Noite (18h ~ 21h)" },
  { value: "qualquer", label: "Qualquer horário" },
]

export const REQUIRED_PROFILE_FIELDS: (keyof CandidateProfileFull)[] = [
  "full_name", "birth_date", "phone", "city", "province",
  "gender", "can_relocate", "jlpt_level", "nationality", "visa_type"
]

export interface CandidateProfileFull {
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  phone: string | null
  completion_percentage: number
  birth_date: string | null
  whatsapp: string | null
  best_call_time: string | null
  city: string | null
  province: string | null
  gender: string | null
  can_relocate: string | null
  jlpt_level: string | null
  nationality: string | null
  visa_type: string | null
  visa_other: string | null
}

export function calcProfileCompletion(p: Partial<CandidateProfileFull>): number {
  const filled = REQUIRED_PROFILE_FIELDS.filter(f => {
    const v = p[f]
    return v !== null && v !== undefined && String(v).trim() !== ""
  }).length
  return Math.round((filled / REQUIRED_PROFILE_FIELDS.length) * 100)
}

export function getMissingRequiredFields(p: Partial<CandidateProfileFull>): string[] {
  const labels: Record<string, string> = {
    full_name: "Nome Completo",
    birth_date: "Data de Nascimento",
    phone: "Telefone",
    city: "Cidade",
    province: "Província",
    gender: "Sexo",
    can_relocate: "Disponibilidade para mudança",
    jlpt_level: "Nível de Japonês",
    nationality: "Nacionalidade",
    visa_type: "Tipo de Visto",
  }
  return REQUIRED_PROFILE_FIELDS
    .filter(f => !p[f] || String(p[f]).trim() === "")
    .map(f => labels[f] || f)
}
