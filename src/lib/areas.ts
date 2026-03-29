export interface WorkArea {
  slug: string
  label: string
  icon: string
  color: string
  keywords: string[]
  jobTypes: string[]
}

export const WORK_AREAS: WorkArea[] = [
  {
    slug: "tecnologia",
    label: "Tecnologia & TI",
    icon: "💻",
    color: "text-blue-400",
    keywords: ["desenvolvedor", "developer", "software", "ti", "programador", "front-end", "backend", "fullstack", "react", "sistema", "dados", "data", "cloud", "devops", "qa", "suporte técnico"],
    jobTypes: [],
  },
  {
    slug: "fabricas-industrias",
    label: "Fábricas e Indústrias",
    icon: "🏭",
    color: "text-orange-400",
    keywords: ["fábrica", "fabrica", "produção", "producao", "manufatura", "montagem", "operador", "linha de produção", "indústria", "industrial", "peças", "compressor", "soldagem", "usinagem", "inspeção", "controle de qualidade", "manutenção"],
    jobTypes: ["Contrato"],
  },
  {
    slug: "educacao",
    label: "Educação",
    icon: "📚",
    color: "text-yellow-400",
    keywords: ["professor", "ensino", "educação", "educacao", "escola", "idioma", "inglês", "inglês", "português", "aula", "teacher", "instructor", "tutor"],
    jobTypes: [],
  },
  {
    slug: "saude",
    label: "Saúde & Cuidados",
    icon: "🏥",
    color: "text-red-400",
    keywords: ["saúde", "saude", "cuidado", "enfermagem", "hospitalar", "clínica", "medicina", "farmácia", "cuidador", "kaigo", "介護", "hospital", "nurse"],
    jobTypes: [],
  },
  {
    slug: "gastronomia",
    label: "Gastronomia & Hospitalidade",
    icon: "🍜",
    color: "text-pink-400",
    keywords: ["restaurante", "cozinha", "cozinheiro", "chef", "garçom", "atendimento", "hotel", "hospitalidade", "alimentos", "bebidas", "izakaya", "lanchonete"],
    jobTypes: [],
  },
  {
    slug: "construcao",
    label: "Construção Civil",
    icon: "🏗️",
    color: "text-amber-400",
    keywords: ["construção", "construcao", "obra", "engenharia civil", "pedreiro", "eletricista", "encanador", "carpinteiro", "pintor", "infraestrutura"],
    jobTypes: [],
  },
  {
    slug: "logistica",
    label: "Logística & Transporte",
    icon: "🚛",
    color: "text-cyan-400",
    keywords: ["logística", "logistica", "transporte", "motorista", "entrega", "armazém", "estoque", "warehouse", "caminhão", "delivery", "operações"],
    jobTypes: [],
  },
  {
    slug: "autonomo",
    label: "Autônomos",
    icon: "🧑‍💼",
    color: "text-violet-400",
    keywords: ["autônomo", "autonomo", "freelance", "freelancer", "independente", "kojin", "自営", "por conta própria"],
    jobTypes: ["Autônomo", "Freelance", "PJ"],
  },
  {
    slug: "arubaito",
    label: "Arubaito (Meio Período)",
    icon: "⏰",
    color: "text-green-400",
    keywords: ["arubaito", "meio período", "meio periodo", "part-time", "part time", "parcial", "アルバイト", "baito"],
    jobTypes: ["Arubaito", "Meio Período", "Estágio"],
  },
  {
    slug: "limpeza",
    label: "Limpeza & Manutenção",
    icon: "🧹",
    color: "text-teal-400",
    keywords: ["limpeza", "manutenção", "manutencao", "conservação", "zeladoria", "faxina", "higienização", "soji", "清掃", "facility"],
    jobTypes: [],
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
