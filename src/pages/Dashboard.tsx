import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  LayoutDashboard, 
  Bookmark, 
  User, 
  Settings, 
  LogOut, 
  Briefcase, 
  CheckCircle2, 
  Circle,
  Trash2,
  MapPin,
  Building2,
  Clock
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"

// Mock data for saved jobs
const INITIAL_SAVED_JOBS = [
  {
    id: "1",
    title: "Desenvolvedor Frontend Sênior",
    company: "TechCorp Japan",
    location: "Tóquio, Japão",
    type: "CLT (Seishain)",
    salary: "¥8M - ¥12M",
    logo: "T"
  },
  {
    id: "2",
    title: "Engenheiro de Software Backend",
    company: "Global Systems",
    location: "Osaka, Japão",
    type: "Autônomo (Kojin Jigyou Nushi)",
    salary: "¥7M - ¥10M",
    logo: "G"
  },
  {
    id: "3",
    title: "Especialista em Marketing Digital",
    company: "Creative Agency",
    location: "Remoto",
    type: "CLT (Seishain)",
    salary: "¥5M - ¥8M",
    logo: "C"
  }
]

export function Dashboard() {
  const [savedJobs, setSavedJobs] = useState(INITIAL_SAVED_JOBS)
  const [activeTab, setActiveTab] = useState("overview")

  const removeJob = (id: string) => {
    setSavedJobs(savedJobs.filter(job => job.id !== id))
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar (240px) */}
        <aside className="w-full md:w-[240px] shrink-0">
          <div className="glass-panel rounded-2xl p-6 border-white/10 sticky top-24">
            {/* User Profile Summary */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent p-1 mb-4">
                <div className="h-full w-full rounded-full bg-black/50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/avatar/200/200" 
                    alt="Avatar" 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-lg text-white">João da Silva</h3>
              <p className="text-sm text-gray-400">Desenvolvedor Frontend</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "overview" 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Visão geral</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("saved")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "saved" 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <Bookmark className="h-5 w-5" />
                <span className="font-medium">Vagas salvas</span>
                <Badge variant="glass" className="ml-auto bg-white/10 text-xs">{savedJobs.length}</Badge>
              </button>
              
              <button 
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "profile" 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Meu perfil</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "settings" 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Configurações</span>
              </button>
            </nav>

            <div className="mt-8 pt-6 border-t border-white/10">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          
          {/* Greeting */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Bom dia, João!</h1>
            <p className="text-gray-400">Aqui está o resumo das suas atividades hoje.</p>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel rounded-2xl p-6 border-white/10 flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Bookmark className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Vagas salvas</p>
                <p className="text-2xl font-bold text-white">{savedJobs.length}</p>
              </div>
            </div>
            
            <div className="glass-panel rounded-2xl p-6 border-white/10 flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Candidaturas</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
            </div>
            
            <div className="glass-panel rounded-2xl p-6 border-white/10 flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Perfil completo</p>
                <p className="text-2xl font-bold text-white">60%</p>
              </div>
            </div>
          </div>

          {/* Profile Completion Card */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Complete seu perfil</h2>
                  <p className="text-sm text-gray-400">Perfis completos recebem até 4x mais visualizações de recrutadores.</p>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-primary font-medium">60% Concluído</span>
                    <span className="text-gray-400">Faltam 2 etapas</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>
              </div>
              
              {/* Checklist */}
              <div className="w-full md:w-64 space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span className="text-gray-300 line-through">Informações básicas</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span className="text-gray-300 line-through">Experiência profissional</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Circle className="h-5 w-5 text-gray-500 shrink-0" />
                  <span className="text-white font-medium">Adicionar currículo (PDF)</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Circle className="h-5 w-5 text-gray-500 shrink-0" />
                  <span className="text-white font-medium">Nível de idiomas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Jobs Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Vagas Salvas Recentemente</h2>
              <Button variant="link" className="text-primary p-0 h-auto">Ver todas</Button>
            </div>
            
            <div className="space-y-4">
              {savedJobs.length > 0 ? (
                savedJobs.map((job) => (
                  <div key={job.id} className="glass-panel rounded-xl p-5 border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center transition-all hover:bg-white/5">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-xl font-bold text-white shrink-0">
                      {job.logo}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Link to={`/vagas/${job.id}`} className="text-lg font-semibold text-white hover:text-primary transition-colors truncate block">
                        {job.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
                        <span className="flex items-center"><Building2 className="h-3.5 w-3.5 mr-1" /> {job.company}</span>
                        <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1" /> {job.location}</span>
                        <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1" /> {job.type}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                      <Badge variant="glass" className="bg-primary/10 text-primary border-primary/20">{job.salary}</Badge>
                      <div className="flex items-center gap-2">
                        <Button variant="gradient" size="sm" className="rounded-full px-4">
                          Candidatar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-9 w-9 rounded-full border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                          onClick={() => removeJob(job.id)}
                          title="Remover vaga salva"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-panel rounded-xl p-8 border-white/10 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <Bookmark className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">Nenhuma vaga salva</h3>
                  <p className="text-gray-400 mb-4">Você ainda não salvou nenhuma vaga de emprego.</p>
                  <Button variant="outline" className="rounded-full border-white/10" asChild>
                    <Link to="/vagas">Explorar Vagas</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
