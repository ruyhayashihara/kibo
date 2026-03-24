import React, { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Building2,
  Eye,
  Users,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Facebook,
  Instagram,
  Youtube,
  Link2,
  Upload,
  Globe,
  Star,
  X
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { AdminJob } from "../lib/adminTypes"
import { useAuth } from "../context/AuthContext"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const chartData = [
  { name: "Seg", views: 120 },
  { name: "Ter", views: 250 },
  { name: "Qua", views: 180 },
  { name: "Qui", views: 300 },
  { name: "Sex", views: 450 },
  { name: "Sáb", views: 150 },
  { name: "Dom", views: 200 },
]

const AVAILABLE_BENEFITS = [
  'Vale Transporte (VT)', 'Vale Refeição (VR)', 'Plano de Saúde', 
  'Plano Odontológico', 'Auxílio Home Office', 'Gympass', 
  'Participação nos Lucros (PLR)', 'Horário Flexível'
];

const INITIAL_JOBS: AdminJob[] = [
  {
    id: "1",
    title: "Desenvolvedor Frontend Sênior",
    company_id: "comp_1",
    company_name: "TechCorp Japan",
    applications: 45,
    views: 850,
    status: "active",
    created_at: "12 Mar 2026",
    updated_at: "12 Mar 2026",
    area: "tecnologia",
    experience_level: "senior",
    job_type: "clt",
    work_mode: "remoto",
    location: "Tóquio",
    salary_tbd: false,
    salary_min: 500000,
    salary_max: 800000,
    description: "Procuramos um desenvolvedor frontend sênior com sólida experiência em React, TypeScript e TailwindCSS para embarcar nos nossos projetos mais desafiadores.",
    requirements: ["React", "TypeScript", "Inglês Avançado", "3+ anos Experiência"],
    benefits: ["Vale Refeição (VR)", "Auxílio Home Office", "Plano de Saúde"],
    closing_date: "2026-04-12",
    is_sponsored: true,
    is_featured: false,
  },
  {
    id: "2",
    title: "Engenheiro de Software Backend",
    company_id: "comp_1",
    company_name: "TechCorp Japan",
    applications: 32,
    views: 620,
    status: "active",
    created_at: "10 Mar 2026",
    updated_at: "10 Mar 2026",
    area: "tecnologia",
    experience_level: "pleno",
    job_type: "clt",
    work_mode: "hibrido",
    location: "Tóquio",
    salary_tbd: true,
    salary_min: null,
    salary_max: null,
    description: "Buscamos um talento para gerir nossos bancos de dados e APIs REST escaláveis. Conhecimento em arquitetura de microsserviços é bem vindo.",
    requirements: ["Node.js", "PostgreSQL", "Japonês N2", "Docker"],
    benefits: ["Vale Transporte (VT)", "Plano de Saúde", "Participação nos Lucros (PLR)"],
    closing_date: "2026-04-10",
    is_sponsored: false,
    is_featured: false,
  },
  {
    id: "3",
    title: "Especialista em Marketing Digital",
    company_id: "comp_1",
    company_name: "TechCorp Japan",
    applications: 10,
    views: 120,
    status: "closed",
    created_at: "05 Mar 2026",
    updated_at: "05 Mar 2026",
    area: "marketing",
    experience_level: "pleno",
    job_type: "contrato",
    work_mode: "remoto",
    location: "Qualquer lugar do Japão",
    salary_tbd: false,
    salary_min: 300000,
    salary_max: 450000,
    description: "Responsável por liderar as estratégias de growth marketing, otimização de campanhas (SEO/SEM) e análise de performance digital para o mercado asiático.",
    requirements: ["Google Analytics", "Performance Marketing", "SEO", "Copywriting"],
    benefits: ["Auxílio Home Office", "Horário Flexível"],
    closing_date: "2026-03-31",
    is_sponsored: false,
    is_featured: false,
  }
]

export function CompanyDashboard() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [jobs, setJobs] = useState(INITIAL_JOBS)

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: "TechCorp Japan",
    email: "contato@techcorp.com",
    industry: "it",
    companySize: "51-200",
    location: "Tóquio",
    description: "Somos uma empresa de tecnologia focada em inovações para o mercado asiático, conectando talentos globais a grandes oportunidades no Japão.",
    logo: "",
    facebook: "",
    instagram: "https://instagram.com/techcorp",
    youtube: "",
    tiktok: ""
  })
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    setTimeout(() => {
      setIsSavingProfile(false)
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    }, 1000)
  }

  const toggleStatus = (id: string) => {
    setJobs(jobs.map(job => 
      job.id === id 
        ? { ...job, status: job.status === "active" ? "closed" : "active" }
        : job
    ))
  }

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id))
  }

  // Job Editing
  const [editingJob, setEditingJob] = useState<AdminJob | null>(null)
  const [reqInput, setReqInput] = useState("")

  function handleSaveJob() {
    if (!editingJob) return
    setJobs(prev => prev.map(j => j.id === editingJob.id ? editingJob : j))
    setEditingJob(null)
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar (240px) */}
        <aside className="w-full md:w-[240px] shrink-0">
          <div className="glass-panel rounded-2xl p-6 border-border sticky top-24">
            {/* Company Profile Summary */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent p-1 mb-4">
                <div className="h-full w-full rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                  <Building2 className="h-10 w-10 text-primary/80" />
                </div>
              </div>
              <h3 className="font-semibold text-lg text-foreground">TechCorp Japan</h3>
              <p className="text-sm text-muted-foreground">Tecnologia • Tóquio</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "overview" 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Visão geral</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("jobs")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "jobs" 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                }`}
              >
                <Briefcase className="h-5 w-5" />
                <span className="font-medium">Minhas vagas</span>
                <Badge variant="glass" className="ml-auto bg-muted text-foreground text-xs">{jobs.length}</Badge>
              </button>
              
              <Link 
                to="/empresa/vagas/nova"
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "publish" 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                }`}
              >
                <PlusCircle className="h-5 w-5" />
                <span className="font-medium">Publicar vaga</span>
              </Link>

              <button 
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "profile" 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                }`}
              >
                <Building2 className="h-5 w-5" />
                <span className="font-medium">Editar perfil</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "settings" 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                }`}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Configurações</span>
              </button>
            </nav>

            <div className="mt-8 pt-6 border-t border-border">
              <button 
                onClick={async () => {
                  await signOut();
                  navigate('/login');
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">

          {/* Edit Job Modal */}
          {editingJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
              <Card className="glass-panel w-full max-w-4xl my-8 animate-in fade-in zoom-in-95 duration-200">
                <CardHeader className="border-b border-border pb-4 sticky top-0 bg-background/95 backdrop-blur z-10 rounded-t-xl">
                  <CardTitle className="text-xl text-foreground flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Edit className="h-5 w-5 text-primary" />
                      Editar Vaga: {editingJob.title}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setEditingJob(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-8 max-h-[75vh] overflow-y-auto">
                  {/* Informações Gerais */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                      <div className="h-6 w-1 bg-primary rounded-full"></div> Informações Gerais
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-1 md:col-span-2">
                        <label className="text-sm font-medium text-foreground/80">Título da Vaga *</label>
                        <Input value={editingJob.title || ''} onChange={e => setEditingJob({ ...editingJob, title: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground/80">Área / Setor *</label>
                        <select value={editingJob.area || ''} onChange={e => setEditingJob({ ...editingJob, area: e.target.value })} className="flex h-10 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none">
                          <option value="" className="bg-background">Selecione uma área</option>
                          <option value="tecnologia" className="bg-background">Tecnologia / TI</option>
                          <option value="design" className="bg-background">Design / UX</option>
                          <option value="marketing" className="bg-background">Marketing</option>
                          <option value="vendas" className="bg-background">Vendas</option>
                          <option value="rh" className="bg-background">Recursos Humanos</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground/80">Nível de Experiência *</label>
                        <select value={editingJob.experience_level || ''} onChange={e => setEditingJob({ ...editingJob, experience_level: e.target.value })} className="flex h-10 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none">
                          <option value="" className="bg-background">Selecione o nível</option>
                          <option value="estagio" className="bg-background">Estágio</option>
                          <option value="junior" className="bg-background">Júnior</option>
                          <option value="pleno" className="bg-background">Pleno</option>
                          <option value="senior" className="bg-background">Sênior</option>
                          <option value="especialista" className="bg-background">Especialista</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground/80">Tipo de Contrato *</label>
                        <select value={editingJob.job_type || ''} onChange={e => setEditingJob({ ...editingJob, job_type: e.target.value })} className="flex h-10 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none">
                          <option value="" className="bg-background">Selecione o contrato</option>
                          <option value="clt" className="bg-background">CLT (Seishain)</option>
                          <option value="contrato" className="bg-background">Contrato (Keiyaku)</option>
                          <option value="arubaito" className="bg-background">Meio Período (Arubaito)</option>
                          <option value="autonomo" className="bg-background">Autônomo (Kojin Jigyou Nushi)</option>
                          <option value="PJ" className="bg-background">PJ</option>
                          <option value="Estágio" className="bg-background">Estágio</option>
                          <option value="Freelance" className="bg-background">Freelance</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground/80">Modalidade *</label>
                        <select value={editingJob.work_mode || ''} onChange={e => setEditingJob({ ...editingJob, work_mode: e.target.value })} className="flex h-10 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none">
                          <option value="" className="bg-background">Selecione a modalidade</option>
                          <option value="remoto" className="bg-background">100% Remoto</option>
                          <option value="hibrido" className="bg-background">Híbrido</option>
                          <option value="presencial" className="bg-background">Presencial</option>
                        </select>
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <label className="text-sm font-medium text-foreground/80">Localização</label>
                        <Input value={editingJob.location || ''} onChange={e => setEditingJob({ ...editingJob, location: e.target.value })} disabled={editingJob.work_mode === 'remoto' || editingJob.work_mode === 'Remoto'} />
                      </div>
                      <div className="col-span-1 md:col-span-2 bg-muted p-6 rounded-2xl border border-border">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-semibold uppercase tracking-wider text-foreground">Faixa Salarial (Mensal)</span>
                          <label className="flex items-center cursor-pointer">
                            <input type="checkbox" checked={editingJob.salary_tbd || false} onChange={e => setEditingJob({ ...editingJob, salary_tbd: e.target.checked })} className="mr-2" />
                            <span className="text-sm text-foreground">A combinar</span>
                          </label>
                        </div>
                        {!editingJob.salary_tbd && (
                          <div className="grid grid-cols-2 gap-4">
                            <Input type="number" placeholder="Mínimo" value={editingJob.salary_min || ''} onChange={e => setEditingJob({ ...editingJob, salary_min: Number(e.target.value) })} />
                            <Input type="number" placeholder="Máximo" value={editingJob.salary_max || ''} onChange={e => setEditingJob({ ...editingJob, salary_max: Number(e.target.value) })} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detalhes da Vaga */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                      <div className="h-6 w-1 bg-primary rounded-full"></div> Detalhes da Vaga
                    </h3>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Descrição / Requisitos *</label>
                      <textarea value={editingJob.description || ''} onChange={e => setEditingJob({ ...editingJob, description: e.target.value })} rows={6} className="flex w-full rounded-2xl border border-border bg-input px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Requisitos Obrigatórios (Tags)</label>
                      <div className="bg-input border border-border rounded-2xl p-3 flex flex-wrap gap-2 items-center min-h-[60px]">
                        {(editingJob.requirements || []).map(req => (
                          <Badge key={req} variant="secondary" className="px-3 py-1 flex items-center gap-2">
                            {req}
                            <button type="button" onClick={() => setEditingJob({ ...editingJob, requirements: editingJob.requirements.filter(r => r !== req) })} className="hover:text-red-500">
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                        <input 
                          type="text" 
                          value={reqInput} 
                          onChange={e => setReqInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && reqInput.trim()) {
                              e.preventDefault();
                              const reqs = editingJob.requirements || [];
                              if (!reqs.includes(reqInput.trim())) {
                                setEditingJob({ ...editingJob, requirements: [...reqs, reqInput.trim()] });
                              }
                              setReqInput('');
                            }
                          }}
                          placeholder="Adicionar tag (pressione Enter)"
                          className="flex-1 min-w-[200px] outline-none bg-transparent py-1.5 px-3 text-sm text-foreground"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Benefícios</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {AVAILABLE_BENEFITS.map(benefit => {
                          const isSelected = (editingJob.benefits || []).includes(benefit);
                          return (
                            <label key={benefit} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/10' : 'border-border bg-muted hover:bg-muted/80'}`}>
                              <input 
                                type="checkbox" 
                                className="mr-3"
                                checked={isSelected}
                                onChange={() => {
                                  const current = editingJob.benefits || [];
                                  setEditingJob({
                                    ...editingJob,
                                    benefits: isSelected ? current.filter(b => b !== benefit) : [...current, benefit]
                                  });
                                }}
                              />
                              <span className="text-sm font-medium text-foreground">{benefit}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Data de Encerramento (Opcional)</label>
                        <Input type="date" value={editingJob.closing_date || ''} onChange={e => setEditingJob({ ...editingJob, closing_date: e.target.value })} />
                      </div>
                      <div className="space-y-2 flex flex-col justify-center pt-6">
                        <label className="flex items-center cursor-pointer gap-2">
                          <input type="checkbox" checked={editingJob.is_sponsored || false} onChange={e => setEditingJob({ ...editingJob, is_sponsored: e.target.checked })} />
                          <span className="text-sm font-medium text-foreground flex items-center gap-1">
                            <Star className="w-4 h-4 text-accent" /> Vaga em Destaque (Patrocinada)
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                </CardContent>
                <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3 rounded-b-xl">
                  <Button variant="outline" onClick={() => setEditingJob(null)}>Cancelar</Button>
                  <Button onClick={handleSaveJob} disabled={!editingJob.title || !editingJob.area || !editingJob.experience_level || !editingJob.job_type || !editingJob.work_mode}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Salvar Alterações
                  </Button>
                </div>
              </Card>
            </div>
          )}
          
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Greeting */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Bom dia, TechCorp!</h1>
                <p className="text-muted-foreground">Aqui está o resumo do seu recrutamento hoje.</p>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-panel rounded-2xl p-6 border-border flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Vagas ativas</p>
                    <p className="text-2xl font-bold text-foreground">5</p>
                  </div>
                </div>
                
                <div className="glass-panel rounded-2xl p-6 border-border flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <Eye className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Visualizações</p>
                    <p className="text-2xl font-bold text-foreground">1.240</p>
                  </div>
                </div>
                
                <div className="glass-panel rounded-2xl p-6 border-border flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Candidatos</p>
                    <p className="text-2xl font-bold text-foreground">87</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border-border">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-foreground">Visualizações de Vagas</h2>
                    <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} vertical={false} />
                        <XAxis dataKey="name" stroke="currentColor" strokeOpacity={0.5} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="currentColor" strokeOpacity={0.5} fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                          itemStyle={{ color: 'var(--primary)' }}
                        />
                        <Area type="monotone" dataKey="views" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* CTA Card */}
                <div className="glass-panel rounded-2xl p-8 border-border relative overflow-hidden flex flex-col justify-center items-center text-center">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                  
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 glow-primary relative z-10">
                    <PlusCircle className="h-8 w-8 text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-foreground mb-2 relative z-10">Nova Vaga</h2>
                  <p className="text-muted-foreground mb-8 relative z-10">Alcance milhares de profissionais qualificados no Japão.</p>
                  
                  <Link to="/empresa/vagas/nova" className="w-full relative z-10">
                    <Button variant="gradient" className="w-full rounded-full h-12 text-base font-semibold">
                      Publicar Vaga
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Active Jobs Table */}
              <div className="glass-panel rounded-2xl border-border overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">Vagas Recentes</h2>
                  <Button variant="outline" size="sm" className="rounded-full border-border" onClick={() => setActiveTab("jobs")}>Ver todas</Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="px-6 py-4 font-medium">Vaga</th>
                        <th className="px-6 py-4 font-medium">Candidatos</th>
                        <th className="px-6 py-4 font-medium">Visualizações</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-foreground">{job.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">Publicada em {job.created_at}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-foreground font-medium">{job.applications}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-foreground">{job.views}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => toggleStatus(job.id)}
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                job.status === "active" 
                                  ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" 
                                  : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
                              }`}
                            >
                              {job.status === "active" ? (
                                <><CheckCircle2 className="h-3 w-3 mr-1" /> Ativa</>
                              ) : (
                                <><XCircle className="h-3 w-3 mr-1" /> Pausada</>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setEditingJob(job)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                onClick={() => deleteJob(job.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Minhas Vagas</h1>
                <p className="text-muted-foreground">Gerencie suas vagas ativas, pausadas e encerradas.</p>
              </div>
              <div className="glass-panel rounded-2xl border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="px-6 py-4 font-medium">Vaga</th>
                        <th className="px-6 py-4 font-medium">Candidatos</th>
                        <th className="px-6 py-4 font-medium">Visualizações</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-foreground">{job.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">Publicada em {job.created_at}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-foreground font-medium">{job.applications}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-foreground">{job.views}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => toggleStatus(job.id)}
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                job.status === "active" 
                                  ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" 
                                  : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
                              }`}
                            >
                              {job.status === "active" ? (
                                <><CheckCircle2 className="h-3 w-3 mr-1" /> Ativa</>
                              ) : (
                                <><XCircle className="h-3 w-3 mr-1" /> Pausada</>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setEditingJob(job)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                onClick={() => deleteJob(job.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Editar Perfil</h1>
                <p className="text-muted-foreground">Mantenha os dados e redes sociais da sua empresa atualizados para atrair os melhores talentos.</p>
              </div>

              {profileSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl flex items-center animate-in fade-in zoom-in-95">
                  <CheckCircle2 className="h-5 w-5 mr-2 shrink-0" />
                  Perfil atualizado com sucesso!
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-8">
                {/* Logo Section */}
                <div className="glass-panel p-6 rounded-2xl border border-border flex items-center gap-6">
                  <div className="h-24 w-24 shrink-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex flex-col items-center justify-center relative group cursor-pointer overflow-hidden text-primary">
                    {profileForm.logo ? (
                      <img src={profileForm.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mb-1" />
                        <span className="text-[10px] font-medium uppercase">Logo</span>
                      </>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Edit className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Logotipo da Empresa</h3>
                    <p className="text-sm text-muted-foreground">Formatos recomendados: JPG, PNG, GIF. Tamanho ideal 400x400px.</p>
                    <div className="mt-3">
                      <label className="text-sm font-medium text-primary cursor-pointer hover:underline">
                        Carregar nova imagem
                        <input type="file" className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-border space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Informações Básicas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Nome da empresa</label>
                        <input 
                          type="text" 
                          value={profileForm.name}
                          onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                          className="flex h-11 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Email corporativo</label>
                        <input 
                          type="email" 
                          value={profileForm.email}
                          onChange={e => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                          className="flex h-11 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Setor / Indústria</label>
                        <select 
                          value={profileForm.industry}
                          onChange={e => setProfileForm(prev => ({ ...prev, industry: e.target.value }))}
                          className="flex h-11 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none transition-shadow"
                        >
                          <option value="it" className="bg-background">Tecnologia</option>
                          <option value="industry" className="bg-background">Indústria</option>
                          <option value="services" className="bg-background">Serviços</option>
                          <option value="commerce" className="bg-background">Comércio</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Tamanho da empresa</label>
                        <select 
                          value={profileForm.companySize}
                          onChange={e => setProfileForm(prev => ({ ...prev, companySize: e.target.value }))}
                          className="flex h-11 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none transition-shadow"
                        >
                          <option value="1-10" className="bg-background">1-10 funcionários</option>
                          <option value="11-50" className="bg-background">11-50 funcionários</option>
                          <option value="51-200" className="bg-background">51-200 funcionários</option>
                          <option value="201+" className="bg-background">Mais de 200</option>
                        </select>
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Sede / Cidade</label>
                        <input 
                          type="text" 
                          value={profileForm.location}
                          onChange={e => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                          className="flex h-11 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow" 
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Descrição da empresa</label>
                        <textarea 
                          value={profileForm.description}
                          onChange={e => setProfileForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          placeholder="Fale sobre a missão, visão e o que a empresa faz..."
                          className="flex min-h-[120px] w-full rounded-3xl border border-border bg-input px-5 py-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow resize-y" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-border my-8"></div>

                  {/* Social Networks */}
                  <div>
                    <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Redes Sociais
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                          <Facebook className="h-4 w-4 text-blue-500" /> Facebook
                        </label>
                        <input 
                          type="url" 
                          placeholder="https://facebook.com/SuaEmpresa"
                          value={profileForm.facebook}
                          onChange={e => setProfileForm(prev => ({ ...prev, facebook: e.target.value }))}
                          className="flex h-11 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-pink-500" /> Instagram
                        </label>
                        <input 
                          type="url" 
                          placeholder="https://instagram.com/SuaEmpresa"
                          value={profileForm.instagram}
                          onChange={e => setProfileForm(prev => ({ ...prev, instagram: e.target.value }))}
                          className="flex h-11 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                          <Youtube className="h-4 w-4 text-red-500" /> YouTube
                        </label>
                        <input 
                          type="url" 
                          placeholder="https://youtube.com/@SuaEmpresa"
                          value={profileForm.youtube}
                          onChange={e => setProfileForm(prev => ({ ...prev, youtube: e.target.value }))}
                          className="flex h-11 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                          <Link2 className="h-4 w-4 text-cyan-500" /> TikTok
                        </label>
                        <input 
                          type="url" 
                          placeholder="https://tiktok.com/@SuaEmpresa"
                          value={profileForm.tiktok}
                          onChange={e => setProfileForm(prev => ({ ...prev, tiktok: e.target.value }))}
                          className="flex h-11 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 pb-12">
                  <Button 
                    type="submit" 
                    disabled={isSavingProfile || !profileForm.name}
                    variant="gradient"
                    className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25"
                  >
                    {isSavingProfile ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Salvando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Salvar Alterações
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
