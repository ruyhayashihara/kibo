import React, { useState, useEffect } from "react"
import {
  Users,
  Building2,
  Briefcase,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Star,
  Search,
  Shield,
  FileText,
  Eye,
  Ban,
  UserPlus,
  Mail,
  MapPin,
  Phone,
  Globe,
  ClipboardList,
  ChevronDown,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import type {
  AdminTab,
  AccountSubTab,
  ContentSubTab,
  AdminUser,
  AdminCompany,
  AdminJob,
  AdminApplication,
  AdminStats,
  CreateAccountForm,
} from "@/src/lib/adminTypes"
import {
  fetchAdminStats,
  fetchUsers,
  fetchAdmins,
  fetchCompanies,
  fetchJobs,
  fetchApplications,
  toggleUserStatus,
  deleteUser as deleteUserService,
  toggleCompanyStatus,
  deleteCompany as deleteCompanyService,
  updateJobStatus,
  deleteJob as deleteJobService,
  toggleJobSponsored,
  createAccount,
} from "@/src/lib/adminService"

// ─── Ad Mock Data (preserved from original) ───
const MOCK_ADS = [
  { id: "1", position: "homepage_banner", image: "https://picsum.photos/seed/ad1/800/200", link: "https://example.com/ad1", status: "ativo" },
  { id: "2", position: "listing_sidebar", image: "https://picsum.photos/seed/ad2/300/600", link: "https://example.com/ad2", status: "ativo" },
  { id: "3", position: "listing_native", image: "https://picsum.photos/seed/ad3/600/200", link: "https://example.com/ad3", status: "inativo" },
  { id: "4", position: "job_detail_sidebar", image: "https://picsum.photos/seed/ad4/300/250", link: "https://example.com/ad4", status: "ativo" },
]

// ─── Status Badge Helper ───
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { class: string; icon: any }> = {
    active: { class: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10", icon: CheckCircle2 },
    ativo: { class: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10", icon: CheckCircle2 },
    inactive: { class: "border-zinc-500/50 text-zinc-400 bg-zinc-500/10", icon: XCircle },
    inativo: { class: "border-zinc-500/50 text-zinc-400 bg-zinc-500/10", icon: XCircle },
    suspended: { class: "border-amber-500/50 text-amber-400 bg-amber-500/10", icon: Ban },
    pending: { class: "border-blue-500/50 text-blue-400 bg-blue-500/10", icon: AlertTriangle },
    rejected: { class: "border-red-500/50 text-red-400 bg-red-500/10", icon: XCircle },
    closed: { class: "border-zinc-500/50 text-zinc-400 bg-zinc-500/10", icon: XCircle },
    viewed: { class: "border-cyan-500/50 text-cyan-400 bg-cyan-500/10", icon: Eye },
    interview: { class: "border-purple-500/50 text-purple-400 bg-purple-500/10", icon: Users },
    accepted: { class: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10", icon: CheckCircle2 },
  }
  const c = config[status] || config.inactive
  const Icon = c.icon
  return (
    <Badge variant="outline" className={c.class}>
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </Badge>
  )
}

// ─── Tab Navigation ───
const TABS: { id: AdminTab; label: string; icon: any }[] = [
  { id: "overview", label: "Visão Geral", icon: BarChart3 },
  { id: "accounts", label: "Contas", icon: Users },
  { id: "content", label: "Conteúdo", icon: FileText },
  { id: "create", label: "Criar Conta", icon: UserPlus },
  { id: "ads", label: "Anúncios", icon: Star },
]

// ─── Constants ───
const AVAILABLE_BENEFITS = [
  'Vale Transporte (VT)', 'Vale Refeição (VR)', 'Plano de Saúde', 
  'Plano Odontológico', 'Auxílio Home Office', 'Gympass', 
  'Participação nos Lucros (PLR)', 'Horário Flexível'
];

// ═══════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview")
  const [accountSubTab, setAccountSubTab] = useState<AccountSubTab>("users")
  const [contentSubTab, setContentSubTab] = useState<ContentSubTab>("jobs")
  const [searchQuery, setSearchQuery] = useState("")

  // Data state
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [companies, setCompanies] = useState<AdminCompany[]>([])
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [ads, setAds] = useState(MOCK_ADS)
  const [loading, setLoading] = useState(true)

  // Ad editing
  const [editingAd, setEditingAd] = useState<{ id: string; position: string; image: string; link: string; status: string } | null>(null)
  const [isNewAd, setIsNewAd] = useState(false)

  // Job editing
  const [editingJob, setEditingJob] = useState<AdminJob | null>(null)
  const [reqInput, setReqInput] = useState("")
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [editingCompany, setEditingCompany] = useState<AdminCompany | null>(null)
  const [editingApplication, setEditingApplication] = useState<AdminApplication | null>(null)

  // Create Account form
  const [createForm, setCreateForm] = useState<CreateAccountForm>({
    email: "",
    password: "",
    accountType: "candidate",
    full_name: "",
    company_name: "",
    industry: "",
    location: "",
    phone: "",
  })
  const [createLoading, setCreateLoading] = useState(false)
  const [createResult, setCreateResult] = useState<{ success: boolean; message: string } | null>(null)

  // Confirmation dialog
  const [confirmAction, setConfirmAction] = useState<{
    type: string
    id: string
    name: string
    action: () => Promise<void>
  } | null>(null)

  // Load data
  useEffect(() => {
    loadAllData()
  }, [])

  async function loadAllData() {
    setLoading(true)
    const [statsData, usersData, adminsData, companiesData, jobsData, appsData] = await Promise.all([
      fetchAdminStats(),
      fetchUsers(),
      fetchAdmins(),
      fetchCompanies(),
      fetchJobs(),
      fetchApplications(),
    ])
    setStats(statsData)
    setUsers(usersData)
    setAdmins(adminsData)
    setCompanies(companiesData)
    setJobs(jobsData)
    setApplications(appsData)
    setLoading(false)
  }

  // ─── Action Handlers ───

  async function handleToggleUserStatus(user: AdminUser) {
    const success = await toggleUserStatus(user.id, user.status)
    if (success) {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } as AdminUser : u))
    } else {
      // Mock: toggle locally
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } as AdminUser : u))
    }
  }

  async function handleDeleteUser(userId: string) {
    await deleteUserService(userId)
    setUsers(prev => prev.filter(u => u.id !== userId))
    setConfirmAction(null)
  }

  async function handleToggleCompanyStatus(company: AdminCompany) {
    const success = await toggleCompanyStatus(company.id, company.status)
    if (success) {
      setCompanies(prev => prev.map(c => c.id === company.id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } as AdminCompany : c))
    } else {
      setCompanies(prev => prev.map(c => c.id === company.id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } as AdminCompany : c))
    }
  }

  async function handleDeleteCompany(companyId: string) {
    await deleteCompanyService(companyId)
    setCompanies(prev => prev.filter(c => c.id !== companyId))
    setConfirmAction(null)
  }

  async function handleJobStatusChange(jobId: string, newStatus: string) {
    await updateJobStatus(jobId, newStatus)
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } as AdminJob : j))
  }

  async function handleDeleteJob(jobId: string) {
    await deleteJobService(jobId)
    setJobs(prev => prev.filter(j => j.id !== jobId))
    setConfirmAction(null)
  }

  async function handleToggleSponsored(job: AdminJob) {
    await toggleJobSponsored(job.id, job.is_sponsored)
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, is_sponsored: !j.is_sponsored } : j))
  }

  function toggleAdStatus(id: string) {
    setAds(ads.map(ad => ad.id === id ? { ...ad, status: ad.status === "ativo" ? "inativo" : "ativo" } : ad))
  }

  function openEditAd(ad: typeof MOCK_ADS[0]) {
    setEditingAd({ ...ad })
    setIsNewAd(false)
  }

  function openNewAd() {
    setEditingAd({ id: String(Date.now()), position: "homepage_banner", image: "", link: "", status: "ativo" })
    setIsNewAd(true)
  }

  function saveAd() {
    if (!editingAd) return
    if (isNewAd) {
      setAds(prev => [...prev, editingAd])
    } else {
      setAds(prev => prev.map(a => a.id === editingAd.id ? editingAd : a))
    }
    setEditingAd(null)
  }

  function deleteAd(id: string) {
    setAds(prev => prev.filter(a => a.id !== id))
  }

  function openEditJob(job: AdminJob) {
    setEditingJob({ ...job })
  }

  async function handleSaveJob() {
    if (!editingJob) return
    // Optimistic update in state
    setJobs(prev => prev.map(j => j.id === editingJob.id ? editingJob : j))
    
    // In a real app, we would call a service here
    // const success = await updateJobService(editingJob.id, editingJob)
    
    setEditingJob(null)
  }

  function handleSaveUser() {
    if (!editingUser) return
    setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u))
    setAdmins(prev => prev.map(a => a.id === editingUser.id ? editingUser : a))
    setEditingUser(null)
  }

  function handleSaveCompany() {
    if (!editingCompany) return
    setCompanies(prev => prev.map(c => c.id === editingCompany.id ? editingCompany : c))
    setEditingCompany(null)
  }

  function handleSaveApplication() {
    if (!editingApplication) return
    setApplications(prev => prev.map(a => a.id === editingApplication.id ? editingApplication : a))
    setEditingApplication(null)
  }

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault()
    setCreateLoading(true)
    setCreateResult(null)
    const result = await createAccount(createForm)
    setCreateResult(result)
    if (result.success) {
      setCreateForm({ email: "", password: "", accountType: "candidate", full_name: "", company_name: "", industry: "", location: "", phone: "" })
      await loadAllData()
    }
    setCreateLoading(false)
  }

  // Filter helpers
  const filteredUsers = users.filter(u =>
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredAdmins = admins.filter(a =>
    a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (j.company_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredApplications = applications.filter(a =>
    (a.user_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.job_title || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ─── Loading State ───
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          <p className="text-muted-foreground">Carregando painel administrativo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="glass-panel w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Confirmar ação</h3>
                  <p className="text-sm text-muted-foreground">
                    {confirmAction.type === 'delete'
                      ? `Tem certeza que deseja excluir "${confirmAction.name}"?`
                      : `Confirma a ação em "${confirmAction.name}"?`}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-6">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" size="sm" onClick={() => setConfirmAction(null)}>
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={confirmAction.action}
                >
                  Confirmar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                      <option value="Remoto" className="bg-background">Remoto (Legado)</option>
                      <option value="Híbrido" className="bg-background">Híbrido (Legado)</option>
                      <option value="Presencial" className="bg-background">Presencial (Legado)</option>
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


      <div className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Painel Administrativo</h1>
            </div>
            <p className="text-muted-foreground ml-[52px]">Gestão global da plataforma KiboJobs.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 self-start" onClick={loadAllData}>
            <RefreshCw className="h-4 w-4" />
            Atualizar dados
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 p-1 rounded-2xl bg-muted/50 border border-border">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery("") }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════════════ TAB: Visão Geral ═══════════════ */}
        {activeTab === "overview" && stats && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {[
                { title: "Usuários", value: stats.totalUsers, icon: Users, color: "from-blue-500 to-cyan-500" },
                { title: "Empresas", value: stats.totalCompanies, icon: Building2, color: "from-violet-500 to-purple-500" },
                { title: "Vagas Totais", value: stats.totalJobs, icon: Briefcase, color: "from-emerald-500 to-teal-500" },
                { title: "Vagas Ativas", value: stats.activeJobs, icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
                { title: "Pendentes", value: stats.pendingJobs, icon: AlertTriangle, color: "from-amber-500 to-orange-500" },
                { title: "Candidaturas", value: stats.totalApplications, icon: ClipboardList, color: "from-pink-500 to-rose-500" },
              ].map((stat, i) => (
                <Card key={i} className="glass-panel overflow-hidden group hover:border-primary/30 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick sections */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Recent Jobs */}
              <Card className="glass-panel">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Vagas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {jobs.slice(0, 5).map(job => (
                      <div key={job.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{job.title}</p>
                          <p className="text-xs text-muted-foreground">{job.company_name}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {job.views}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditJob(job)}
                              className="p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <StatusBadge status={job.status} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card className="glass-panel">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    Candidaturas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {applications.slice(0, 5).map(app => (
                      <div key={app.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{app.user_name}</p>
                          <p className="text-xs text-muted-foreground">→ {app.job_title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingApplication({ ...app })}
                            className="p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <StatusBadge status={app.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ═══════════════ TAB: Contas ═══════════════ */}
        {activeTab === "accounts" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sub-tabs */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border">
                {([
                  { id: "users" as AccountSubTab, label: "Usuários", count: users.length },
                  { id: "companies" as AccountSubTab, label: "Empresas", count: companies.length },
                  { id: "admins" as AccountSubTab, label: "Administradores", count: admins.length },
                ]).map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => { setAccountSubTab(sub.id); setSearchQuery("") }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      accountSubTab === sub.id
                        ? "bg-background text-foreground shadow-sm border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {sub.label}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      accountSubTab === sub.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    }`}>{sub.count}</span>
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  className="pl-9 w-[250px]"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Users Table */}
            {accountSubTab === "users" && (
              <Card className="glass-panel">
                <CardContent className="p-0 overflow-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-medium">Usuário</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium">Localização</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Cadastro</th>
                        <th className="px-6 py-4 font-medium text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-white text-xs font-bold">
                                {user.full_name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-foreground">{user.full_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                          <td className="px-6 py-4 text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {user.location || '—'}</span>
                          </td>
                          <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                          <td className="px-6 py-4 text-muted-foreground text-xs">{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setEditingUser({ ...user })}
                                className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleUserStatus(user)}
                                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                                title={user.status === 'active' ? 'Suspender' : 'Ativar'}
                              >
                                {user.status === 'active' ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => setConfirmAction({ type: 'delete', id: user.id, name: user.full_name, action: () => handleDeleteUser(user.id) })}
                                className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhum usuário encontrado.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Companies Table */}
            {accountSubTab === "companies" && (
              <Card className="glass-panel">
                <CardContent className="p-0 overflow-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-medium">Empresa</th>
                        <th className="px-6 py-4 font-medium">Setor</th>
                        <th className="px-6 py-4 font-medium">Website</th>
                        <th className="px-6 py-4 font-medium">Vagas Abertas</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Cadastro</th>
                        <th className="px-6 py-4 font-medium text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredCompanies.map(company => (
                        <tr key={company.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500/50 to-purple-500/50 flex items-center justify-center text-white text-xs font-bold">
                                {company.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-medium text-foreground">{company.name}</span>
                                {company.description && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{company.description}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{company.industry || '—'}</td>
                          <td className="px-6 py-4">
                            {company.website ? (
                              <a href={company.website} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1">
                                <Globe className="h-3 w-3" /> Site
                              </a>
                            ) : '—'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 text-foreground font-medium">
                              <Briefcase className="h-3 w-3 text-primary" /> {company.open_jobs}
                            </span>
                          </td>
                          <td className="px-6 py-4"><StatusBadge status={company.status} /></td>
                          <td className="px-6 py-4 text-muted-foreground text-xs">{new Date(company.created_at).toLocaleDateString('pt-BR')}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setEditingCompany({ ...company })}
                                className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleCompanyStatus(company)}
                                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                                title={company.status === 'active' ? 'Desativar' : 'Ativar'}
                              >
                                {company.status === 'active' ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => setConfirmAction({ type: 'delete', id: company.id, name: company.name, action: () => handleDeleteCompany(company.id) })}
                                className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredCompanies.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                      <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma empresa encontrada.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Admins Table */}
            {accountSubTab === "admins" && (
              <Card className="glass-panel">
                <CardContent className="p-0 overflow-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-medium">Administrador</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium">Localização</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Desde</th>
                        <th className="px-6 py-4 font-medium text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredAdmins.map(admin => (
                        <tr key={admin.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                <Shield className="h-4 w-4" />
                              </div>
                              <span className="font-medium text-foreground">{admin.full_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{admin.email}</td>
                          <td className="px-6 py-4 text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {admin.location || '—'}</span>
                          </td>
                          <td className="px-6 py-4"><StatusBadge status={admin.status} /></td>
                          <td className="px-6 py-4 text-muted-foreground text-xs">{new Date(admin.created_at).toLocaleDateString('pt-BR')}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setEditingUser({ ...admin })}
                                className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredAdmins.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                      <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhum administrador encontrado.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ═══════════════ TAB: Conteúdo ═══════════════ */}
        {activeTab === "content" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sub-tabs */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border">
                {([
                  { id: "jobs" as ContentSubTab, label: "Vagas", count: jobs.length },
                  { id: "applications" as ContentSubTab, label: "Candidaturas", count: applications.length },
                ]).map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => { setContentSubTab(sub.id); setSearchQuery("") }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      contentSubTab === sub.id
                        ? "bg-background text-foreground shadow-sm border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {sub.label}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      contentSubTab === sub.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    }`}>{sub.count}</span>
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  className="pl-9 w-[250px]"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Jobs Table */}
            {contentSubTab === "jobs" && (
              <Card className="glass-panel">
                <CardContent className="p-0 overflow-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-medium">Vaga</th>
                        <th className="px-6 py-4 font-medium">Empresa</th>
                        <th className="px-6 py-4 font-medium">Modo</th>
                        <th className="px-6 py-4 font-medium">Tipo</th>
                        <th className="px-6 py-4 font-medium">Views</th>
                        <th className="px-6 py-4 font-medium">Patrocinada</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredJobs.map(job => (
                        <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{job.title}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground/80">{job.company_name}</td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="text-xs">{job.work_mode}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="text-xs">{job.job_type}</Badge>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {job.views}</span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleSponsored(job)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                                job.is_sponsored ? 'bg-primary' : 'bg-muted-foreground/30'
                              }`}
                            >
                              <span className="sr-only">Toggle sponsored</span>
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                job.is_sponsored ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </td>
                          <td className="px-6 py-4"><StatusBadge status={job.status} /></td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {job.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleJobStatusChange(job.id, 'active')}
                                    className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded transition-colors"
                                    title="Aprovar"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleJobStatusChange(job.id, 'rejected')}
                                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                    title="Rejeitar"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              {job.status === 'active' && (
                                <button
                                  onClick={() => handleJobStatusChange(job.id, 'closed')}
                                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                                  title="Fechar vaga"
                                >
                                  <Ban className="h-4 w-4" />
                                </button>
                              )}
                                <button
                                  onClick={() => openEditJob(job)}
                                  className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setConfirmAction({ type: 'delete', id: job.id, name: job.title, action: () => handleDeleteJob(job.id) })}
                                  className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>


                  {filteredJobs.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                      <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma vaga encontrada.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Applications Table */}
            {contentSubTab === "applications" && (
              <Card className="glass-panel">
                <CardContent className="p-0 overflow-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-medium">Candidato</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium">Vaga</th>
                        <th className="px-6 py-4 font-medium">Empresa</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Data</th>
                        <th className="px-6 py-4 font-medium text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredApplications.map(app => (
                        <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{app.user_name}</td>
                          <td className="px-6 py-4 text-muted-foreground">{app.user_email}</td>
                          <td className="px-6 py-4 text-foreground/80">{app.job_title}</td>
                          <td className="px-6 py-4 text-muted-foreground">{app.company_name}</td>
                          <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                          <td className="px-6 py-4 text-muted-foreground text-xs">{new Date(app.applied_at).toLocaleDateString('pt-BR')}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setEditingApplication({ ...app })}
                              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                              title="Editar status"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredApplications.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                      <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma candidatura encontrada.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ═══════════════ TAB: Criar Conta ═══════════════ */}
        {activeTab === "create" && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="glass-panel">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Criar Nova Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {createResult && (
                  <div className={`mb-6 p-4 rounded-xl border text-sm ${
                    createResult.success
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                      : "bg-red-500/10 border-red-500/20 text-red-500"
                  }`}>
                    {createResult.success ? <CheckCircle2 className="h-4 w-4 inline mr-2" /> : <XCircle className="h-4 w-4 inline mr-2" />}
                    {createResult.message}
                  </div>
                )}

                <form onSubmit={handleCreateAccount} className="space-y-6">
                  {/* Account Type Selector */}
                  <div>
                    <label className="text-sm font-medium text-foreground/80 block mb-3">Tipo de conta</label>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { type: "candidate" as const, label: "Usuário", icon: Users, color: "from-blue-500 to-cyan-500" },
                        { type: "company" as const, label: "Empresa", icon: Building2, color: "from-violet-500 to-purple-500" },
                        { type: "admin" as const, label: "Admin", icon: Shield, color: "from-amber-500 to-orange-500" },
                      ]).map(opt => (
                        <button
                          key={opt.type}
                          type="button"
                          onClick={() => setCreateForm(f => ({ ...f, accountType: opt.type }))}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                            createForm.accountType === opt.type
                              ? "border-primary bg-primary/10"
                              : "border-border bg-muted hover:bg-muted/80"
                          }`}
                        >
                          <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${opt.color} flex items-center justify-center mb-2 ${
                            createForm.accountType === opt.type ? "shadow-lg" : "opacity-60"
                          }`}>
                            <opt.icon className="h-5 w-5 text-white" />
                          </div>
                          <span className={`text-sm font-medium ${
                            createForm.accountType === opt.type ? "text-foreground" : "text-muted-foreground"
                          }`}>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Common Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> Email
                      </label>
                      <Input
                        type="email"
                        placeholder="email@exemplo.com"
                        value={createForm.email}
                        onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Senha</label>
                      <Input
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={createForm.password}
                        onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80 flex items-center gap-1">
                        <Users className="h-3 w-3" /> Nome completo
                      </label>
                      <Input
                        placeholder="Ex: João da Silva"
                        value={createForm.full_name}
                        onChange={e => setCreateForm(f => ({ ...f, full_name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Localização
                      </label>
                      <Input
                        placeholder="Ex: Tokyo"
                        value={createForm.location}
                        onChange={e => setCreateForm(f => ({ ...f, location: e.target.value }))}
                      />
                    </div>
                  </div>

                  {createForm.accountType !== 'admin' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> Telefone
                      </label>
                      <Input
                        placeholder="Ex: +81 90-0000-0000"
                        value={createForm.phone}
                        onChange={e => setCreateForm(f => ({ ...f, phone: e.target.value }))}
                      />
                    </div>
                  )}

                  {/* Company-specific fields */}
                  {createForm.accountType === "company" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-border bg-muted/30">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80 flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> Nome da empresa
                        </label>
                        <Input
                          placeholder="Ex: Tech Solutions"
                          value={createForm.company_name}
                          onChange={e => setCreateForm(f => ({ ...f, company_name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Setor</label>
                        <select
                          value={createForm.industry}
                          onChange={e => setCreateForm(f => ({ ...f, industry: e.target.value }))}
                          className="flex h-10 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none"
                        >
                          <option value="" className="bg-background">Selecione...</option>
                          <option value="Tecnologia" className="bg-background">Tecnologia</option>
                          <option value="Indústria" className="bg-background">Indústria</option>
                          <option value="Serviços" className="bg-background">Serviços</option>
                          <option value="Comércio" className="bg-background">Comércio</option>
                          <option value="Design" className="bg-background">Design</option>
                          <option value="Dados" className="bg-background">Dados</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Admin-specific warning */}
                  {createForm.accountType === "admin" && (
                    <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-500">Conta de Administrador</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Esta conta terá acesso total ao painel administrativo, incluindo gerenciamento de todas as contas e conteúdo.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="gradient"
                    className="w-full rounded-full h-12 text-base font-semibold"
                    type="submit"
                    disabled={createLoading}
                  >
                    {createLoading ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Criando conta...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Criar Conta
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════════════ TAB: Anúncios ═══════════════ */}
        {activeTab === "ads" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Edit / New Ad Modal */}
            {editingAd && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <Card className="glass-panel w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-200">
                  <CardHeader className="border-b border-border pb-4">
                    <CardTitle className="text-lg text-foreground flex items-center gap-2">
                      {isNewAd ? <Plus className="h-5 w-5 text-primary" /> : <Edit className="h-5 w-5 text-primary" />}
                      {isNewAd ? 'Novo Anúncio' : 'Editar Anúncio'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Posição</label>
                      <select
                        value={editingAd.position}
                        onChange={e => setEditingAd({ ...editingAd, position: e.target.value })}
                        className="flex h-10 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none"
                      >
                        <option value="homepage_banner" className="bg-background">Homepage Banner</option>
                        <option value="listing_sidebar" className="bg-background">Listing Sidebar</option>
                        <option value="listing_native" className="bg-background">Listing Native</option>
                        <option value="job_detail_sidebar" className="bg-background">Job Detail Sidebar</option>
                        <option value="footer_banner" className="bg-background">Footer Banner</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80 flex items-center justify-between">
                        <span>Imagem do Anúncio</span>
                        <span className="text-[10px] text-muted-foreground uppercase">URL ou Arquivo</span>
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://example.com/image.png"
                          value={editingAd.image}
                          onChange={e => setEditingAd({ ...editingAd, image: e.target.value })}
                          className="flex-1"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            id="ad-file-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  setEditingAd({ ...editingAd, image: reader.result as string })
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-full shrink-0"
                            onClick={() => document.getElementById('ad-file-upload')?.click()}
                            title="Selecionar arquivo"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {editingAd.image && (
                        <div className="h-32 w-full rounded-xl bg-muted overflow-hidden border border-border mt-2 relative group">
                          <img src={editingAd.image} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setEditingAd({ ...editingAd, image: '' })}
                          >
                            <Trash2 className="h-6 w-6 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Link de destino</label>
                      <Input
                        placeholder="https://example.com"
                        value={editingAd.link}
                        onChange={e => setEditingAd({ ...editingAd, link: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Status</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingAd({ ...editingAd, status: 'ativo' })}
                          className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium border-2 transition-all ${
                            editingAd.status === 'ativo'
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                              : 'border-border text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          <CheckCircle2 className="h-4 w-4 inline mr-1" /> Ativo
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAd({ ...editingAd, status: 'inativo' })}
                          className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium border-2 transition-all ${
                            editingAd.status === 'inativo'
                              ? 'border-zinc-500 bg-zinc-500/10 text-zinc-400'
                              : 'border-border text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          <XCircle className="h-4 w-4 inline mr-1" /> Inativo
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingAd(null)}>
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white gap-2"
                        onClick={saveAd}
                        disabled={!editingAd.image || !editingAd.link}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {isNewAd ? 'Criar' : 'Salvar'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card className="glass-panel">
              <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Gerenciador de Anúncios
                </CardTitle>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-2" onClick={openNewAd}>
                  <Plus className="h-4 w-4" />
                  Adicionar anúncio
                </Button>
              </CardHeader>
              <CardContent className="p-0 overflow-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-medium">Posição</th>
                      <th className="px-6 py-4 font-medium">Imagem</th>
                      <th className="px-6 py-4 font-medium">Link</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {ads.map((ad) => (
                      <tr key={ad.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{ad.position}</td>
                        <td className="px-6 py-4">
                          <div className="h-10 w-20 rounded bg-muted overflow-hidden border border-border">
                            <img src={ad.image} alt="Ad preview" className="w-full h-full object-cover opacity-80" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a href={ad.link} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate max-w-[150px] inline-block">
                            {ad.link}
                          </a>
                        </td>
                        <td className="px-6 py-4"><StatusBadge status={ad.status} /></td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toggleAdStatus(ad.id)}
                              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                              title="Alternar status"
                            >
                              {ad.status === 'ativo' ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => openEditAd(ad)}
                              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setConfirmAction({ type: 'delete', id: ad.id, name: `Anúncio ${ad.position}`, action: async () => { deleteAd(ad.id); setConfirmAction(null) } })}
                              className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {ads.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">
                    <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum anúncio cadastrado.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="glass-panel w-full max-w-xl my-8 animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-xl text-foreground flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-primary" />
                  Editar Usuário: {editingUser.full_name}
                </div>
                <Button variant="ghost" size="icon" onClick={() => setEditingUser(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Nome Completo</label>
                  <Input value={editingUser.full_name || ''} onChange={e => setEditingUser({ ...editingUser, full_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Email (Não editável)</label>
                  <Input value={editingUser.email || ''} disabled className="opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Localização</label>
                  <Input value={editingUser.location || ''} onChange={e => setEditingUser({ ...editingUser, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Telefone</label>
                  <Input value={editingUser.phone || ''} onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Tipo de Conta</label>
                  <select value={editingUser.role || ''} onChange={e => setEditingUser({ ...editingUser, role: e.target.value as any })} className="flex h-10 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none">
                    <option value="candidate" className="bg-background">Candidato</option>
                    <option value="company" className="bg-background">Empresa</option>
                    <option value="admin" className="bg-background">Administrador</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Status</label>
                  <select value={editingUser.status || ''} onChange={e => setEditingUser({ ...editingUser, status: e.target.value as any })} className="flex h-10 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none">
                    <option value="active" className="bg-background">Ativo</option>
                    <option value="inactive" className="bg-background">Inativo</option>
                    <option value="suspended" className="bg-background">Suspenso</option>
                  </select>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Biografia</label>
                  <textarea value={editingUser.bio || ''} onChange={e => setEditingUser({ ...editingUser, bio: e.target.value })} rows={3} className="flex min-h-[80px] w-full rounded-2xl border border-border bg-input px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
                </div>
              </div>
            </CardContent>
            <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => setEditingUser(null)}>Cancelar</Button>
              <Button onClick={handleSaveUser} disabled={!editingUser.full_name}>
                <CheckCircle2 className="w-4 h-4 mr-2" /> Salvar Usuário
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Company Modal */}
      {editingCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="glass-panel w-full max-w-xl my-8 animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-xl text-foreground flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-primary" />
                  Editar Empresa: {editingCompany.name}
                </div>
                <Button variant="ghost" size="icon" onClick={() => setEditingCompany(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Nome da Empresa</label>
                  <Input value={editingCompany.name || ''} onChange={e => setEditingCompany({ ...editingCompany, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Setor / Indústria</label>
                  <Input value={editingCompany.industry || ''} onChange={e => setEditingCompany({ ...editingCompany, industry: e.target.value })} />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Website</label>
                  <Input value={editingCompany.website || ''} onChange={e => setEditingCompany({ ...editingCompany, website: e.target.value })} placeholder="https://" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Descrição da Empresa</label>
                  <textarea value={editingCompany.description || ''} onChange={e => setEditingCompany({ ...editingCompany, description: e.target.value })} rows={4} className="flex min-h-[100px] w-full rounded-2xl border border-border bg-input px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Status</label>
                  <select value={editingCompany.status || ''} onChange={e => setEditingCompany({ ...editingCompany, status: e.target.value as any })} className="flex h-10 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none">
                    <option value="active" className="bg-background">Ativo</option>
                    <option value="inactive" className="bg-background">Inativo</option>
                    <option value="suspended" className="bg-background">Suspenso</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => setEditingCompany(null)}>Cancelar</Button>
              <Button onClick={handleSaveCompany} disabled={!editingCompany.name}>
                <CheckCircle2 className="w-4 h-4 mr-2" /> Salvar Empresa
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Application Modal */}
      {editingApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="glass-panel w-full max-w-md my-8 animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-xl text-foreground flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-primary" />
                  Atualizar Candidatura
                </div>
                <Button variant="ghost" size="icon" onClick={() => setEditingApplication(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Candidato</p>
                <p className="font-semibold text-foreground">{editingApplication.user_name}</p>
                <p className="text-xs text-muted-foreground">{editingApplication.user_email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Vaga Aplicada</p>
                <p className="font-semibold text-foreground">{editingApplication.job_title}</p>
                <p className="text-xs text-muted-foreground">{editingApplication.company_name}</p>
              </div>
              
              <div className="space-y-2 pt-4 border-t border-border">
                <label className="text-sm font-medium text-foreground/80">Status da Candidatura</label>
                <select value={editingApplication.status || ''} onChange={e => setEditingApplication({ ...editingApplication, status: e.target.value as any })} className="flex h-12 w-full rounded-2xl border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none">
                  <option value="pending" className="bg-background text-amber-500">Pendente</option>
                  <option value="viewed" className="bg-background text-cyan-500">Visualizada</option>
                  <option value="interview" className="bg-background text-purple-500">Entrevista Marcada</option>
                  <option value="accepted" className="bg-background text-emerald-500">Aprovado (Aceito)</option>
                  <option value="rejected" className="bg-background text-red-500">Rejeitado</option>
                </select>
              </div>
            </CardContent>
            <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => setEditingApplication(null)}>Cancelar</Button>
              <Button onClick={handleSaveApplication}>
                <CheckCircle2 className="w-4 h-4 mr-2" /> Salvar Alterações
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
