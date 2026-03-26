import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import {
  MapPin, Briefcase, Building2, Clock, Globe, GraduationCap,
  ChevronLeft, Share2, BookmarkPlus, ExternalLink, Mail, Phone,
  Linkedin, Instagram, User, Edit2, Check, X, Send, CheckCircle
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { supabase } from "@/src/lib/supabase"
import { useAuth } from "@/src/context/AuthContext"

type TabId = "descricao" | "empresa" | "candidatar"

interface JobDetailData {
  id: string
  title: string
  location: string
  work_mode: string
  job_type: string
  salary_min: number | null
  salary_max: number | null
  salary_tbd: boolean
  description: string
  requirements: string[]
  benefits: string[]
  experience_level: string
  jlpt_level: string | null
  closing_date: string | null
  is_sponsored: boolean
  is_featured: boolean
  views: number
  created_at: string
  companies: {
    id: string
    name: string
    logo_url: string | null
    description: string | null
    website: string | null
    industry: string | null
    email?: string | null
    phone?: string | null
    linkedin?: string | null
    instagram?: string | null
  } | null
}

interface CandidateProfile {
  id: string
  full_name: string
  bio: string | null
  location: string | null
  phone: string | null
  avatar_url: string | null
  completion_percentage: number
}

export function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isCandidate } = useAuth()

  const [job, setJob] = useState<JobDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>("descricao")

  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<CandidateProfile>>({})
  const [savingProfile, setSavingProfile] = useState(false)

  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)

  useEffect(() => {
    async function fetchJob() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*, companies(id, name, logo_url, description, website, industry)')
          .eq('id', id)
          .single()

        if (error) throw error
        if (!data) { setError('Vaga não encontrada'); setLoading(false); return }

        await supabase.from('jobs').update({ views: (data.views || 0) + 1 }).eq('id', id)
        setJob(data)
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar vaga')
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  useEffect(() => {
    if (!user || !id) return
    async function checkApplication() {
      const { data } = await supabase
        .from('applications')
        .select('id')
        .eq('user_id', user!.id)
        .eq('job_id', id!)
        .maybeSingle()
      if (data) setAlreadyApplied(true)
    }
    checkApplication()
  }, [user, id])

  useEffect(() => {
    if (activeTab !== "candidatar" || !user) return
    async function loadProfile() {
      setProfileLoading(true)
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user!.id)
          .maybeSingle()
        if (data) {
          setProfile(data)
          setEditedProfile(data)
        }
      } finally {
        setProfileLoading(false)
      }
    }
    loadProfile()
  }, [activeTab, user])

  const handleTabClick = (tab: TabId) => {
    if (tab === "candidatar" && !user) {
      navigate(`/login?redirect=/vagas/${id}`)
      return
    }
    setActiveTab(tab)
  }

  const handleApplyNow = () => {
    if (!user) { navigate(`/login?redirect=/vagas/${id}`); return }
    setActiveTab("candidatar")
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setSavingProfile(true)
    try {
      await supabase.from('profiles').update(editedProfile).eq('id', user.id)
      setProfile(prev => prev ? { ...prev, ...editedProfile } : null)
      setEditing(false)
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSubmitApplication = async () => {
    if (!user || !id) return
    setApplying(true)
    try {
      await supabase.from('applications').insert({ user_id: user.id, job_id: id, status: 'pending' })
      setApplied(true)
      setAlreadyApplied(true)
    } catch (err) {
      console.error('Erro ao candidatar:', err)
    } finally {
      setApplying(false)
    }
  }

  const formatSalary = (min: number | null, max: number | null, tbd: boolean) => {
    if (tbd || (!min && !max)) return 'A combinar'
    const fmt = (n: number) => `¥${(n / 10000).toFixed(0)}M`
    if (min && max) return `${fmt(min)} - ${fmt(max)}`
    if (min) return `A partir de ${fmt(min)}`
    return `Até ${fmt(max!)}`
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  if (loading) return (
    <div className="container mx-auto max-w-7xl px-4 py-8 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        <p className="text-muted-foreground">Carregando vaga...</p>
      </div>
    </div>
  )

  if (error || !job) return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="text-center py-12">
        <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-bold mb-2">Vaga não encontrada</h2>
        <p className="text-muted-foreground mb-6">{error || 'A vaga solicitada não existe ou foi removida.'}</p>
        <Link to="/vagas"><Button variant="outline"><ChevronLeft className="h-4 w-4 mr-2" />Voltar para vagas</Button></Link>
      </div>
    </div>
  )

  const tabs: { id: TabId; label: string }[] = [
    { id: "descricao", label: "Descrição da Vaga" },
    { id: "empresa", label: "Sobre a Empresa" },
    { id: "candidatar", label: "Como se Candidatar" },
  ]

  const company = job.companies

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" size="sm" className="mb-6 rounded-full text-muted-foreground hover:text-foreground" asChild>
        <Link to="/vagas"><ChevronLeft className="mr-2 h-4 w-4" /> Voltar para vagas</Link>
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header card */}
          <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
              {company?.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="h-20 w-20 rounded-xl border border-border object-contain bg-white/5 shrink-0" />
              ) : (
                <div className="h-20 w-20 rounded-xl bg-muted border border-border flex items-center justify-center text-3xl font-bold text-foreground shrink-0">
                  {company?.name ? getInitials(company.name) : 'XX'}
                </div>
              )}
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
                    <div className="flex items-center text-lg text-primary font-medium">
                      <Building2 className="mr-2 h-5 w-5" />
                      {company?.id
                        ? <Link to={`/empresa/${company.id}`} className="hover:underline">{company.name}</Link>
                        : company?.name || 'Empresa'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full border-border bg-muted"><Share2 className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" className="rounded-full border-border bg-muted"><BookmarkPlus className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-y-3 gap-x-6 mt-6 p-4 rounded-2xl bg-muted border border-border">
                  <div className="flex items-center text-sm text-foreground/80">
                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                    <div><p className="text-xs text-muted-foreground uppercase tracking-wider">Localização</p><p className="font-medium">{job.location}</p></div>
                  </div>
                  <div className="flex items-center text-sm text-foreground/80">
                    <Briefcase className="mr-2 h-5 w-5 text-primary" />
                    <div><p className="text-xs text-muted-foreground uppercase tracking-wider">Salário</p><p className="font-medium">{formatSalary(job.salary_min, job.salary_max, job.salary_tbd)}</p></div>
                  </div>
                  <div className="flex items-center text-sm text-foreground/80">
                    <Clock className="mr-2 h-5 w-5 text-primary" />
                    <div><p className="text-xs text-muted-foreground uppercase tracking-wider">Contrato</p><p className="font-medium">{job.job_type}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── TAB: Descrição da Vaga ── */}
          {activeTab === "descricao" && (
            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Sobre a Vaga</h2>
                <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{job.description}</div>
              </section>
              {job.requirements?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Requisitos</h2>
                  <ul className="list-disc pl-5 text-foreground/80 space-y-2">
                    {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
                  </ul>
                </section>
              )}
              {job.benefits?.length > 0 && (
                <section className="glass-panel p-6 rounded-2xl border-border bg-muted/30">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Benefícios</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {job.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/20 text-primary"><Briefcase className="h-5 w-5" /></div>
                        <span className="text-foreground/80">{b}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ── TAB: Sobre a Empresa ── */}
          {activeTab === "empresa" && (
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-6 border-border space-y-4">
                <div className="flex items-center gap-4">
                  {company?.logo_url ? (
                    <img src={company.logo_url} alt={company.name} className="h-16 w-16 rounded-xl border border-border object-contain" />
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-muted border border-border flex items-center justify-center text-xl font-bold text-primary">
                      {company?.name ? getInitials(company.name) : 'XX'}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{company?.name}</h2>
                    {company?.industry && <Badge variant="secondary" className="mt-1">{company.industry}</Badge>}
                  </div>
                </div>
                {company?.description && (
                  <p className="text-foreground/80 leading-relaxed">{company.description}</p>
                )}
              </div>

              {/* Contact info */}
              <div className="glass-panel rounded-2xl p-6 border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Formas de Contato</h3>
                <div className="space-y-3">
                  {company?.email && (
                    <a href={`mailto:${company.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors group">
                      <div className="p-2 rounded-lg bg-primary/20 text-primary"><Mail className="h-5 w-5" /></div>
                      <div>
                        <p className="text-xs text-muted-foreground">E-mail</p>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{company.email}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                    </a>
                  )}
                  {company?.phone && (
                    <a href={`tel:${company.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors group">
                      <div className="p-2 rounded-lg bg-green-500/20 text-green-500"><Phone className="h-5 w-5" /></div>
                      <div>
                        <p className="text-xs text-muted-foreground">Telefone</p>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{company.phone}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                    </a>
                  )}
                  {company?.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors group">
                      <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500"><Globe className="h-5 w-5" /></div>
                      <div>
                        <p className="text-xs text-muted-foreground">Website</p>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{company.website.replace(/^https?:\/\//, '')}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                    </a>
                  )}
                  {company?.linkedin && (
                    <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors group">
                      <div className="p-2 rounded-lg bg-blue-600/20 text-blue-600"><Linkedin className="h-5 w-5" /></div>
                      <div>
                        <p className="text-xs text-muted-foreground">LinkedIn</p>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Ver perfil no LinkedIn</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                    </a>
                  )}
                  {company?.instagram && (
                    <a href={`https://instagram.com/${company.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors group">
                      <div className="p-2 rounded-lg bg-pink-500/20 text-pink-500"><Instagram className="h-5 w-5" /></div>
                      <div>
                        <p className="text-xs text-muted-foreground">Instagram</p>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{company.instagram}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                    </a>
                  )}
                  {!company?.email && !company?.phone && !company?.website && !company?.linkedin && !company?.instagram && (
                    <p className="text-muted-foreground text-sm">Nenhuma informação de contato cadastrada.</p>
                  )}
                </div>
              </div>

              {company?.id && (
                <Link to={`/empresa/${company.id}`}>
                  <Button variant="outline" className="w-full rounded-full border-border">Ver Perfil Completo da Empresa</Button>
                </Link>
              )}
            </div>
          )}

          {/* ── TAB: Como se Candidatar ── */}
          {activeTab === "candidatar" && (
            <div className="space-y-6">
              {!user ? (
                <div className="glass-panel rounded-2xl p-8 border-border text-center">
                  <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Faça login para se candidatar</h3>
                  <p className="text-muted-foreground mb-6">Você precisa estar logado para enviar sua candidatura.</p>
                  <Button variant="gradient" asChild className="rounded-full px-8">
                    <Link to={`/login?redirect=/vagas/${id}`}>Entrar / Cadastrar</Link>
                  </Button>
                </div>
              ) : applied || alreadyApplied ? (
                <div className="glass-panel rounded-2xl p-8 border-border text-center">
                  <CheckCircle className="h-14 w-14 mx-auto mb-4 text-green-500" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Candidatura Enviada!</h3>
                  <p className="text-muted-foreground mb-6">Sua candidatura foi registrada. A empresa entrará em contato pelos canais abaixo.</p>
                  {/* Contact buttons after applying */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
                    {company?.email && (
                      <a href={`mailto:${company.email}?subject=Candidatura: ${job.title}&body=Olá, me candidatei para a vaga de ${job.title} e gostaria de confirmar o recebimento.`}>
                        <Button variant="outline" className="rounded-full gap-2"><Mail className="h-4 w-4" />Enviar E-mail</Button>
                      </a>
                    )}
                    {company?.phone && (
                      <a href={`tel:${company.phone}`}>
                        <Button variant="outline" className="rounded-full gap-2"><Phone className="h-4 w-4" />Ligar</Button>
                      </a>
                    )}
                    {company?.linkedin && (
                      <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="rounded-full gap-2"><Linkedin className="h-4 w-4" />LinkedIn</Button>
                      </a>
                    )}
                    {company?.website && (
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="rounded-full gap-2"><Globe className="h-4 w-4" />Website</Button>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Profile card */}
                  <div className="glass-panel rounded-2xl p-6 border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">Seus Dados</h3>
                      {!editing ? (
                        <Button variant="ghost" size="sm" className="gap-2 rounded-full" onClick={() => { setEditing(true); setEditedProfile(profile || {}) }}>
                          <Edit2 className="h-4 w-4" /> Editar
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="rounded-full text-green-500" onClick={handleSaveProfile} disabled={savingProfile}>
                            <Check className="h-4 w-4" /> {savingProfile ? 'Salvando...' : 'Salvar'}
                          </Button>
                          <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground" onClick={() => setEditing(false)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {profileLoading ? (
                      <div className="space-y-3 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted rounded-xl" />)}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wider">Nome completo</label>
                          {editing ? (
                            <input
                              className="w-full mt-1 bg-muted border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                              value={editedProfile.full_name || ''}
                              onChange={e => setEditedProfile(p => ({ ...p, full_name: e.target.value }))}
                            />
                          ) : (
                            <p className="mt-1 text-foreground font-medium">{profile?.full_name || <span className="text-muted-foreground italic">Não informado</span>}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wider">Localização</label>
                          {editing ? (
                            <input
                              className="w-full mt-1 bg-muted border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                              value={editedProfile.location || ''}
                              onChange={e => setEditedProfile(p => ({ ...p, location: e.target.value }))}
                              placeholder="Ex: Tokyo, Japão"
                            />
                          ) : (
                            <p className="mt-1 text-foreground">{profile?.location || <span className="text-muted-foreground italic">Não informado</span>}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wider">Telefone</label>
                          {editing ? (
                            <input
                              className="w-full mt-1 bg-muted border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                              value={editedProfile.phone || ''}
                              onChange={e => setEditedProfile(p => ({ ...p, phone: e.target.value }))}
                              placeholder="+55 11 99999-9999"
                            />
                          ) : (
                            <p className="mt-1 text-foreground">{profile?.phone || <span className="text-muted-foreground italic">Não informado</span>}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wider">Apresentação</label>
                          {editing ? (
                            <textarea
                              rows={3}
                              className="w-full mt-1 bg-muted border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                              value={editedProfile.bio || ''}
                              onChange={e => setEditedProfile(p => ({ ...p, bio: e.target.value }))}
                              placeholder="Escreva uma breve apresentação sobre você..."
                            />
                          ) : (
                            <p className="mt-1 text-foreground/80 text-sm leading-relaxed">{profile?.bio || <span className="text-muted-foreground italic">Não informado</span>}</p>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">E-mail da conta: <span className="text-foreground">{user.email}</span></p>
                      </div>
                    )}
                  </div>

                  {/* Contact methods of company */}
                  {(company?.email || company?.phone || company?.linkedin || company?.website) && (
                    <div className="glass-panel rounded-2xl p-6 border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Contatos da Empresa</h3>
                      <p className="text-sm text-muted-foreground mb-4">Após enviar sua candidatura, você pode entrar em contato direto com a empresa:</p>
                      <div className="flex flex-wrap gap-3">
                        {company?.email && (
                          <a href={`mailto:${company.email}?subject=Candidatura: ${job.title}&body=Olá, tenho interesse na vaga de ${job.title}.`}>
                            <Button variant="outline" size="sm" className="rounded-full gap-2"><Mail className="h-4 w-4" />E-mail</Button>
                          </a>
                        )}
                        {company?.phone && (
                          <a href={`tel:${company.phone}`}>
                            <Button variant="outline" size="sm" className="rounded-full gap-2"><Phone className="h-4 w-4" />Ligar</Button>
                          </a>
                        )}
                        {company?.linkedin && (
                          <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="rounded-full gap-2"><Linkedin className="h-4 w-4" />LinkedIn</Button>
                          </a>
                        )}
                        {company?.instagram && (
                          <a href={`https://instagram.com/${company.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="rounded-full gap-2"><Instagram className="h-4 w-4" />Instagram</Button>
                          </a>
                        )}
                        {company?.website && (
                          <a href={company.website} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="rounded-full gap-2"><Globe className="h-4 w-4" />Website</Button>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Submit button */}
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full rounded-full h-14 text-lg font-semibold shadow-lg shadow-primary/25 gap-2"
                    onClick={handleSubmitApplication}
                    disabled={applying}
                  >
                    <Send className="h-5 w-5" />
                    {applying ? 'Enviando...' : 'Enviar Candidatura'}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sticky top-24">
            <Button
              variant="gradient"
              size="lg"
              className="w-full rounded-full h-14 text-lg font-semibold mb-6 shadow-lg shadow-primary/25"
              onClick={handleApplyNow}
            >
              {alreadyApplied ? '✓ Candidatura Enviada' : 'Candidatar-se Agora'}
            </Button>

            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-1">Publicado em</p>
              <p className="font-medium text-foreground">{formatDate(job.created_at)}</p>
            </div>

            <hr className="border-border mb-6" />
            <h3 className="font-semibold text-foreground mb-4">Resumo da Empresa</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Setor</p>
                  <p className="text-sm font-medium text-foreground">{company?.industry || 'Não informado'}</p>
                </div>
              </div>
              {company?.description && (
                <div className="text-sm text-muted-foreground line-clamp-3">{company.description}</div>
              )}
              {company?.website && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Website</p>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline flex items-center">
                      {company.website.replace(/^https?:\/\//, '')} <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {company?.id && (
              <Link to={`/empresa/${company.id}`}>
                <Button variant="outline" className="w-full rounded-full mt-6 border-border bg-muted hover:bg-muted/80">Ver Perfil da Empresa</Button>
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
