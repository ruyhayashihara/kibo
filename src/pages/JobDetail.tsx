import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { MapPin, Briefcase, Building2, Clock, Globe, GraduationCap, ChevronLeft, Share2, BookmarkPlus, ExternalLink } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { supabase } from "@/src/lib/supabase"

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
  } | null
}

export function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<JobDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchJob() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*, companies(id, name, logo_url, description, website, industry)')
          .eq('id', id)
          .single()

        if (error) throw error
        if (!data) {
          setError('Vaga não encontrada')
          setLoading(false)
          return
        }

        // Increment views
        await supabase
          .from('jobs')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id)

        setJob(data)
      } catch (error: any) {
        console.error('Erro ao carregar vaga:', error)
        setError(error.message || 'Erro ao carregar vaga')
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  const formatSalary = (min: number | null, max: number | null, tbd: boolean) => {
    if (tbd) return 'A combinar'
    if (!min && !max) return 'A combinar'
    const formatYen = (num: number) => `¥${(num / 10000).toFixed(0)}M`
    if (min && max) return `${formatYen(min)} - ${formatYen(max)}`
    if (min) return `A partir de ${formatYen(min)}`
    return `Até ${formatYen(max!)}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const getCompanyInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="text-muted-foreground">Carregando vaga...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold mb-2">Vaga não encontrada</h2>
          <p className="text-muted-foreground mb-6">{error || 'A vaga solicitada não existe ou foi removida.'}</p>
          <Link to="/vagas">
            <Button variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar para vagas
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" size="sm" className="mb-6 rounded-full text-muted-foreground hover:text-foreground" asChild>
        <Link to="/vagas">
          <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para vagas
        </Link>
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Header */}
          <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
              {job.companies?.logo_url ? (
                <img 
                  src={job.companies.logo_url} 
                  alt={job.companies.name} 
                  className="h-20 w-20 rounded-xl border border-border object-contain bg-white/5 shrink-0"
                />
              ) : (
                <div className="h-20 w-20 rounded-none bg-muted border border-border flex items-center justify-center text-3xl font-bold text-foreground shadow-sm shrink-0">
                  {job.companies?.name ? getCompanyInitials(job.companies.name) : 'XX'}
                </div>
              )}
              
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
                    <div className="flex items-center text-lg text-primary font-medium">
                      <Building2 className="mr-2 h-5 w-5" />
                      {job.companies?.id ? (
                        <Link to={`/empresa/${job.companies.id}`} className="hover:underline transition-colors">
                          {job.companies.name || 'Empresa'}
                        </Link>
                      ) : (
                        job.companies?.name || 'Empresa'
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full border-border bg-muted">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full border-border bg-muted">
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-y-3 gap-x-6 mt-6 p-4 rounded-2xl bg-muted border border-border">
                  <div className="flex items-center text-sm text-foreground/80">
                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Localização</p>
                      <p className="font-medium">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-foreground/80">
                    <Briefcase className="mr-2 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Salário</p>
                      <p className="font-medium">{formatSalary(job.salary_min, job.salary_max, job.salary_tbd)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-foreground/80">
                    <Clock className="mr-2 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Contrato</p>
                      <p className="font-medium">{job.job_type}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button className="px-6 py-4 text-sm font-medium text-primary border-b-2 border-primary">
              Descrição da Vaga
            </button>
            <button className="px-6 py-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sobre a Empresa
            </button>
            <button className="px-6 py-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Como se Candidatar
            </button>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Sobre a Vaga</h2>
              <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </section>

            {job.requirements && job.requirements.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Requisitos</h2>
                <ul className="list-disc pl-5 text-foreground/80 space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </section>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <section className="glass-panel p-6 rounded-2xl border-border bg-muted/30">
                <h2 className="text-xl font-semibold text-foreground mb-6">Benefícios</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20 text-primary">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <span className="text-foreground/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sticky top-24">
            <Button variant="gradient" size="lg" className="w-full rounded-full h-14 text-lg font-semibold mb-6 shadow-lg shadow-primary/25">
              Candidatar-se Agora
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
                  <p className="text-sm font-medium text-foreground">{job.companies?.industry || 'Não informado'}</p>
                </div>
              </div>
              
              {job.companies?.description && (
                <div className="text-sm text-muted-foreground line-clamp-3">
                  {job.companies.description}
                </div>
              )}
              
              {job.companies?.website && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Website</p>
                    <a 
                      href={job.companies.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm font-medium text-primary hover:underline flex items-center"
                    >
                      {job.companies.website.replace(/^https?:\/\//, '')}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {job.companies?.id && (
              <Link to={`/empresa/${job.companies.id}`}>
                <Button variant="outline" className="w-full rounded-full mt-6 border-border bg-muted hover:bg-muted/80">
                  Ver Perfil da Empresa
                </Button>
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}