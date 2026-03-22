import { useState } from "react"
import { Link } from "react-router-dom"
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
  XCircle
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
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

const INITIAL_JOBS = [
  {
    id: "1",
    title: "Desenvolvedor Frontend Sênior",
    applications: 45,
    views: 850,
    status: "active",
    date: "12 Mar 2026"
  },
  {
    id: "2",
    title: "Engenheiro de Software Backend",
    applications: 32,
    views: 620,
    status: "active",
    date: "10 Mar 2026"
  },
  {
    id: "3",
    title: "Especialista em Marketing Digital",
    applications: 10,
    views: 120,
    status: "paused",
    date: "05 Mar 2026"
  }
]

export function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [jobs, setJobs] = useState(INITIAL_JOBS)

  const toggleStatus = (id: string) => {
    setJobs(jobs.map(job => 
      job.id === id 
        ? { ...job, status: job.status === "active" ? "paused" : "active" }
        : job
    ))
  }

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id))
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar (240px) */}
        <aside className="w-full md:w-[240px] shrink-0">
          <div className="glass-panel rounded-2xl p-6 border-white/10 sticky top-24">
            {/* Company Profile Summary */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent p-1 mb-4">
                <div className="h-full w-full rounded-xl bg-black/50 flex items-center justify-center overflow-hidden">
                  <Building2 className="h-10 w-10 text-white/80" />
                </div>
              </div>
              <h3 className="font-semibold text-lg text-white">TechCorp Japan</h3>
              <p className="text-sm text-gray-400">Tecnologia • Tóquio</p>
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
                onClick={() => setActiveTab("jobs")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "jobs" 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <Briefcase className="h-5 w-5" />
                <span className="font-medium">Minhas vagas</span>
                <Badge variant="glass" className="ml-auto bg-white/10 text-xs">{jobs.length}</Badge>
              </button>
              
              <Link 
                to="/empresa/vagas/nova"
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "publish" 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
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
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
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
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Bom dia, TechCorp!</h1>
            <p className="text-gray-400">Aqui está o resumo do seu recrutamento hoje.</p>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel rounded-2xl p-6 border-white/10 flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Vagas ativas</p>
                <p className="text-2xl font-bold text-white">5</p>
              </div>
            </div>
            
            <div className="glass-panel rounded-2xl p-6 border-white/10 flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Visualizações</p>
                <p className="text-2xl font-bold text-white">1.240</p>
              </div>
            </div>
            
            <div className="glass-panel rounded-2xl p-6 border-white/10 flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Candidatos</p>
                <p className="text-2xl font-bold text-white">87</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart */}
            <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border-white/10">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Visualizações de Vagas</h2>
                <p className="text-sm text-gray-400">Últimos 7 dias</p>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F27D26" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#141414', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#F27D26' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#F27D26" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CTA Card */}
            <div className="glass-panel rounded-2xl p-8 border-white/10 relative overflow-hidden flex flex-col justify-center items-center text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 glow-primary relative z-10">
                <PlusCircle className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Nova Vaga</h2>
              <p className="text-gray-400 mb-8 relative z-10">Alcance milhares de profissionais qualificados no Japão.</p>
              
              <Link to="/empresa/vagas/nova" className="w-full relative z-10">
                <Button variant="gradient" className="w-full rounded-full h-12 text-base font-semibold">
                  Publicar Vaga
                </Button>
              </Link>
            </div>
          </div>

          {/* Active Jobs Table */}
          <div className="glass-panel rounded-2xl border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Vagas Recentes</h2>
              <Button variant="outline" size="sm" className="rounded-full border-white/10">Ver todas</Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Vaga</th>
                    <th className="px-6 py-4 font-medium">Candidatos</th>
                    <th className="px-6 py-4 font-medium">Visualizações</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{job.title}</div>
                        <div className="text-xs text-gray-500 mt-1">Publicada em {job.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-white font-medium">{job.applications}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-white">{job.views}</span>
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
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
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

        </main>
      </div>
    </div>
  )
}
