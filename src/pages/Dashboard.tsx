import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Bookmark,
  User,
  Settings,
  LogOut,
  Briefcase,
  CheckCircle2,
  Circle,
  Send,
  Clock,
  Building2,
  MapPin
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

export function Dashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [applications, setApplications] = useState<ApplicationWithJob[]>([])
  const [totalJobs, setTotalJobs] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetchAll() {
      try {
        // Perfil real do usuário
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, bio, location, phone, completion_percentage")
          .eq("id", user!.id)
          .maybeSingle()

        setProfile(profileData || null)

        // Candidaturas reais do usuário
        const { data: appsData } = await supabase
          .from("applications")
          .select("id, status, applied_at, jobs(id, title, location, job_type, companies(name, logo_url))")
          .eq("user_id", user!.id)
          .order("applied_at", { ascending: false })

        setApplications((appsData as any) || [])

        // Total de vagas disponíveis
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

  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "você"
  const completion = profile?.completion_percentage ?? 0

  const completionItems = [
    { label: "Informações básicas", done: !!profile?.full_name },
    { label: "Localização", done: !!profile?.location },
    { label: "Telefone de contato", done: !!profile?.phone },
    { label: "Apresentação pessoal", done: !!profile?.bio },
  ]

  const statusLabel: Record<string, { label: string; color: string }> = {
    pending:   { label: "Enviada",        color: "bg-yellow-500/20 text-yellow-500" },
    viewed:    { label: "Visualizada",    color: "bg-blue-500/20 text-blue-500" },
    interview: { label: "Entrevista",     color: "bg-purple-500/20 text-purple-500" },
    accepted:  { label: "Aceita",         color: "bg-green-500/20 text-green-500" },
    rejected:  { label: "Não selecionado", color: "bg-red-500/20 text-red-500" },
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <aside className="w-full md:w-[240px] shrink-0">
          <div className="glass-panel rounded-2xl p-6 border-border sticky top-24">

            {/* Avatar + Nome */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-20 w-20 rounded-full border-2 border-primary/40 mb-4 overflow-hidden flex items-center justify-center bg-muted shadow-sm">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-2xl font-bold text-primary">{getInitials(profile?.full_name ?? null)}</span>
                )}
              </div>
              <h3 className="font-semibold text-lg text-foreground leading-tight">
                {profile?.full_name || <span className="text-muted-foreground italic text-sm">Nome não cadastrado</span>}
              </h3>
              {profile?.bio && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{profile.bio}</p>
              )}
              {profile?.location && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
                  <MapPin className="h-3 w-3" /> {profile.location}
                </p>
              )}
            </div>

            {/* Nav */}
            <nav className="space-y-2">
              {[
                { id: "overview", label: "Visão geral", icon: LayoutDashboard },
                { id: "applications", label: "Candidaturas", icon: Send, count: applications.length },
                { id: "profile", label: "Meu perfil", icon: User },
                { id: "settings", label: "Configurações", icon: Settings },
              ].map(({ id, label, icon: Icon, count }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
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
              <button
                onClick={async () => { await signOut(); navigate("/login") }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 space-y-8">

          {/* Greeting */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
              {getGreeting()}, {firstName}!
            </h1>
            <p className="text-muted-foreground">Aqui está o resumo das suas atividades.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel rounded-2xl p-6 border-border flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Send className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Candidaturas</p>
                <p className="text-2xl font-bold text-foreground">{loading ? "—" : applications.length}</p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border-border flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Vagas disponíveis</p>
                <p className="text-2xl font-bold text-foreground">{loading ? "—" : totalJobs}</p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border-border flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Perfil completo</p>
                <p className="text-2xl font-bold text-foreground">{loading ? "—" : `${completion}%`}</p>
              </div>
            </div>
          </div>

          {/* Profile Completion */}
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
                    {done
                      ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      : <Circle className="h-5 w-5 text-muted-foreground shrink-0" />}
                    <span className={done ? "text-muted-foreground line-through" : "text-foreground font-medium"}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            {completion < 100 && (
              <div className="mt-4 relative z-10">
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => setActiveTab("profile")}>
                  Completar perfil
                </Button>
              </div>
            )}
          </div>

          {/* Candidaturas recentes */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Candidaturas Recentes</h2>
              {applications.length > 3 && (
                <Button variant="link" className="text-primary p-0 h-auto" onClick={() => setActiveTab("applications")}>
                  Ver todas
                </Button>
              )}
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />)}
              </div>
            ) : applications.length > 0 ? (
              <div className="space-y-4">
                {applications.slice(0, 5).map(app => {
                  const job = app.jobs
                  const st = statusLabel[app.status] || { label: app.status, color: "bg-muted text-muted-foreground" }
                  return (
                    <div key={app.id} className="glass-panel rounded-xl p-5 border-border flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 border border-border flex items-center justify-center text-lg font-bold text-primary shrink-0">
                        {job?.companies?.logo_url
                          ? <img src={job.companies.logo_url} alt="" className="h-full w-full object-contain rounded-lg" />
                          : getInitials(job?.companies?.name ?? null)
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        {job ? (
                          <Link to={`/vagas/${job.id}`} className="text-base font-semibold text-foreground hover:text-primary transition-colors truncate block">
                            {job.title}
                          </Link>
                        ) : (
                          <p className="text-base font-semibold text-foreground">Vaga removida</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                          {job?.companies?.name && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.companies.name}</span>}
                          {job?.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(app.applied_at).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${st.color}`}>{st.label}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
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
            )}
          </div>

        </main>
      </div>
    </div>
  )
}
