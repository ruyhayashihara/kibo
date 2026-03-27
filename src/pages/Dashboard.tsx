import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  LayoutDashboard, User, Settings, LogOut, Briefcase,
  CheckCircle2, Circle, Send, Clock, Building2, MapPin,
  Edit2, Save, X, Camera, Phone, FileText, Globe, Linkedin,
  AlertCircle
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { supabase } from "@/src/lib/supabase"
import { useAuth } from "../context/AuthContext"

interface UserProfile {
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  phone: string | null
  completion_percentage: number
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

function calcCompletion(p: Partial<UserProfile>) {
  const fields = [p.full_name, p.location, p.phone, p.bio]
  const filled = fields.filter(f => f && String(f).trim()).length
  return Math.round((filled / fields.length) * 100)
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:   { label: "Enviada",           color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
  viewed:    { label: "Visualizada",       color: "bg-blue-500/20 text-blue-500 border-blue-500/30" },
  interview: { label: "Entrevista",        color: "bg-purple-500/20 text-purple-500 border-purple-500/30" },
  accepted:  { label: "Aceita",            color: "bg-green-500/20 text-green-500 border-green-500/30" },
  rejected:  { label: "Não selecionado",   color: "bg-red-500/20 text-red-500 border-red-500/30" },
}

export function Dashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [applications, setApplications] = useState<ApplicationWithJob[]>([])
  const [totalJobs, setTotalJobs] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)

  // Profile editing state
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Partial<UserProfile>>({})
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (!user) return
    async function fetchAll() {
      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, bio, location, phone, completion_percentage")
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
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [user])

  const startEditing = () => {
    setDraft({
      full_name: profile?.full_name || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      phone: profile?.phone || "",
      avatar_url: profile?.avatar_url || "",
    })
    setEditing(true)
    setSaveSuccess(false)
  }

  const cancelEditing = () => {
    setEditing(false)
    setDraft({})
  }

  const saveProfile = async () => {
    if (!user) return
    setSaving(true)
    try {
      const completion = calcCompletion(draft)
      const payload = { ...draft, completion_percentage: completion }

      // Upsert — cria se não existir, atualiza se existir
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...payload }, { onConflict: "id" })

      if (error) throw error

