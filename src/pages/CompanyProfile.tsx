import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Building2, Globe, MapPin, Briefcase, ExternalLink, ArrowLeft, Users, Calendar, Clock } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { supabase } from "@/src/lib/supabase"

interface Company {
  id: string
  name: string
  logo_url: string | null
  description: string | null
  website: string | null
  industry: string | null
  open_jobs: number
  created_at: string
}

interface Job {
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
  experience_level: string
  created_at: string
}

export function CompanyProfile() {
  const { id } = useParams<{ id: string }>()
  const [company, setCompany] = useState<Company | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch company
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', id)
          .single()

        if (companyError) throw companyError
        if (!companyData) {
          setError('Empresa não encontrada')
          setLoading(false)
          return
        }

        setCompany(companyData)

        // Fetch jobs for this company
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('company_id', id)
          .order('created_at', { ascending: false })

        if (jobsError) throw jobsError
        setJobs(jobsData || [])

      } catch (error: any) {
        console.error('Erro ao carregar dados da empresa:', error)
        setError(error.message || 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const getCompanyInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }

  const formatSalary = (min: number | null, max: number | null, tbd: boolean) => {
    if (tbd) return 'A combinar'
    if (!min && !max) return 'A combinar'
    const formatYen = (num: number) => `¥${num.toLocaleString('pt-BR')}`
    if (min && max) return `${formatYen(min)} ~ ${formatYen(max)}/mês`
    if (min) return `A partir de ${formatYen(min)}/mês`
    return `Até ${formatYen(max!)}/mês`
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

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="text-muted-foreground">Carregando perfil da empresa...</p>
        </div>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold mb-2">Empresa não encontrada</h2>
          <p className="text-muted-foreground mb-6">{error || 'A empresa solicitada não existe ou foi removida.'}</p>
          <Link to="/empresas">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para empresas
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link to="/empresas" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para empresas
        </Link>
      </div>

      {/* Company Header */}
      <div className="glass-panel rounded-2xl p-8 border-border mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Logo */}
          <div className="h-24 w-24 shrink-0 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden shadow-sm">
            {company.logo_url ? (
              <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain bg-white/5" />
            ) : (
              <span className="text-2xl font-bold text-primary/80">
                {getCompanyInitials(company.name)}
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {company.name}
              </h1>
              {company.industry && (
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  {company.industry}
                </Badge>
              )}
            </div>
            
            {company.description && (
              <p className="text-muted-foreground mt-4 text-lg max-w-3xl">
                {company.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Briefcase className="h-4 w-4 mr-2 text-primary" />
                <span className="font-semibold text-foreground">{company.open_jobs}</span>
                <span className="ml-1">vagas abertas</span>
              </div>
              
              {company.website && (
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  <span>Website</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
              
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Cadastrada em {new Date(company.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Vagas Abertas
          </h2>
          <Badge variant="outline" className="text-sm">
            {jobs.length} vaga{jobs.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link key={job.id} to={`/vagas/${job.id}`}>
                <Card className="glass-panel-hover border-border cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                          {job.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.work_mode}
                          </div>
                          <Badge variant="secondary" className="bg-muted">
                            {job.job_type}
                          </Badge>
                          {job.experience_level && (
                            <Badge variant="secondary" className="bg-muted">
                              {job.experience_level}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {job.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          {(job.requirements ?? []).slice(0, 3).map((req) => (
                            <Badge key={req} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                          {(job.requirements ?? []).length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{(job.requirements ?? []).length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-lg font-bold text-primary">
                          {formatSalary(job.salary_min, job.salary_max, job.salary_tbd)}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(job.created_at)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass-panel rounded-2xl border-border">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhuma vaga aberta no momento.</p>
          </div>
        )}
      </div>
    </div>
  )
}