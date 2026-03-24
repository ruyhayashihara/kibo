import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, MapPin, Briefcase, Filter, ChevronDown, Clock, Building2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge, BadgeProps } from "@/src/components/ui/badge"
import { supabase } from "@/src/lib/supabase"

const mapJlptToVariant = (jlpt: string | undefined): BadgeProps["variant"] => {
  const validVariants: BadgeProps["variant"][] = ["n1", "n2", "n3", "n4", "n5"];
  const variant = jlpt?.toLowerCase() as BadgeProps["variant"];
  return validVariants.includes(variant) ? variant : "default";
};

interface JobWithCompany {
  id: string
  title: string
  location: string
  work_mode: string
  job_type: string
  salary_min: number | null
  salary_max: number | null
  jlpt_level: string | null
  requirements: string[]
  is_sponsored: boolean
  is_featured: boolean
  created_at: string
  companies: { name: string; logo_url: string | null } | null
}

export function Jobs() {
  const [jobs, setJobs] = useState<JobWithCompany[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*, companies(name, logo_url)')
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false })

        if (error) throw error
        setJobs(data || [])
      } catch (error) {
        console.error('Erro ao carregar vagas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'A combinar'
    const formatYen = (num: number) => `¥${(num / 10000).toFixed(0)}M`
    if (min && max) return `${formatYen(min)} - ${formatYen(max)}`
    if (min) return `A partir de ${formatYen(min)}`
    return `Até ${formatYen(max!)}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    if (diffHours < 1) return 'Agora'
    if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `Há ${diffDays} dias`
    return date.toLocaleDateString('pt-BR')
  }

  const getCompanyInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Search Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Buscar Vagas</h1>
        <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex items-center px-4 bg-muted rounded-xl border border-border">
            <Search className="h-5 w-5 text-muted-foreground mr-3" />
            <input 
              type="text" 
              placeholder="Cargo, habilidade ou empresa..." 
              className="w-full bg-transparent border-none focus:outline-none text-foreground h-12 placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex-1 flex items-center px-4 bg-muted rounded-xl border border-border">
            <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
            <select 
              name="region"
              defaultValue=""
              className="w-full bg-transparent border-none focus:outline-none text-foreground h-12 appearance-none cursor-pointer"
            >
              <option value="" className="bg-background">Todas as Localidades</option>
              <optgroup label="Região" className="bg-background">
                <option value="JP-R1">Hokkaido</option>
                <option value="JP-R2">Tohoku</option>
                <option value="JP-R3">Kanto</option>
                <option value="JP-R4">Chubu</option>
                <option value="JP-R5">Kansai</option>
                <option value="JP-R6">Chugoku</option>
                <option value="JP-R7">Shikoku</option>
                <option value="JP-R8">Kyushu</option>
              </optgroup>
              <optgroup label="Província" className="bg-gray-900">
                <option value="JP-01">Hokkaido</option>
                <option value="JP-02">Aomori</option>
                <option value="JP-03">Iwate</option>
                <option value="JP-04">Miyagi</option>
                <option value="JP-05">Akita</option>
                <option value="JP-06">Yamagata</option>
                <option value="JP-07">Fukushima</option>
                <option value="JP-08">Ibaraki</option>
                <option value="JP-09">Tochigi</option>
                <option value="JP-10">Gunma</option>
                <option value="JP-11">Saitama</option>
                <option value="JP-12">Chiba</option>
                <option value="JP-13">Tokyo</option>
                <option value="JP-14">Kanagawa</option>
                <option value="JP-15">Niigata</option>
                <option value="JP-16">Toyama</option>
                <option value="JP-17">Ishikawa</option>
                <option value="JP-18">Fukui</option>
                <option value="JP-19">Yamanashi</option>
                <option value="JP-20">Nagano</option>
                <option value="JP-21">Gifu</option>
                <option value="JP-22">Shizuoka</option>
                <option value="JP-23">Aichi</option>
                <option value="JP-24">Mie</option>
                <option value="JP-25">Shiga</option>
                <option value="JP-26">Kyoto</option>
                <option value="JP-27">Osaka</option>
                <option value="JP-28">Hyogo</option>
                <option value="JP-29">Nara</option>
                <option value="JP-30">Wakayama</option>
                <option value="JP-31">Tottori</option>
                <option value="JP-32">Shimane</option>
                <option value="JP-33">Okayama</option>
                <option value="JP-34">Hiroshima</option>
                <option value="JP-35">Yamaguchi</option>
                <option value="JP-36">Tokushima</option>
                <option value="JP-37">Kagawa</option>
                <option value="JP-38">Ehime</option>
                <option value="JP-39">Kochi</option>
                <option value="JP-40">Fukuoka</option>
                <option value="JP-41">Saga</option>
                <option value="JP-42">Nagasaki</option>
                <option value="JP-43">Kumamoto</option>
                <option value="JP-44">Oita</option>
                <option value="JP-45">Miyazaki</option>
                <option value="JP-46">Kagoshima</option>
                <option value="JP-47">Okinawa</option>
              </optgroup>
              <optgroup label="Outro" className="bg-gray-900">
                <option value="OTHER">Outro</option>
              </optgroup>
            </select>
          </div>
          <Button size="lg" variant="gradient" className="w-full md:w-auto rounded-xl px-8 h-12">
            Buscar
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h2 className="text-lg font-semibold">Filtros</h2>
            <Button variant="outline" size="sm" className="rounded-full">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
          
          <div className="glass-panel rounded-2xl p-6 hidden lg:block space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Nível de Japonês</h3>
              <div className="space-y-3">
                {["N1 (Fluente)", "N2 (Avançado)", "N3 (Intermediário)", "N4 (Básico)", "N5 (Iniciante)", "Sem requisito"].map((level) => (
                  <label key={level} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-border bg-muted group-hover:border-primary transition-colors flex items-center justify-center">
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Tipo de Contrato</h3>
              <div className="space-y-3">
                {["CLT (Seishain)", "Contrato (Keiyaku)", "Meio Período (Arubaito)", "Autônomo (Kojin Jigyou Nushi)"].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-border bg-muted group-hover:border-primary transition-colors flex items-center justify-center" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Indústria</h3>
              <div className="space-y-3">
                {["TI & Software", "Educação", "Engenharia", "Vendas & Marketing", "Finanças"].map((ind) => (
                  <label key={ind} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-border bg-muted group-hover:border-primary transition-colors flex items-center justify-center" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{ind}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <Button variant="outline" className="w-full rounded-xl">Limpar Filtros</Button>
          </div>
        </aside>

        {/* Job List */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-400">Mostrando <span className="text-white font-medium">{jobs.length}</span> vagas</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Ordenar por:</span>
              <Button variant="ghost" size="sm" className="h-8 rounded-full bg-white/5 border border-white/10">
                Mais recentes <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <>
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="glass-panel p-6 animate-pulse">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="h-16 w-16 rounded-xl bg-muted shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-6 w-2/3 bg-muted rounded" />
                        <div className="h-4 w-1/3 bg-muted rounded" />
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <Card key={job.id} className={`glass-panel-hover flex flex-col sm:flex-row gap-6 p-6 transition-all cursor-pointer border-border ${job.is_featured ? 'border-primary/30 glow-primary/10 bg-primary/5' : ''}`}>
                  {job.companies?.logo_url ? (
                    <img 
                      src={job.companies.logo_url} 
                      alt={job.companies.name} 
                      className="h-16 w-16 rounded-xl border border-border object-contain bg-white/5 shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-muted to-background border border-border flex items-center justify-center text-xl font-bold text-foreground shadow-lg shrink-0">
                      {getCompanyInitials(job.companies?.name || 'XX')}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                            <Link to={`/vagas/${job.id}`} className="hover:underline">{job.title}</Link>
                          </h3>
                          {job.is_featured && (
                            <Badge variant="glass" className="bg-primary/20 text-primary border-primary/30 text-[10px] uppercase tracking-wider py-0">
                              Destaque
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Building2 className="mr-1.5 h-4 w-4" />
                          {job.companies?.name || 'Empresa'}
                        </div>
                      </div>
                      <Badge variant={mapJlptToVariant(job.jlpt_level)} className="font-mono self-start">{job.jlpt_level || 'N/A'}</Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-y-2 gap-x-6 mb-4 mt-4">
                      <div className="flex items-center text-sm text-foreground/80">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-foreground/80">
                        <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatSalary(job.salary_min, job.salary_max)}
                      </div>
                      <div className="flex items-center text-sm text-foreground/80">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {job.work_mode}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="flex flex-wrap gap-2">
                        {job.requirements?.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground hidden sm:inline-block">{formatDate(job.created_at)}</span>
                        <Button variant="secondary" size="sm" className="rounded-full bg-muted hover:bg-muted/80" asChild>
                          <Link to={`/vagas/${job.id}`}>Ver Vaga</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma vaga encontrada.
              </div>
            )}
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-white/10" disabled>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
            <Button variant="default" size="icon" className="rounded-full w-10 h-10">1</Button>
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">2</Button>
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">3</Button>
            <span className="text-gray-500">...</span>
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">12</Button>
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-white/10">
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
