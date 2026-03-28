import React, { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import {
  LayoutDashboard, User, Settings, LogOut, Briefcase,
  CheckCircle2, Circle, Send, Clock, Building2, MapPin,
  Edit2, Save, X, Camera, Phone, FileText, AlertCircle,
  Calendar, Globe2, ShieldCheck, Languages, Car, Bookmark, ExternalLink
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { supabase } from "@/src/lib/supabase"
import { useAuth } from "../context/AuthContext"
import {
  CandidateProfileFull, calcProfileCompletion, getMissingRequiredFields,
  JAPAN_PROVINCES, JLPT_LEVELS, VISA_TYPES, RELOCATION_OPTIONS, CALL_TIME_OPTIONS
} from "@/src/lib/profileData"

interface SavedJobData {
  id: string
  title: string
  location: string | null
  job_type: string | null
  salary_min: number | null
  salary_max: number | null
  companies: { name: string; logo_url: string | null } | null
}

interface ApplicationWithJob {
  id: string
  status: string
  applied_at: string
  jobs: {
    id: string
    title: string
    location: string
    job_type: string
    companies: { name: string; logo_url: string | null } | null
  } | null
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Bom dia"
  if (h < 18) return "Boa tarde"
  return "Boa noite"
}

function getInitials(name: string | null) {
  if (!name) return "?"
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:   { label: "Enviada",         color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
  viewed:    { label: "Visualizada",     color: "bg-blue-500/20 text-blue-500 border-blue-500/30" },
  interview: { label: "Entrevista",      color: "bg-purple-500/20 text-purple-500 border-purple-500/30" },
  accepted:  { label: "Aceita",          color: "bg-green-500/20 text-green-500 border-green-500/30" },
  rejected:  { label: "Não selecionado", color: "bg-red-500/20 text-red-500 border-red-500/30" },
}

const REQUIRED_LABELS: Record<string, string> = {
  full_name: "Nome Completo",
  birth_date: "Data de Nascimento",
  phone: "Telefone",
  city: "Cidade",
  province: "Província",
  gender: "Sexo",
  can_relocate: "Disponibilidade p/ mudança",
  jlpt_level: "Nível de Japonês",
  nationality: "Nacionalidade",
  visa_type: "Tipo de Visto",
}

// ─── Shared field renderer ───────────────────────────────────────────────────

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-foreground">{value || <span className="italic text-muted-foreground">Não preenchido</span>}</p>
    </div>
  )
}

function TextInput({ label, required, value, placeholder, onChange }: {
  label: string; required?: boolean; value: string;
  placeholder?: string; onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

function SelectInput({ label, required, value, options, onChange }: {
  label: string; required?: boolean; value: string;
  options: { value: string; label: string }[]; onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <select
        className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Selecione...</option>
        {options.map(o => <option key={o.value} value={o.value} className="bg-background">{o.label}</option>)}
      </select>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Dashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, signOut } = useAuth()

  const [profile, setProfile] = useState<CandidateProfileFull | null>(null)
  const [applications, setApplications] = useState<ApplicationWithJob[]>([])
  const [totalJobs, setTotalJobs] = useState(0)
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview")
  const [loading, setLoading] = useState(true)

  const STORAGE_KEY = "kibojobs_saved"
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") } catch { return [] }
  })
  const [savedJobsData, setSavedJobsData] = useState<SavedJobData[]>([])
  const [savedLoading, setSavedLoading] = useState(false)

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Partial<CandidateProfileFull>>({})
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    async function fetchAll() {
      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user!.id)
          .maybeSingle()
        setProfile(profileData || null)

        const { data: appsData } = await supabase
          .from("applications")
          .select("id, status, applied_at, jobs(id, title, location, job_type, companies(name, logo_url))")
          .eq("user_id", user!.id)
          .order("applied_at", { ascending: false })
        setApplications((appsData as any) || [])

        const { count } = await supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
        setTotalJobs(count || 0)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [user])

  useEffect(() => {
    if (savedJobIds.length === 0) { setSavedJobsData([]); return }
    setSavedLoading(true)
    supabase
      .from("jobs")
      .select("id, title, location, job_type, salary_min, salary_max, companies(name, logo_url)")
      .in("id", savedJobIds)
      .then(({ data }) => { setSavedJobsData((data as any) || []) })
      .finally(() => setSavedLoading(false))
  }, [savedJobIds])

  function removeSaved(jobId: string) {
    setSavedJobIds(prev => {
      const next = prev.filter(id => id !== jobId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  function loadImageForCrop(file: File) {
    setUploadError(null)
    const reader = new FileReader()
    reader.onload = e => setCropSrc(e.target!.result as string)
    reader.onerror = () => setUploadError("Erro ao ler o arquivo. Tente outro.")
    reader.readAsDataURL(file)
  }

  function handleCropConfirm(dataUrl: string) {
    setDraft(d => ({ ...d, avatar_url: dataUrl }))
    setCropSrc(null)
  }

  const startEditing = () => {
    setDraft({ ...(profile || {}) })
    setEditing(true)
    setSaveSuccess(false)
  }

  const cancelEditing = () => { setEditing(false); setDraft({}) }

  const saveProfile = async () => {
    if (!user) return
    setSaving(true)
    try {
      const completion = calcProfileCompletion(draft)
      const payload = { ...draft, completion_percentage: completion }
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...payload }, { onConflict: "id" })
      if (error) throw error
      setProfile(prev => ({ ...(prev || {} as CandidateProfileFull), ...payload, completion_percentage: completion }))
      setEditing(false)
      setDraft({})
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 4000)
    } catch (err) {
      console.error("Erro ao salvar:", err)
    } finally {
      setSaving(false)
    }
  }

  const set = (field: keyof CandidateProfileFull) => (v: string) =>
    setDraft(d => ({ ...d, [field]: v || null }))

  const val = (field: keyof CandidateProfileFull): string =>
    (draft[field] as string) ?? ""

  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "você"
  const completion = profile ? calcProfileCompletion(profile) : 0
  const missing = profile ? getMissingRequiredFields(profile) : Object.values(REQUIRED_LABELS)

  const requiredItems = Object.entries(REQUIRED_LABELS).map(([key, label]) => ({
    label,
    done: !!(profile?.[key as keyof CandidateProfileFull] &&
      String(profile[key as keyof CandidateProfileFull]).trim())
  }))

  const tabs = [
    { id: "overview",     label: "Visão geral",   icon: LayoutDashboard },
    { id: "applications", label: "Candidaturas",  icon: Send, count: applications.length },
    { id: "saved",        label: "Favoritos",     icon: Bookmark, count: savedJobIds.length },
    { id: "profile",      label: "Meu perfil",    icon: User },
    { id: "settings",     label: "Configurações", icon: Settings },
  ]

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">

        {/* ── Sidebar ── */}
        <aside className="w-full md:w-[240px] shrink-0">
          <div className="glass-panel rounded-2xl p-6 border-border sticky top-24">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-20 w-20 rounded-full border-2 border-primary/40 mb-4 overflow-hidden flex items-center justify-center bg-muted shadow-sm">
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  : <span className="text-2xl font-bold text-primary">{getInitials(profile?.full_name ?? null)}</span>
                }
              </div>
              <h3 className="font-semibold text-lg text-foreground leading-tight">
                {profile?.full_name || <span className="text-muted-foreground italic text-sm">Sem nome</span>}
              </h3>
              {profile?.province && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
                  <MapPin className="h-3 w-3" />{profile.city ? `${profile.city}, ` : ""}{profile.province}
                </p>
              )}
              <div className="mt-2 w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${completion}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{completion}% completo</p>
            </div>

            <nav className="space-y-2">
              {tabs.map(({ id, label, icon: Icon, count }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === id
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                  {count !== undefined && count > 0 && (
                    <Badge variant="glass" className="ml-auto bg-muted text-foreground text-xs">{count}</Badge>
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-border">
              <button onClick={async () => { await signOut(); navigate("/login") }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 min-w-0">

          {/* ══ VISÃO GERAL ══ */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">{getGreeting()}, {firstName}!</h1>
                <p className="text-muted-foreground">Aqui está o resumo das suas atividades.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard icon={Send} color="primary" label="Candidaturas" value={loading ? "—" : applications.length} />
                <StatCard icon={Briefcase} color="emerald" label="Vagas disponíveis" value={loading ? "—" : totalJobs} />
                <StatCard
                  icon={Bookmark} color="primary" label="Favoritos" value={savedJobIds.length}
                  onClick={() => setActiveTab("saved")}
                />
                <StatCard icon={User} color="primary" label="Perfil completo" value={loading ? "—" : `${completion}%`} />
              </div>

              {/* Alerta de perfil incompleto */}
              {!loading && missing.length > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-1">Perfil incompleto — {missing.length} campo(s) obrigatório(s) faltando</p>
                    <p className="text-xs text-muted-foreground mb-2">Campos obrigatórios para se candidatar: {missing.slice(0, 4).join(", ")}{missing.length > 4 ? ` e mais ${missing.length - 4}...` : ""}</p>
                    <Button variant="outline" size="sm" className="rounded-full border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                      onClick={() => { setActiveTab("profile"); startEditing() }}>
                      Completar agora
                    </Button>
                  </div>
                </div>
              )}

              {/* Completion card */}
              <div className="glass-panel rounded-2xl p-6 md:p-8 border-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">Complete seu perfil</h2>
                      <p className="text-sm text-muted-foreground">Perfis completos recebem mais atenção dos recrutadores.</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-primary font-medium">{completion}% concluído</span>
                        <span className="text-muted-foreground">{missing.length} campo(s) restante(s)</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${completion}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-72 bg-muted p-4 rounded-xl border border-border">
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      {requiredItems.map(({ label, done }) => (
                        <div key={label} className="flex items-center gap-2 text-sm">
                          {done
                            ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />}
                          <span className={done ? "text-muted-foreground line-through" : "text-foreground"}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {completion < 100 && (
                  <div className="mt-4 relative z-10">
                    <Button variant="outline" size="sm" className="rounded-full"
                      onClick={() => { setActiveTab("profile"); startEditing() }}>
                      Completar perfil agora
                    </Button>
                  </div>
                )}
              </div>

              {/* Candidaturas recentes */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Candidaturas Recentes</h2>
                  {applications.length > 3 && (
                    <Button variant="link" className="text-primary p-0 h-auto" onClick={() => setActiveTab("applications")}>Ver todas</Button>
                  )}
                </div>
                <ApplicationList applications={applications.slice(0, 3)} loading={loading} />
              </div>
            </div>
          )}

          {/* ══ CANDIDATURAS ══ */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Minhas Candidaturas</h1>
                <p className="text-muted-foreground">{applications.length} candidatura(s) no total.</p>
              </div>
              <ApplicationList applications={applications} loading={loading} />
            </div>
          )}

          {/* ══ FAVORITOS ══ */}
          {activeTab === "saved" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Vagas Favoritas</h1>
                <p className="text-muted-foreground">{savedJobIds.length} vaga(s) salva(s).</p>
              </div>

              {savedLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />)}
                </div>
              ) : savedJobsData.length === 0 ? (
                <div className="glass-panel rounded-xl p-10 border-border text-center">
                  <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Bookmark className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Nenhuma vaga salva</h3>
                  <p className="text-muted-foreground mb-5 text-sm">Clique no ícone de favorito em qualquer vaga para salvá-la aqui.</p>
                  <Button variant="outline" className="rounded-full border-border" asChild>
                    <Link to="/vagas">Explorar Vagas</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedJobsData.map(job => {
                    const initials = job.companies?.name
                      ? job.companies.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
                      : "?"
                    const salary = job.salary_min && job.salary_max
                      ? `¥${job.salary_min.toLocaleString("pt-BR")} ~ ¥${job.salary_max.toLocaleString("pt-BR")}/mês`
                      : null
                    return (
                      <div key={job.id} className="glass-panel rounded-xl p-5 border-border flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 border border-border flex items-center justify-center text-sm font-bold text-primary shrink-0 overflow-hidden">
                          {job.companies?.logo_url
                            ? <img src={job.companies.logo_url} alt="" className="h-full w-full object-contain" />
                            : initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link to={`/vagas/${job.id}`} className="text-base font-semibold text-foreground hover:text-primary transition-colors truncate block">
                            {job.title}
                          </Link>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                            {job.companies?.name && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.companies.name}</span>}
                            {job.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>}
                            {salary && <span className="text-primary font-medium">{salary}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs" asChild>
                            <Link to={`/vagas/${job.id}`}><ExternalLink className="h-3.5 w-3.5" />Ver vaga</Link>
                          </Button>
                          <button
                            onClick={() => removeSaved(job.id)}
                            title="Remover dos favoritos"
                            className="h-8 w-8 rounded-full flex items-center justify-center border border-border bg-muted hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-muted-foreground transition-colors"
                          >
                            <Bookmark className="h-4 w-4 fill-current" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══ MEU PERFIL ══ */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Meu Perfil</h1>
                  <p className="text-muted-foreground text-sm">
                    Dados enviados às empresas ao se candidatar. Campos com <span className="text-red-400">*</span> são obrigatórios.
                  </p>
                </div>
                {!editing ? (
                  <Button variant="outline" className="rounded-full gap-2 shrink-0" onClick={startEditing}>
                    <Edit2 className="h-4 w-4" /> Editar
                  </Button>
                ) : (
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" className="rounded-full gap-2 text-muted-foreground" onClick={cancelEditing} disabled={saving}>
                      <X className="h-4 w-4" /> Cancelar
                    </Button>
                    <Button variant="gradient" className="rounded-full gap-2" onClick={saveProfile} disabled={saving}>
                      <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                )}
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  Perfil atualizado! Os dados serão enviados nas próximas candidaturas.
                </div>
              )}

              {/* ── Seção: Foto de Perfil ── */}
              <ProfileSection icon={<Camera className="h-5 w-5 text-primary" />} title="Foto de Perfil">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Avatar preview */}
                  <div className="relative shrink-0">
                    <div className="h-24 w-24 rounded-full border-2 border-primary/40 overflow-hidden flex items-center justify-center bg-muted">
                      {(editing ? draft.avatar_url : profile?.avatar_url)
                        ? <img src={editing ? draft.avatar_url! : profile!.avatar_url!} alt="Avatar" className="h-full w-full object-cover" />
                        : <span className="text-3xl font-bold text-primary">{getInitials(editing ? (draft.full_name ?? null) : (profile?.full_name ?? null))}</span>
                      }
                    </div>
                    {uploading && (
                      <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex-1 space-y-3">
                    {editing ? (
                      <>
                        {/* Hidden file input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0]
                            if (file) loadImageForCrop(file)
                            e.target.value = ""
                          }}
                        />

                        {/* Upload button */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full gap-2 w-full sm:w-auto"
                          disabled={uploading}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-4 w-4" />
                          {uploading ? "Enviando..." : "Enviar foto do dispositivo"}
                        </Button>

                        {/* Error */}
                        {uploadError && (
                          <p className="text-xs text-red-400 flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />{uploadError}
                          </p>
                        )}

                        {/* URL fallback */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Ou cole o link de uma imagem pública:</p>
                          <input
                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="https://i.imgur.com/xxx.jpg"
                            value={val("avatar_url")}
                            onChange={e => set("avatar_url")(e.target.value)}
                          />
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {profile?.avatar_url ? "Foto cadastrada. Clique em Editar para trocar." : "Nenhuma foto cadastrada. Clique em Editar para adicionar."}
                      </p>
                    )}
                  </div>
                </div>
              </ProfileSection>

              {/* ── Seção: Dados Pessoais ── */}
              <ProfileSection icon={<User className="h-5 w-5 text-primary" />} title="Dados Pessoais">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {editing ? (
                    <>
                      <TextInput label="Nome Completo" required value={val("full_name")} placeholder="Ex: Maria Tanaka" onChange={set("full_name")} />
                      <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                          Data de Nascimento<span className="text-red-400 ml-0.5">*</span>
                        </label>
                        <input type="date"
                          className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={val("birth_date")}
                          onChange={e => set("birth_date")(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">E-mail</label>
                        <input disabled className="w-full bg-muted/50 border border-border/50 rounded-xl px-3 py-2 text-sm text-muted-foreground cursor-not-allowed" value={user?.email || ""} />
                        <p className="text-xs text-muted-foreground mt-1">Definido pela sua conta — não editável aqui.</p>
                      </div>
                      <SelectInput label="Sexo" required value={val("gender")}
                        options={[{ value: "masculino", label: "Masculino" }, { value: "feminino", label: "Feminino" }]}
                        onChange={set("gender")} />
                      <TextInput label="Nacionalidade" required value={val("nationality")} placeholder="Ex: Brasileira" onChange={set("nationality")} />
                    </>
                  ) : (
                    <>
                      <Field label="Nome Completo" value={profile?.full_name} />
                      <Field label="Data de Nascimento"
                        value={profile?.birth_date ? new Date(profile.birth_date + "T00:00:00").toLocaleDateString("pt-BR") : null} />
                      <Field label="E-mail" value={user?.email} />
                      <Field label="Sexo" value={profile?.gender === "masculino" ? "Masculino" : profile?.gender === "feminino" ? "Feminino" : profile?.gender} />
                      <Field label="Nacionalidade" value={profile?.nationality} />
                    </>
                  )}
                </div>
              </ProfileSection>

              {/* ── Seção: Contato ── */}
              <ProfileSection icon={<Phone className="h-5 w-5 text-primary" />} title="Contato">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {editing ? (
                    <>
                      <TextInput label="Seu Telefone" required value={val("phone")} placeholder="Ex: 090-0000-0000" onChange={set("phone")} />
                      <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                          Usa WhatsApp? Se sim, deixe o número
                        </label>
                        <input className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Ex: +81-90-0000-0000"
                          value={val("whatsapp")}
                          onChange={e => set("whatsapp")(e.target.value)}
                        />
                      </div>
                      <SelectInput label="Melhor horário para ligar?" required value={val("best_call_time")}
                        options={CALL_TIME_OPTIONS}
                        onChange={set("best_call_time")} />
                    </>
                  ) : (
                    <>
                      <Field label="Telefone" value={profile?.phone} />
                      <Field label="WhatsApp" value={profile?.whatsapp} />
                      <Field label="Melhor horário p/ ligar"
                        value={CALL_TIME_OPTIONS.find(o => o.value === profile?.best_call_time)?.label} />
                    </>
                  )}
                </div>
              </ProfileSection>

              {/* ── Seção: Localização ── */}
              <ProfileSection icon={<MapPin className="h-5 w-5 text-primary" />} title="Localização">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {editing ? (
                    <>
                      <TextInput label="Cidade em que reside" required value={val("city")} placeholder="Ex: Osaka" onChange={set("city")} />
                      <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                          Província em que reside<span className="text-red-400 ml-0.5">*</span>
                        </label>
                        <select className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                          value={val("province")} onChange={e => set("province")(e.target.value)}>
                          <option value="">Selecione a província...</option>
                          {JAPAN_PROVINCES.map(p => <option key={p} value={p} className="bg-background">{p}</option>)}
                        </select>
                      </div>
                      <SelectInput label="Pode mudar?" required value={val("can_relocate")}
                        options={RELOCATION_OPTIONS} onChange={set("can_relocate")} />
                    </>
                  ) : (
                    <>
                      <Field label="Cidade" value={profile?.city} />
                      <Field label="Província" value={profile?.province} />
                      <Field label="Disponibilidade p/ mudança"
                        value={RELOCATION_OPTIONS.find(o => o.value === profile?.can_relocate)?.label} />
                    </>
                  )}
                </div>
              </ProfileSection>

              {/* ── Seção: Idioma & Visto ── */}
              <ProfileSection icon={<Languages className="h-5 w-5 text-primary" />} title="Idioma & Visto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {editing ? (
                    <>
                      <SelectInput label="Nível de Japonês" required value={val("jlpt_level")}
                        options={JLPT_LEVELS} onChange={set("jlpt_level")} />
                      <SelectInput label="Tipo de Visto" required value={val("visa_type")}
                        options={VISA_TYPES} onChange={set("visa_type")} />
                      {val("visa_type") === "outros" && (
                        <div className="md:col-span-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                            Especifique seu visto
                          </label>
                          <input className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Descreva o tipo de visto que possui"
                            value={val("visa_other")}
                            onChange={e => set("visa_other")(e.target.value)}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Field label="Nível de Japonês"
                        value={JLPT_LEVELS.find(l => l.value === profile?.jlpt_level)?.label ?? profile?.jlpt_level} />
                      <Field label="Tipo de Visto"
                        value={profile?.visa_type === "outros"
                          ? `Outros: ${profile.visa_other || "—"}`
                          : VISA_TYPES.find(v => v.value === profile?.visa_type)?.label ?? profile?.visa_type
                        } />
                    </>
                  )}
                </div>
              </ProfileSection>

              {/* ── Seção: Apresentação Pessoal ── */}
              <ProfileSection icon={<FileText className="h-5 w-5 text-primary" />} title="Apresentação Pessoal">
                {editing ? (
                  <textarea rows={5}
                    className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Fale sobre sua experiência profissional, objetivos, idiomas que fala, visto, hobbies relevantes, etc."
                    value={val("bio")}
                    onChange={e => set("bio")(e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {profile?.bio || <span className="italic text-muted-foreground">Não preenchido</span>}
                  </p>
                )}
              </ProfileSection>

              {/* ── Progresso ── */}
              <div className="glass-panel rounded-2xl p-6 border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Progresso do perfil</h3>
                  <span className="text-sm font-bold text-primary">{completion}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${completion}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {requiredItems.map(({ label, done }) => (
                    <div key={label} className="flex items-center gap-2 text-sm">
                      {done ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />}
                      <span className={done ? "text-muted-foreground line-through" : "text-foreground"}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info candidatura */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80">
                  <strong className="text-foreground">Como seus dados são usados:</strong> ao se candidatar a uma vaga, todas as informações deste perfil são enviadas automaticamente para a empresa. Mantenha seus dados sempre atualizados para aumentar suas chances.
                </p>
              </div>
            </div>
          )}

          {/* ══ CONFIGURAÇÕES ══ */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Configurações</h1>
                <p className="text-muted-foreground">Gerencie as configurações da sua conta.</p>
              </div>
              <div className="glass-panel rounded-2xl p-6 border-border space-y-4">
                <h3 className="font-semibold text-foreground">Conta</h3>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">E-mail</label>
                  <p className="text-foreground mt-1">{user?.email}</p>
                </div>
                <hr className="border-border" />
                <Button variant="outline" className="rounded-full text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40"
                  onClick={async () => { await signOut(); navigate("/login") }}>
                  <LogOut className="h-4 w-4 mr-2" /> Sair da conta
                </Button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Avatar Cropper Modal ── */}
      {cropSrc && (
        <AvatarCropper
          imageSrc={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </div>
  )
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

function ProfileSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-2xl p-6 border-border space-y-5">
      <h3 className="font-semibold text-foreground flex items-center gap-2">{icon}{title}</h3>
      {children}
    </div>
  )
}

function StatCard({ icon: Icon, color, label, value, onClick }: { icon: any; color: string; label: string; value: any; onClick?: () => void }) {
  return (
    <div
      className={`glass-panel rounded-2xl p-5 border-border flex items-center space-x-3 ${onClick ? "cursor-pointer hover:border-primary/40 transition-colors" : ""}`}
      onClick={onClick}
    >
      <div className={`h-10 w-10 rounded-full bg-${color}-500/20 flex items-center justify-center text-${color}-500 shrink-0`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}

function ApplicationList({ applications, loading }: { applications: ApplicationWithJob[]; loading: boolean }) {
  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />)}
    </div>
  )
  if (applications.length === 0) return (
    <div className="glass-panel rounded-xl p-8 border-border text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Send className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-1">Nenhuma candidatura ainda</h3>
      <p className="text-muted-foreground mb-4">Você ainda não se candidatou a nenhuma vaga.</p>
      <Button variant="outline" className="rounded-full border-border" asChild>
        <Link to="/vagas">Explorar Vagas</Link>
      </Button>
    </div>
  )
  return (
    <div className="space-y-4">
      {applications.map(app => {
        const job = app.jobs
        const st = STATUS_MAP[app.status] || { label: app.status, color: "bg-muted text-muted-foreground border-border" }
        const initials = job?.companies?.name
          ? job.companies.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
          : "?"
        return (
          <div key={app.id} className="glass-panel rounded-xl p-5 border-border flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="h-12 w-12 rounded-lg bg-primary/10 border border-border flex items-center justify-center text-sm font-bold text-primary shrink-0 overflow-hidden">
              {job?.companies?.logo_url
                ? <img src={job.companies.logo_url} alt="" className="h-full w-full object-contain" />
                : initials}
            </div>
            <div className="flex-1 min-w-0">
              {job
                ? <Link to={`/vagas/${job.id}`} className="text-base font-semibold text-foreground hover:text-primary transition-colors truncate block">{job.title}</Link>
                : <p className="text-base font-semibold text-foreground/60">Vaga removida</p>
              }
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                {job?.companies?.name && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.companies.name}</span>}
                {job?.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>}
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{new Date(app.applied_at).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full border ${st.color} shrink-0`}>{st.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Avatar Cropper ───────────────────────────────────────────────────────────

function AvatarCropper({ imageSrc, onConfirm, onCancel }: {
  imageSrc: string
  onConfirm: (dataUrl: string) => void
  onCancel: () => void
}) {
  const SIZE = 280
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [minScale, setMinScale] = useState(1)
  const dragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      const s = SIZE / Math.min(img.width, img.height)
      setMinScale(s)
      setScale(s)
      setOffset({ x: 0, y: 0 })
    }
    img.src = imageSrc
  }, [imageSrc])

  useEffect(() => { draw() })

  function draw() {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext("2d")!
    ctx.clearRect(0, 0, SIZE, SIZE)
    const w = img.width * scale
    const h = img.height * scale
    const x = (SIZE - w) / 2 + offset.x
    const y = (SIZE - h) / 2 + offset.y
    ctx.drawImage(img, x, y, w, h)
  }

  function clampOffset(ox: number, oy: number, s: number) {
    if (!imgRef.current) return { x: ox, y: oy }
    const img = imgRef.current
    const w = img.width * s
    const h = img.height * s
    const maxX = w / 2
    const maxY = h / 2
    return {
      x: Math.min(maxX, Math.max(-maxX, ox)),
      y: Math.min(maxY, Math.max(-maxY, oy)),
    }
  }

  function startDrag(clientX: number, clientY: number) {
    dragging.current = true
    lastPos.current = { x: clientX, y: clientY }
  }
  function moveDrag(clientX: number, clientY: number) {
    if (!dragging.current) return
    const dx = clientX - lastPos.current.x
    const dy = clientY - lastPos.current.y
    setOffset(o => clampOffset(o.x + dx, o.y + dy, scale))
    lastPos.current = { x: clientX, y: clientY }
  }
  function endDrag() { dragging.current = false }

  function handleScale(s: number) {
    setScale(s)
    setOffset(o => clampOffset(o.x, o.y, s))
  }

  function confirm() {
    const img = imgRef.current
    if (!img) return
    const OUT = 400
    const out = document.createElement("canvas")
    out.width = OUT; out.height = OUT
    const ctx = out.getContext("2d")!
    const r = OUT / SIZE
    const w = img.width * scale * r
    const h = img.height * scale * r
    const x = (OUT - w) / 2 + offset.x * r
    const y = (OUT - h) / 2 + offset.y * r
    ctx.drawImage(img, x, y, w, h)
    onConfirm(out.toDataURL("image/jpeg", 0.88))
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="bg-background border border-border rounded-2xl p-6 space-y-5 w-full max-w-sm shadow-2xl">
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground">Ajustar foto</h3>
          <p className="text-xs text-muted-foreground mt-1">Arraste para centralizar • Deslize para zoom</p>
        </div>

        {/* Crop preview */}
        <div className="flex justify-center">
          <div className="relative select-none" style={{ width: SIZE, height: SIZE }}>
            <canvas
              ref={canvasRef}
              width={SIZE}
              height={SIZE}
              className="rounded-full cursor-grab active:cursor-grabbing"
              style={{ touchAction: "none" }}
              onMouseDown={e => startDrag(e.clientX, e.clientY)}
              onMouseMove={e => moveDrag(e.clientX, e.clientY)}
              onMouseUp={endDrag}
              onMouseLeave={endDrag}
              onTouchStart={e => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchMove={e => { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY) }}
              onTouchEnd={endDrag}
            />
            <div className="absolute inset-0 rounded-full border-4 border-primary pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
          </div>
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3 px-1">
          <span className="text-base font-bold text-muted-foreground select-none">−</span>
          <input
            type="range"
            min={minScale}
            max={minScale * 3}
            step={0.01}
            value={scale}
            onChange={e => handleScale(Number(e.target.value))}
            className="flex-1 accent-primary h-1"
          />
          <span className="text-base font-bold text-muted-foreground select-none">+</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1 rounded-full" onClick={onCancel}>Cancelar</Button>
          <Button variant="gradient" className="flex-1 rounded-full" onClick={confirm}>Confirmar</Button>
        </div>
      </div>
    </div>
  )
}