      setProfile(prev => ({ ...(prev || {} as UserProfile), ...payload, completion_percentage: completion }))
      setEditing(false)
      setDraft({})
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      console.error("Erro ao salvar perfil:", err)
    } finally {
      setSaving(false)
    }
  }

  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "você"
  const completion = profile?.completion_percentage ?? 0

  const completionItems = [
    { label: "Nome completo",      done: !!profile?.full_name },
    { label: "Localização",        done: !!profile?.location },
    { label: "Telefone",           done: !!profile?.phone },
    { label: "Apresentação pessoal", done: !!profile?.bio },
  ]

  const tabs = [
    { id: "overview",      label: "Visão geral",  icon: LayoutDashboard },
    { id: "applications",  label: "Candidaturas", icon: Send,    count: applications.length },
    { id: "profile",       label: "Meu perfil",   icon: User },
    { id: "settings",      label: "Configurações", icon: Settings },
  ]

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">

        {/* ── Sidebar ── */}
        <aside className="w-full md:w-[240px] shrink-0">
          <div className="glass-panel rounded-2xl p-6 border-border sticky top-24">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-20 w-20 rounded-full border-2 border-primary/40 mb-4 overflow-hidden flex items-center justify-center bg-muted shadow-sm">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-2xl font-bold text-primary">{getInitials(profile?.full_name ?? null)}</span>
                )}
              </div>
              <h3 className="font-semibold text-lg text-foreground leading-tight">
                {profile?.full_name || <span className="text-muted-foreground italic text-sm">Sem nome</span>}
              </h3>
              {profile?.location && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
                  <MapPin className="h-3 w-3" />{profile.location}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Send,     color: "primary", label: "Candidaturas",      value: loading ? "—" : applications.length },
                  { icon: Briefcase, color: "emerald", label: "Vagas disponíveis", value: loading ? "—" : totalJobs },
                  { icon: User,     color: "primary", label: "Perfil completo",   value: loading ? "—" : `${completion}%` },
                ].map(({ icon: Icon, color, label, value }) => (
                  <div key={label} className="glass-panel rounded-2xl p-6 border-border flex items-center space-x-4">
                    <div className={`h-12 w-12 rounded-full bg-${color}-500/20 flex items-center justify-center text-${color}-500`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{label}</p>
                      <p className="text-2xl font-bold text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

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
                        <span className="text-muted-foreground">{completionItems.filter(i => !i.done).length} etapa(s) restante(s)</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${completion}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-64 space-y-3 bg-muted p-4 rounded-xl border border-border">
                    {completionItems.map(({ label, done }) => (
                      <div key={label} className="flex items-center space-x-3 text-sm">
                        {done ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <Circle className="h-5 w-5 text-muted-foreground shrink-0" />}
                        <span className={done ? "text-muted-foreground line-through" : "text-foreground font-medium"}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {completion < 100 && (
                  <div className="mt-4 relative z-10">
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => { setActiveTab("profile"); startEditing() }}>
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
                <p className="text-muted-foreground">{applications.length} candidatura(s) enviada(s) no total.</p>
              </div>
              <ApplicationList applications={applications} loading={loading} />
            </div>
          )}

          {/* ══ MEU PERFIL ══ */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Meu Perfil</h1>
                  <p className="text-muted-foreground">Estes dados são enviados às empresas quando você se candidata.</p>
                </div>
                {!editing ? (
                  <Button variant="outline" className="rounded-full gap-2" onClick={startEditing}>
                    <Edit2 className="h-4 w-4" /> Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
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
                  Perfil atualizado com sucesso! Os dados serão enviados nas próximas candidaturas.
                </div>
              )}

              {/* Avatar */}
              <div className="glass-panel rounded-2xl p-6 border-border">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" /> Foto de Perfil
                </h3>
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full border-2 border-primary/40 overflow-hidden flex items-center justify-center bg-muted shrink-0">
                    {(editing ? draft.avatar_url : profile?.avatar_url) ? (
                      <img src={editing ? draft.avatar_url! : profile!.avatar_url!} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-primary">{getInitials(editing ? (draft.full_name ?? null) : (profile?.full_name ?? null))}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    {editing ? (
                      <input
                        className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="URL da foto (ex: https://...)"
                        value={draft.avatar_url || ""}
                        onChange={e => setDraft(d => ({ ...d, avatar_url: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {profile?.avatar_url ? "Foto cadastrada" : "Nenhuma foto cadastrada"}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Cole o link de uma imagem pública (Google Photos, Gravatar, etc.)</p>
                  </div>
                </div>
              </div>

              {/* Dados pessoais */}
              <div className="glass-panel rounded-2xl p-6 border-border space-y-5">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Dados Pessoais
                </h3>

                <ProfileField
                  label="Nome completo"
                  value={editing ? (draft.full_name ?? "") : (profile?.full_name ?? "")}
                  editing={editing}
                  placeholder="Ex: Maria Tanaka"
                  onChange={v => setDraft(d => ({ ...d, full_name: v }))}
                  required
                />

                <ProfileField
                  label="Localização atual"
                  icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                  value={editing ? (draft.location ?? "") : (profile?.location ?? "")}
                  editing={editing}
                  placeholder="Ex: Osaka, Japão"
                  onChange={v => setDraft(d => ({ ...d, location: v }))}
                />

                <ProfileField
                  label="Telefone / WhatsApp"
                  icon={<Phone className="h-4 w-4 text-muted-foreground" />}
                  value={editing ? (draft.phone ?? "") : (profile?.phone ?? "")}
                  editing={editing}
                  placeholder="Ex: +55 11 99999-9999 ou +81 080-0000-0000"
                  onChange={v => setDraft(d => ({ ...d, phone: v }))}
                />

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4" /> Apresentação pessoal
                  </label>
                  {editing ? (
                    <textarea
                      rows={4}
                      className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      placeholder="Fale sobre você: experiência, objetivos, idiomas, visto, etc."
                      value={draft.bio ?? ""}
                      onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {profile?.bio || <span className="text-muted-foreground italic">Não preenchido</span>}
                    </p>
                  )}
                </div>
              </div>

              {/* Info sobre candidatura */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-foreground/80">
                  <p className="font-medium text-foreground mb-1">Como seus dados são usados</p>
                  <p>Ao se candidatar a uma vaga, seu <strong>nome</strong>, <strong>telefone</strong>, <strong>localização</strong> e <strong>apresentação</strong> são exibidos junto com sua candidatura. Mantenha essas informações atualizadas para aumentar suas chances.</p>
                </div>
              </div>

              {/* Completion resumo */}
              <div className="glass-panel rounded-2xl p-6 border-border">
                <h3 className="font-semibold text-foreground mb-4">Progresso do perfil</h3>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${completion}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {completionItems.map(({ label, done }) => (
                    <div key={label} className="flex items-center gap-2 text-sm">
                      {done ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />}
                      <span className={done ? "text-muted-foreground line-through" : "text-foreground"}>{label}</span>
                    </div>
                  ))}
                </div>
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
                <Button
                  variant="outline"
                  className="rounded-full text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40"
                  onClick={async () => { await signOut(); navigate("/login") }}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sair da conta
                </Button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

// ── Sub-componentes ──

function ProfileField({
  label, icon, value, editing, placeholder, onChange, required
}: {
  label: string
  icon?: React.ReactNode
  value: string
  editing: boolean
  placeholder: string
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-1">
        {icon} {label} {required && <span className="text-red-400">*</span>}
      </label>
      {editing ? (
        <input
          className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <p className="text-sm text-foreground">
          {value || <span className="text-muted-foreground italic">Não preenchido</span>}
        </p>
      )}
    </div>
  )
}

function ApplicationList({ applications, loading }: { applications: ApplicationWithJob[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />)}
      </div>
    )
  }
  if (applications.length === 0) {
    return (
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
  }
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
              {job ? (
                <Link to={`/vagas/${job.id}`} className="text-base font-semibold text-foreground hover:text-primary transition-colors truncate block">
                  {job.title}
                </Link>
              ) : (
                <p className="text-base font-semibold text-foreground/60">Vaga removida</p>
              )}
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
