import { useState, useEffect, useRef } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import {
  MapPin, Briefcase, Building2, Clock, Globe, GraduationCap,
  ChevronLeft, Share2, BookmarkPlus, ExternalLink, Mail, Phone,
  Linkedin, Instagram, User, Send, CheckCircle, AlertCircle, Edit2,
  Copy, Check as CheckIcon, MessageCircle
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { supabase } from "@/src/lib/supabase"
import { useAuth } from "@/src/context/AuthContext"
import {
  CandidateProfileFull, getMissingRequiredFields,
  JLPT_LEVELS, VISA_TYPES, RELOCATION_OPTIONS, CALL_TIME_OPTIONS
} from "@/src/lib/profileData"

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

type CandidateProfile = CandidateProfileFull & { id: string }

function ProfileRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-foreground font-medium">
        {value || <span className="italic text-red-400 font-normal">Não preenchido</span>}
      </p>
    </div>
  )
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

  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)

  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
        setShowShareMenu(false)
      }
    }
    if (showShareMenu) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showShareMenu])

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
        if (data) setProfile(data)
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
    const fmt = (n: number) => `¥${n.toLocaleString('pt-BR')}`
    if (min && max) return `${fmt(min)} ~ ${fmt(max)}/mês`
    if (min) return `A partir de ${fmt(min)}/mês`
    return `Até ${fmt(max!)}/mês`
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
                    {/* ── Share button ── */}
                    <div className="relative" ref={shareMenuRef}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-border bg-muted"
                        onClick={() => setShowShareMenu(v => !v)}
                        title="Compartilhar vaga"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>

                      {showShareMenu && (
                        <div className="absolute left-0 top-12 z-50 w-64 glass-panel rounded-2xl border border-border shadow-xl p-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider px-2 pb-1">Compartilhar vaga</p>

                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(`Olha essa vaga no KiboJobs: ${job?.title}\n${window.location.href}`)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors"
                            onClick={() => setShowShareMenu(false)}
                          >
                            <div className="h-8 w-8 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0">
                              <svg className="h-4 w-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.125 1.526 5.855L.057 23.526a.75.75 0 00.918.918l5.682-1.47A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.712 9.712 0 01-4.95-1.35l-.356-.212-3.69.954.974-3.583-.231-.368A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
                            </div>
                            <span className="text-sm font-medium text-foreground">WhatsApp</span>
                          </a>

                          {/* Line */}
                          <a
                            href={`https://line.me/R/msg/text/?${encodeURIComponent(`${job?.title} — KiboJobs\n${window.location.href}`)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors"
                            onClick={() => setShowShareMenu(false)}
                          >
                            <div className="h-8 w-8 rounded-full bg-[#00B900]/20 flex items-center justify-center shrink-0">
                              <svg className="h-4 w-4 text-[#00B900]" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.63 0 .344-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.628-.63.628H16.98c-.348 0-.629-.283-.629-.628V8.108c0-.345.281-.63.63-.63h2.385c.348 0 .629.285.629.63 0 .349-.281.63-.629.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.628-.631.628-.346 0-.626-.283-.626-.628V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.628-.631.628-.345 0-.627-.283-.627-.628V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.283-.63-.628V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.628-.629.628M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
                            </div>
                            <span className="text-sm font-medium text-foreground">Line</span>
                          </a>

                          {/* Facebook */}
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors"
                            onClick={() => setShowShareMenu(false)}
                          >
                            <div className="h-8 w-8 rounded-full bg-[#1877F2]/20 flex items-center justify-center shrink-0">
                              <svg className="h-4 w-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </div>
                            <span className="text-sm font-medium text-foreground">Facebook</span>
                          </a>

                          {/* Instagram — copy link */}
                          <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left"
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href)
                              setCopied(true)
                              setTimeout(() => setCopied(false), 2000)
                            }}
                          >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#f09433]/20 via-[#e6683c]/20 to-[#bc1888]/20 flex items-center justify-center shrink-0">
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="url(#igGrad)"><defs><linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="25%" stopColor="#e6683c"/><stop offset="50%" stopColor="#dc2743"/><stop offset="75%" stopColor="#cc2366"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-foreground">Instagram</span>
                              <p className="text-xs text-muted-foreground">Copiar link para colar</p>
                            </div>
                          </button>

                          {/* TikTok — copy link */}
                          <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left"
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href)
                              setCopied(true)
                              setTimeout(() => setCopied(false), 2000)
                            }}
                          >
                            <div className="h-8 w-8 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
                              <svg className="h-4 w-4 text-foreground" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.84 4.84 0 01-1.01-.06z"/></svg>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-foreground">TikTok</span>
                              <p className="text-xs text-muted-foreground">Copiar link para colar</p>
                            </div>
                          </button>

                          {/* SMS */}
                          <a
                            href={`sms:?body=${encodeURIComponent(`Veja essa vaga no KiboJobs: ${job?.title}\n${window.location.href}`)}`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors"
                            onClick={() => setShowShareMenu(false)}
                          >
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <MessageCircle className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-foreground">SMS</span>
                          </a>

                          {/* Copiar link */}
                          <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left border-t border-border mt-1 pt-2"
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href)
                              setCopied(true)
                              setTimeout(() => { setCopied(false); setShowShareMenu(false) }, 2000)
                            }}
                          >
                            <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                              {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {copied ? "Link copiado!" : "Copiar link"}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>

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
          <div className="grid grid-cols-3 border-b border-border">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-4 text-sm font-medium text-center transition-colors border-b-2 ${
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
                  {profileLoading ? (
                    <div className="space-y-3 animate-pulse">
                      {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-xl" />)}
                    </div>
                  ) : (() => {
                    const missingFields = getMissingRequiredFields(profile || {})
                    const canApply = missingFields.length === 0

                    return (
                      <>
                        {/* Alerta de campos faltando */}
                        {!canApply && (
                          <div className="flex items-start gap-3 p-5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                            <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-semibold text-foreground mb-1">Perfil incompleto — não é possível candidatar ainda</p>
                              <p className="text-sm text-muted-foreground mb-3">
                                Complete os campos obrigatórios antes de enviar sua candidatura:
                              </p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {missingFields.map(f => (
                                  <span key={f} className="text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 rounded-full px-2 py-0.5">{f}</span>
                                ))}
                              </div>
                              <Button variant="outline" size="sm" className="rounded-full border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/10 gap-2" asChild>
                                <Link to="/dashboard?tab=profile"><Edit2 className="h-3.5 w-3.5" />Completar meu perfil</Link>
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Resumo do perfil */}
                        <div className="glass-panel rounded-2xl p-6 border-border">
                          <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-semibold text-foreground">Dados que serão enviados</h3>
                            <Button variant="ghost" size="sm" className="gap-1.5 rounded-full text-muted-foreground" asChild>
                              <Link to="/dashboard?tab=profile"><Edit2 className="h-3.5 w-3.5" />Editar perfil</Link>
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ProfileRow label="Nome" value={profile?.full_name} />
                            <ProfileRow label="Data de Nascimento"
                              value={profile?.birth_date
                                ? new Date(profile.birth_date + "T00:00:00").toLocaleDateString("pt-BR")
                                : null} />
                            <ProfileRow label="E-mail" value={user?.email} />
                            <ProfileRow label="Telefone" value={profile?.phone} />
                            {profile?.whatsapp && <ProfileRow label="WhatsApp" value={profile.whatsapp} />}
                            <ProfileRow label="Melhor horário p/ ligar"
                              value={CALL_TIME_OPTIONS.find(o => o.value === profile?.best_call_time)?.label} />
                            <ProfileRow label="Cidade" value={profile?.city} />
                            <ProfileRow label="Província" value={profile?.province} />
                            <ProfileRow label="Sexo"
                              value={profile?.gender === "masculino" ? "Masculino" : profile?.gender === "feminino" ? "Feminino" : profile?.gender} />
                            <ProfileRow label="Pode mudar?"
                              value={RELOCATION_OPTIONS.find(o => o.value === profile?.can_relocate)?.label} />
                            <ProfileRow label="Nível de Japonês"
                              value={JLPT_LEVELS.find(l => l.value === profile?.jlpt_level)?.label ?? profile?.jlpt_level} />
                            <ProfileRow label="Tipo de Visto"
                              value={profile?.visa_type === "outros"
                                ? `Outros: ${profile.visa_other || "—"}`
                                : VISA_TYPES.find(v => v.value === profile?.visa_type)?.label ?? profile?.visa_type} />
                            <ProfileRow label="Nacionalidade" value={profile?.nationality} />
                          </div>

                          {profile?.bio && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Apresentação Pessoal</p>
                              <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{profile.bio}</p>
                            </div>
                          )}
                        </div>

                        {/* Contatos da empresa */}
                        {(company?.email || company?.phone || company?.linkedin || company?.website) && (
                          <div className="glass-panel rounded-2xl p-6 border-border">
                            <h3 className="text-lg font-semibold text-foreground mb-3">Contatos da Empresa</h3>
                            <p className="text-sm text-muted-foreground mb-4">Após enviar sua candidatura, entre em contato direto com a empresa:</p>
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

                        {/* Botão candidatar */}
                        {canApply ? (
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
                        ) : (
                          <Button variant="outline" size="lg" className="w-full rounded-full h-14 text-lg font-semibold gap-2" asChild>
                            <Link to="/dashboard?tab=profile">
                              <Edit2 className="h-5 w-5" />
                              Completar perfil para candidatar
                            </Link>
                          </Button>
                        )}
                      </>
                    )
                  })()}
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
