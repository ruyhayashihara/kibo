import { useState } from "react"
import { 
  Users, 
  Building2, 
  Briefcase, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Star
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"

// Mock Data
const STATS = [
  { title: "Total de Vagas", value: "2,345", icon: Briefcase, change: "+12%" },
  { title: "Usuários", value: "14,592", icon: Users, change: "+5%" },
  { title: "Empresas", value: "843", icon: Building2, change: "+18%" },
  { title: "Receita Mensal", value: "¥ 4.2M", icon: DollarSign, change: "+8%" },
]

const MOCK_JOBS = [
  { id: "1", title: "Desenvolvedor Frontend Sênior", company: "Tech Solutions", date: "2026-03-20", sponsored: true },
  { id: "2", title: "Engenheiro de Software", company: "Global Systems", date: "2026-03-19", sponsored: false },
  { id: "3", title: "Product Manager", company: "InovaTech", date: "2026-03-18", sponsored: true },
  { id: "4", title: "Analista de Dados", company: "DataCorp", date: "2026-03-18", sponsored: false },
  { id: "5", title: "Designer UX/UI", company: "Creative Agency", date: "2026-03-17", sponsored: false },
]

const MOCK_ADS = [
  { id: "1", position: "homepage_banner", image: "https://picsum.photos/seed/ad1/800/200", link: "https://example.com/ad1", status: "ativo" },
  { id: "2", position: "listing_sidebar", image: "https://picsum.photos/seed/ad2/300/600", link: "https://example.com/ad2", status: "ativo" },
  { id: "3", position: "listing_native", image: "https://picsum.photos/seed/ad3/600/200", link: "https://example.com/ad3", status: "inativo" },
  { id: "4", position: "job_detail_sidebar", image: "https://picsum.photos/seed/ad4/300/250", link: "https://example.com/ad4", status: "ativo" },
]

export function AdminDashboard() {
  const [jobs, setJobs] = useState(MOCK_JOBS)
  const [ads, setAds] = useState(MOCK_ADS)

  const toggleSponsored = (id: string) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, sponsored: !job.sponsored } : job))
  }

  const toggleAdStatus = (id: string) => {
    setAds(ads.map(ad => ad.id === id ? { ...ad, status: ad.status === "ativo" ? "inativo" : "ativo" } : ad))
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Painel Administrativo</h1>
            <p className="text-muted-foreground mt-1">Visão geral e gerenciamento da plataforma.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <Card key={i} className="glass-panel">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-emerald-500 font-medium">{stat.change}</span>
                  <span className="text-muted-foreground ml-2">vs. mês anterior</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Featured Jobs Manager */}
          <Card className="glass-panel flex flex-col">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-xl text-foreground flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Vagas em Destaque
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Vaga</th>
                    <th className="px-6 py-4 font-medium">Empresa</th>
                    <th className="px-6 py-4 font-medium">Data</th>
                    <th className="px-6 py-4 font-medium text-center">Patrocinada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{job.title}</td>
                      <td className="px-6 py-4 text-foreground/80">{job.company}</td>
                      <td className="px-6 py-4 text-muted-foreground">{job.date}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => toggleSponsored(job.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                            job.sponsored ? 'bg-primary' : 'bg-muted-foreground/30'
                          }`}
                        >
                          <span className="sr-only">Toggle sponsored</span>
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              job.sponsored ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Ad Slots Manager */}
          <Card className="glass-panel flex flex-col">
            <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-foreground">Gerenciador de Anúncios</CardTitle>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-2">
                <Plus className="h-4 w-4" />
                Adicionar anúncio
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
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
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`
                          ${ad.status === 'ativo' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10' : 'border-muted-foreground/50 text-muted-foreground bg-muted-foreground/10'}
                        `}>
                          {ad.status === 'ativo' ? (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {ad.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => toggleAdStatus(ad.id)}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                            title="Alternar status"
                          >
                            {ad.status === 'ativo' ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          </button>
                          <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Editar">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Excluir">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
