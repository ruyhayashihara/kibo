export interface WorkArea {
  slug: string
  label: string
  description: string
  iconName: string
  iconBg: string
  iconColor: string
  keywords: string[]
  jobTypes: string[]
}

export const WORK_AREAS: WorkArea[] = [
  {
    slug: "ti-programacao",
    label: "TI & Programação",
    description: "Software, web, infraestrutura",
    iconName: "Monitor",
    iconBg: "bg-blue-100 dark:bg-blue-500/20",
    iconColor: "text-blue-500",
    keywords: ["desenvolvedor", "developer", "software", "ti", "programador", "front-end", "backend", "fullstack", "react", "sistema", "cloud", "devops", "qa", "suporte técnico", "programação"],
    jobTypes: [],
  },
  {
    slug: "engenharia",
    label: "Engenharia",
    description: "Mecânica, elétrica, manufatura",
    iconName: "Wrench",
    iconBg: "bg-orange-100 dark:bg-orange-500/20",
    iconColor: "text-orange-500",
    keywords: ["engenharia", "engenheiro", "mecânica", "elétrica", "eletricista", "mecânico", "automação", "manufatura"],
    jobTypes: [],
  },
  {
    slug: "educacao",
    label: "Ensino & Educação",
    description: "Professor, tutor, escola",
    iconName: "GraduationCap",
    iconBg: "bg-yellow-100 dark:bg-yellow-500/20",
    iconColor: "text-yellow-500",
    keywords: ["professor", "ensino", "educação", "educacao", "escola", "tutor", "aula", "teacher", "instructor", "idioma"],
    jobTypes: [],
  },
  {
    slug: "idiomas",
    label: "Idiomas & Tradução",
    description: "Intérprete, tradutor, localização",
    iconName: "Languages",
    iconBg: "bg-purple-100 dark:bg-purple-500/20",
    iconColor: "text-purple-500",
    keywords: ["intérprete", "interprete", "tradutor", "tradução", "traducao", "idioma", "japonês", "inglês", "português", "localização", "localizacao"],
    jobTypes: [],
  },
  {
    slug: "gastronomia",
    label: "Gastronomia",
    description: "Restaurante, chef, serviço",
    iconName: "Utensils",
    iconBg: "bg-rose-100 dark:bg-rose-500/20",
    iconColor: "text-rose-500",
    keywords: ["restaurante", "cozinha", "cozinheiro", "chef", "garçom", "atendimento", "alimentos", "bebidas", "izakaya", "lanchonete", "gastronomia"],
    jobTypes: [],
  },
  {
    slug: "hotelaria",
    label: "Hotelaria & Turismo",
    description: "Hotel, recepção, turismo",
    iconName: "Hotel",
    iconBg: "bg-teal-100 dark:bg-teal-500/20",
    iconColor: "text-teal-500",
    keywords: ["hotel", "hotelaria", "recepção", "recepcao", "turismo", "hospitalidade", "hostel", "recepcionista", "turista"],
    jobTypes: [],
  },
  {
    slug: "saude",
    label: "Saúde & Cuidados",
    description: "Enfermagem, cuidados, clínica",
    iconName: "HeartPulse",
    iconBg: "bg-pink-100 dark:bg-pink-500/20",
    iconColor: "text-pink-500",
    keywords: ["saúde", "saude", "cuidado", "enfermagem", "hospitalar", "clínica", "medicina", "farmácia", "cuidador", "kaigo", "介護", "hospital", "nurse"],
    jobTypes: [],
  },
  {
    slug: "logistica",
    label: "Logística & Estoque",
    description: "Armazém, transporte, delivery",
    iconName: "Package",
    iconBg: "bg-orange-100 dark:bg-amber-500/20",
    iconColor: "text-amber-500",
    keywords: ["logística", "logistica", "transporte", "motorista", "entrega", "armazém", "estoque", "warehouse", "caminhão", "delivery", "operações"],
    jobTypes: [],
  },
  {
    slug: "construcao",
    label: "Construção & Obras",
    description: "Operário, obra, arquitetura",
    iconName: "HardHat",
    iconBg: "bg-slate-100 dark:bg-slate-500/20",
    iconColor: "text-slate-500",
    keywords: ["construção", "construcao", "obra", "engenharia civil", "pedreiro", "eletricista", "encanador", "carpinteiro", "pintor", "infraestrutura", "operário"],
    jobTypes: [],
  },
  {
    slug: "financas",
    label: "Finanças & Contabilidade",
    description: "Banco, contábil, finanças",
    iconName: "Coins",
    iconBg: "bg-teal-100 dark:bg-teal-500/20",
    iconColor: "text-teal-600",
    keywords: ["finanças", "financas", "contabilidade", "contador", "banco", "contábil", "financeiro", "tesouraria", "auditor"],
    jobTypes: [],
  },
  {
    slug: "design",
    label: "Design & Criativo",
    description: "UI/UX, gráfico, marketing",
    iconName: "Palette",
    iconBg: "bg-fuchsia-100 dark:bg-fuchsia-500/20",
    iconColor: "text-fuchsia-500",
    keywords: ["design", "designer", "ui", "ux", "gráfico", "grafico", "marketing", "criativo", "ilustrador", "identidade visual", "branding"],
    jobTypes: [],
  },
  {
    slug: "agricultura",
    label: "Agricultura & Campo",
    description: "Fazenda, colheita, rural",
    iconName: "Leaf",
    iconBg: "bg-green-100 dark:bg-green-500/20",
    iconColor: "text-green-500",
    keywords: ["agricultura", "fazenda", "campo", "colheita", "rural", "agrícola", "agricola", "plantação", "lavoura"],
    jobTypes: [],
  },
  {
    slug: "fabricas-industrias",
    label: "Fábricas & Indústrias",
    description: "Linha de produção, operador, fábrica",
    iconName: "Factory",
    iconBg: "bg-gray-100 dark:bg-gray-500/20",
    iconColor: "text-gray-500",
    keywords: ["fábrica", "fabrica", "produção", "producao", "manufatura", "montagem", "operador", "linha de produção", "indústria", "industrial", "peças", "compressor", "soldagem", "usinagem", "inspeção"],
    jobTypes: ["Contrato"],
  },
  {
    slug: "autonomo",
    label: "Autônomo & Freelance",
    description: "Trabalho independente, PJ, freelance",
    iconName: "UserCheck",
    iconBg: "bg-indigo-100 dark:bg-indigo-500/20",
    iconColor: "text-indigo-500",
    keywords: ["autônomo", "autonomo", "freelance", "freelancer", "independente", "kojin", "自営", "por conta própria", "pj"],
    jobTypes: ["Autônomo", "Freelance", "PJ"],
  },
  {
    slug: "arubaito",
    label: "Arubaito (Meio Período)",
    description: "Part-time, bicos, trabalho casual",
    iconName: "Coffee",
    iconBg: "bg-cyan-100 dark:bg-cyan-500/20",
    iconColor: "text-cyan-500",
    keywords: ["arubaito", "meio período", "meio periodo", "part-time", "part time", "parcial", "アルバイト", "baito", "bico"],
    jobTypes: ["Arubaito", "Meio Período", "Estágio"],
  },
]

export function matchJobToArea(job: { title: string; job_type: string; requirements?: string[]; description?: string }, area: WorkArea): boolean {
  const searchText = [
    job.title,
    job.job_type,
    ...(job.requirements || []),
    job.description || "",
  ].join(" ").toLowerCase()

  const keywordMatch = area.keywords.some(kw => searchText.includes(kw.toLowerCase()))
  const jobTypeMatch = area.jobTypes.length > 0 && area.jobTypes.some(jt =>
    job.job_type.toLowerCase().includes(jt.toLowerCase())
  )

  return keywordMatch || jobTypeMatch
}
