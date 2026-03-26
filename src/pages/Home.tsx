import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, MapPin, Briefcase, Building2, Globe, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
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
  companies: { name: string; logo_url: string | null } | null
}

export function Home() {
  const [featuredJobs, setFeaturedJobs] = useState<JobWithCompany[]>([])
  const [companies, setCompanies] = useState<{ id: string; name: string; logo_url: string | null }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*, companies(name, logo_url)')
          .eq('is_featured', true)
          .limit(6)
          .order('created_at', { ascending: false })

        if (jobsError) throw jobsError
        setFeaturedJobs(jobsData || [])

        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('id, name, logo_url')
          .gt('open_jobs', 0)
          .order('open_jobs', { ascending: false })
          .limit(12)

        if (companiesError) throw companiesError
        setCompanies(companiesData || [])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'A combinar'
    const formatYen = (num: number) => `¥${(num / 10000).toFixed(0)}M`
    if (min && max) return `${formatYen(min)} - ${formatYen(max)} / ano`
    if (min) return `A partir de ${formatYen(min)}`
    return `Até ${formatYen(max!)}`
  }

  const getCompanyInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }
  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
        </div>
        
        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-6 py-1.5 px-4 text-sm border-primary/30 text-primary">
            <span className="mr-2 inline-block h-2 w-2 rounded-none bg-primary animate-pulse" />
            Mais de 2.500 vagas abertas hoje
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Encontre sua <span className="text-primary font-black">vaga ideal</span><br /> no Japão
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Conectamos profissionais internacionais às melhores empresas japonesas. 
            Oportunidades que valorizam seu talento e diversidade.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-card border border-border shadow-sm p-2 rounded-full flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 bg-muted rounded-full border border-border">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <input 
                type="text" 
                placeholder="Cargo, habilidade ou empresa..." 
                className="w-full bg-transparent border-none focus:outline-none text-foreground h-12 placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex-1 flex items-center px-4 bg-muted rounded-full border border-border">
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
                <optgroup label="Província" className="bg-background">
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
                <optgroup label="Outro" className="bg-background">
                  <option value="OTHER">Outro</option>
                </optgroup>
              </select>
            </div>
            <Button size="lg" className="w-full md:w-auto rounded-full px-8 h-12 bg-primary text-primary-foreground hover:bg-primary/90">
              Buscar Vagas
            </Button>
          </div>
          
          {/* Quick Filters */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <span className="text-sm text-muted-foreground flex items-center mr-2">Buscas populares:</span>
            {["TI & Software", "Engenharia", "Marketing", "Nível N3+", "Inglês Nativo", "Remoto"].map((tag) => (
              <Badge key={tag} variant="outline" className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors py-1.5 px-4 rounded-none">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>
      
      {/* Ad Banner Slot */}
      <section className="container mx-auto max-w-7xl px-4 flex flex-col items-center -mt-8 mb-16">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Anúncio</span>
        <div className="w-[320px] h-[50px] md:w-[728px] md:h-[90px] bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-muted-foreground text-xs md:text-sm font-medium">
          Espaço publicitário — <span className="hidden md:inline ml-1">728x90</span><span className="md:hidden ml-1">320x50</span>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Vagas em Destaque</h2>
            <p className="text-muted-foreground">As melhores oportunidades selecionadas para você.</p>
          </div>
          <Button variant="link" asChild className="hidden sm:flex group text-primary">
            <Link to="/vagas">
              Ver todas as vagas <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              {[1, 2, 3].map(i => (
                <Card key={i} className="glass-panel border-border animate-pulse">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 rounded-xl bg-muted" />
                      <div className="h-6 w-10 rounded bg-muted" />
                    </div>
                    <div className="h-6 w-3/4 rounded bg-muted mb-2" />
                    <div className="h-4 w-1/2 rounded bg-muted" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-muted" />
                      <div className="h-4 w-2/3 rounded bg-muted" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : featuredJobs.length > 0 ? (
            featuredJobs.map((job) => (
              <Card key={job.id} className="glass-panel-hover flex flex-col group cursor-pointer border-border">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-4">
                    {job.companies?.logo_url ? (
                      <img 
                        src={job.companies.logo_url} 
                        alt={job.companies.name} 
                        className="h-12 w-12 rounded-xl border border-border object-contain bg-white/5"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted border border-border flex items-center justify-center text-xl font-bold text-foreground shadow-sm group-hover:border-primary transition-all rounded-none">
                        {getCompanyInitials(job.companies?.name || 'XX')}
                      </div>
                    )}
                    <Badge variant={mapJlptToVariant(job.jlpt_level)} className="font-mono">{job.jlpt_level || 'N/A'}</Badge>
                  </div>
                  <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors text-foreground">{job.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="mr-1.5 h-4 w-4" />
                    {job.companies?.name || 'Empresa'}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2 mb-6">
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
                  <div className="flex flex-wrap gap-2">
                    {job.requirements?.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 border-t border-border mt-auto">
                  <Button variant="ghost" className="w-full mt-4 justify-between group-hover:bg-muted" asChild>
                    <Link to={`/vagas/${job.id}`}>
                      Ver detalhes <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-muted-foreground">
              Nenhuma vaga em destaque no momento.
            </div>
          )}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" className="w-full rounded-full" asChild>
            <Link to="/vagas">Ver todas as vagas</Link>
          </Button>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border shadow-sm rounded-none p-10 md:p-16 relative overflow-hidden">
          
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">Empresas Contratando</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Junte-se a milhares de estrangeiros trabalhando nas empresas mais inovadoras do Japão.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 relative z-10">
            {loading ? (
              <>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-square rounded-2xl bg-muted border border-border animate-pulse" />
                ))}
              </>
            ) : companies.length > 0 ? (
              companies.map((company) => (
                <div key={company.id} className="aspect-square rounded-2xl bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer group overflow-hidden">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt={company.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <span className="text-lg font-bold text-muted-foreground/40 group-hover:text-primary transition-colors">
                      {getCompanyInitials(company.name)}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-6 text-center py-8 text-muted-foreground">
                Nenhuma empresa cadastrada ainda.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
