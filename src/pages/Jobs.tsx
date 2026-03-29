import { useState, useEffect } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { Search, MapPin, Briefcase, Filter, ChevronDown, Clock, Building2, X } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge, BadgeProps } from "@/src/components/ui/badge"
import { supabase } from "@/src/lib/supabase"
import { WORK_AREAS, matchJobToArea } from "@/src/lib/areas"

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
  description?: string
  is_sponsored: boolean
  is_featured: boolean
  created_at: string
  companies: { id: string; name: string; logo_url: string | null } | null
}

const JLPT_OPTIONS = [
  { label: "N1 (Fluente)", value: "N1" },
  { label: "N2 (Avançado)", value: "N2" },
  { label: "N3 (Intermediário)", value: "N3" },
  { label: "N4 (Básico)", value: "N4" },
  { label: "N5 (Iniciante)", value: "N5" },
  { label: "Sem requisito", value: "none" },
]

const CONTRACT_OPTIONS = [
  { label: "CLT (Seishain)", value: "CLT" },
  { label: "Contrato (Keiyaku)", value: "Contrato" },
  { label: "Meio Período (Arubaito)", value: "Arubaito" },
  { label: "Autônomo (Kojin Jigyou Nushi)", value: "Autônomo" },
]

export function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const JOBS_PER_PAGE = 10

  const [allJobs, setAllJobs] = useState<JobWithCompany[]>([])
  const [jobs, setJobs] = useState<JobWithCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "")
  const [locationInput, setLocationInput] = useState(searchParams.get("location") || "")
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedJlpt, setSelectedJlpt] = useState<string[]>([])
  const [selectedContracts, setSelectedContracts] = useState<string[]>([])
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])

  const activeQuery = searchParams.get("q") || ""
  const activeLocation = searchParams.get("location") || ""
  const activeArea = searchParams.get("area") || ""

  useEffect(() => {
    if (activeArea) {
      setSelectedAreas([activeArea])
    }
  }, [activeArea])

  const totalPages = Math.max(1, Math.ceil(jobs.length / JOBS_PER_PAGE))
  const pagedJobs = jobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE)

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true)
      try {
        let query = supabase
          .from('jobs')
          .select('*, companies(id, name, logo_url)')
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false })

        if (activeLocation) {
          query = query.ilike('location', `%${activeLocation}%`)
        }

        const { data, error } = await query
        if (error) throw error
        setAllJobs(data || [])
      } catch (error) {
        console.error('Erro ao carregar vagas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [activeLocation])

  useEffect(() => {
    let filtered = [...allJobs]

    if (activeQuery) {
      const q = activeQuery.toLowerCase()
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(q) ||
        (job.companies?.name || "").toLowerCase().includes(q) ||
        (job.requirements ?? []).some(r => r.toLowerCase().includes(q)) ||
        job.location.toLowerCase().includes(q) ||
        job.work_mode.toLowerCase().includes(q)
      )
    }

    if (selectedJlpt.length > 0) {
      filtered = filtered.filter(job => {
        if (selectedJlpt.includes("none")) {
          if (!job.jlpt_level || job.jlpt_level === "" || job.jlpt_level === "N/A") return true
        }
        return selectedJlpt.some(lvl => lvl !== "none" && job.jlpt_level?.toUpperCase() === lvl)
      })
    }

    if (selectedContracts.length > 0) {
      filtered = filtered.filter(job =>
        selectedContracts.some(ct => job.job_type.toLowerCase().includes(ct.toLowerCase()))
      )
    }

    if (selectedAreas.length > 0) {
      filtered = filtered.filter(job =>
        selectedAreas.some(areaSlug => {
          const area = WORK_AREAS.find(a => a.slug === areaSlug)
          return area ? matchJobToArea(job, area) : false
        })
      )
    }

    setJobs(filtered)
  }, [activeQuery, allJobs, selectedJlpt, selectedContracts, selectedAreas])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeQuery, activeLocation, selectedJlpt, selectedContracts, selectedAreas])

  const handleSearch = () => {
    const params: Record<string, string> = {}
    if (searchInput.trim()) params.q = searchInput.trim()
    if (locationInput) params.location = locationInput
    setSearchParams(params)
    setSelectedAreas([])
  }

  const toggleJlpt = (value: string) => {
    setSelectedJlpt(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  const toggleContract = (value: string) => {
    setSelectedContracts(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  const toggleArea = (slug: string) => {
    setSelectedAreas(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
      const newParams: Record<string, string> = {}
      if (activeQuery) newParams.q = activeQuery
      if (activeLocation) newParams.location = activeLocation
      if (next.length === 1) newParams.area = next[0]
      setSearchParams(newParams)
      return next
    })
  }

  const clearAllFilters = () => {
    setSelectedJlpt([])
    setSelectedContracts([])
    setSelectedAreas([])
    const newParams: Record<string, string> = {}
    if (activeQuery) newParams.q = activeQuery
    if (activeLocation) newParams.location = activeLocation
    setSearchParams(newParams)
  }

  const hasActiveFilters = selectedJlpt.length > 0 || selectedContracts.length > 0 || selectedAreas.length > 0

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | "...")[] = [1]
    if (currentPage > 3) pages.push("...")
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push("...")
    pages.push(totalPages)
    return pages
  }

  const formatSalary = (min: number | null, max: number | null) => {
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

  const getCompanyInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Search Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Buscar Vagas</h1>
        <div className="bg-card border border-border p-2 rounded-full flex flex-col md:flex-row gap-2 shadow-sm">
          <div className="flex-1 flex items-center px-4 bg-muted rounded-full border border-border">
            <Search className="h-5 w-5 text-muted-foreground mr-3" />
            <input 
              type="text" 
              placeholder="Cargo, habilidade ou empresa..." 
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="w-full bg-transparent border-none focus:outline-none text-foreground h-12 placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex-1 flex items-center px-4 bg-muted rounded-full border border-border">
            <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
            <select 
              name="region"
              value={locationInput}
              onChange={e => setLocationInput(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-foreground h-12 appearance-none cursor-pointer"
            >
              <option value="">Todas as Localidades</option>
              <optgroup label="Principais cidades">
                <option value="Tokyo">Tokyo</option>
                <option value="Osaka">Osaka</option>
                <option value="Kyoto">Kyoto</option>
                <option value="Yokohama">Yokohama</option>
                <option value="Nagoya">Nagoya</option>
                <option value="Fukuoka">Fukuoka</option>
                <option value="Sapporo">Sapporo</option>
                <option value="Kobe">Kobe</option>
                <option value="Hiroshima">Hiroshima</option>
                <option value="Sendai">Sendai</option>
              </optgroup>
              <optgroup label="Todas as províncias">
                <option value="Hokkaido">Hokkaido</option>
                <option value="Aomori">Aomori</option>
                <option value="Iwate">Iwate</option>
                <option value="Miyagi">Miyagi</option>
                <option value="Akita">Akita</option>
                <option value="Yamagata">Yamagata</option>
                <option value="Fukushima">Fukushima</option>
                <option value="Ibaraki">Ibaraki</option>
                <option value="Tochigi">Tochigi</option>
                <option value="Gunma">Gunma</option>
                <option value="Saitama">Saitama</option>
                <option value="Chiba">Chiba</option>
                <option value="Kanagawa">Kanagawa</option>
                <option value="Niigata">Niigata</option>
                <option value="Toyama">Toyama</option>
                <option value="Ishikawa">Ishikawa</option>
                <option value="Fukui">Fukui</option>
                <option value="Yamanashi">Yamanashi</option>
                <option value="Nagano">Nagano</option>
                <option value="Gifu">Gifu</option>
                <option value="Shizuoka">Shizuoka</option>
                <option value="Aichi">Aichi</option>
                <option value="Mie">Mie</option>
                <option value="Shiga">Shiga</option>
                <option value="Hyogo">Hyogo</option>
                <option value="Nara">Nara</option>
                <option value="Wakayama">Wakayama</option>
                <option value="Tottori">Tottori</option>
                <option value="Shimane">Shimane</option>
                <option value="Okayama">Okayama</option>
                <option value="Yamaguchi">Yamaguchi</option>
                <option value="Tokushima">Tokushima</option>
                <option value="Kagawa">Kagawa</option>
                <option value="Ehime">Ehime</option>
                <option value="Kochi">Kochi</option>
                <option value="Saga">Saga</option>
                <option value="Nagasaki">Nagasaki</option>
                <option value="Kumamoto">Kumamoto</option>
                <option value="Oita">Oita</option>
                <option value="Miyazaki">Miyazaki</option>
                <option value="Kagoshima">Kagoshima</option>
                <option value="Okinawa">Okinawa</option>
              </optgroup>
              <optgroup label="Outro">
                <option value="Remoto">Remoto</option>
                <option value="Outro">Outro</option>
              </optgroup>
            </select>
          </div>
          <Button size="lg" onClick={handleSearch} className="w-full md:w-auto rounded-full px-8 h-12 bg-primary text-primary-foreground hover:bg-primary/90">
            Buscar
          </Button>
        </div>

        {/* Active filter chips */}
        {(activeQuery || activeLocation || hasActiveFilters) && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Filtrando por:</span>
            {activeQuery && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                "{activeQuery}"
                <button onClick={() => { setSearchInput(""); setSearchParams(activeLocation ? { location: activeLocation } : {}); }} className="ml-1 hover:text-primary/60">×</button>
              </span>
            )}
            {activeLocation && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                {activeLocation}
                <button onClick={() => { setLocationInput(""); setSearchParams(activeQuery ? { q: activeQuery } : {}); }} className="ml-1 hover:text-primary/60">×</button>
              </span>
            )}
            {selectedJlpt.map(lvl => {
              const opt = JLPT_OPTIONS.find(o => o.value === lvl)
              return (
                <span key={lvl} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                  {opt?.label || lvl}
                  <button onClick={() => toggleJlpt(lvl)} className="ml-1 hover:text-primary/60">×</button>
                </span>
              )
            })}
            {selectedContracts.map(ct => {
              const opt = CONTRACT_OPTIONS.find(o => o.value === ct)
              return (
                <span key={ct} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                  {opt?.label || ct}
                  <button onClick={() => toggleContract(ct)} className="ml-1 hover:text-primary/60">×</button>
                </span>
              )
            })}
            {selectedAreas.map(slug => {
              const area = WORK_AREAS.find(a => a.slug === slug)
              return (
                <span key={slug} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                  {area?.icon} {area?.label || slug}
                  <button onClick={() => toggleArea(slug)} className="ml-1 hover:text-primary/60">×</button>
                </span>
              )
            })}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm px-2 py-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-3 w-3" /> Limpar filtros
              </button>
            )}
          </div>
        )}
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

            {/* JLPT Level */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Nível de Japonês</h3>
              <div className="space-y-3">
                {JLPT_OPTIONS.map(({ label, value }) => {
                  const checked = selectedJlpt.includes(value)
                  return (
                    <label key={value} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleJlpt(value)}>
                      <div className={`w-5 h-5 rounded border transition-colors flex items-center justify-center shrink-0 ${
                        checked
                          ? 'bg-primary border-primary'
                          : 'border-border bg-muted group-hover:border-primary'
                      }`}>
                        {checked && (
                          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${checked ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                        {label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            {/* Contract Type */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Tipo de Contrato</h3>
              <div className="space-y-3">
                {CONTRACT_OPTIONS.map(({ label, value }) => {
                  const checked = selectedContracts.includes(value)
                  return (
                    <label key={value} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleContract(value)}>
                      <div className={`w-5 h-5 rounded border transition-colors flex items-center justify-center shrink-0 ${
                        checked
                          ? 'bg-primary border-primary'
                          : 'border-border bg-muted group-hover:border-primary'
                      }`}>
                        {checked && (
                          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${checked ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                        {label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            {/* Área de Trabalho */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Área de Trabalho</h3>
              <div className="space-y-3">
                {WORK_AREAS.map((area) => {
                  const checked = selectedAreas.includes(area.slug)
                  return (
                    <label key={area.slug} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleArea(area.slug)}>
                      <div className={`w-5 h-5 rounded border transition-colors flex items-center justify-center shrink-0 ${
                        checked
                          ? 'bg-primary border-primary'
                          : 'border-border bg-muted group-hover:border-primary'
                      }`}>
                        {checked && (
                          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm transition-colors flex items-center gap-1.5 ${checked ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                        <span>{area.icon}</span>
                        <span>{area.label}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={clearAllFilters}
              disabled={!hasActiveFilters}
            >
              Limpar Filtros
            </Button>
          </div>
        </aside>

        {/* Job List */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Mostrando <span className="text-foreground font-medium">{jobs.length}</span> vaga{jobs.length !== 1 ? "s" : ""}
              {(activeQuery || activeLocation || hasActiveFilters) && allJobs.length !== jobs.length && (
                <span className="ml-1">de {allJobs.length} total</span>
              )}
            </p>
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
            ) : pagedJobs.length > 0 ? (
              pagedJobs.map((job) => (
                <Card key={job.id} className={`glass-panel-hover flex flex-col sm:flex-row gap-6 p-6 transition-all cursor-pointer border-border ${job.is_featured ? 'border-primary/30 glow-primary/10 bg-primary/5' : ''}`}>
                  {job.companies?.logo_url ? (
                    <img 
                      src={job.companies.logo_url} 
                      alt={job.companies.name} 
                      className="h-16 w-16 rounded-xl border border-border object-contain bg-white/5 shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-none bg-muted border border-border flex items-center justify-center text-xl font-bold text-foreground shadow-sm shrink-0">
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
                          {job.companies?.id ? (
                            <Link to={`/empresa/${job.companies.id}`} className="hover:text-primary transition-colors hover:underline">
                              {job.companies.name || 'Empresa'}
                            </Link>
                          ) : (
                            job.companies?.name || 'Empresa'
                          )}
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
                <p className="text-lg mb-2">Nenhuma vaga encontrada.</p>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="text-primary hover:underline text-sm">
                    Limpar filtros e tentar novamente
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10"
                disabled={currentPage === 1}
                onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>

              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span key={`ellipsis-${idx}`} className="text-muted-foreground px-1">…</span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="icon"
                    className="rounded-full w-10 h-10"
                    onClick={() => { setCurrentPage(page as number); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10"
                disabled={currentPage === totalPages}
                onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              >
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
