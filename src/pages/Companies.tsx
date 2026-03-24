import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Building2, Globe, MapPin, Briefcase, ExternalLink } from "lucide-react"
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
}

export function Companies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .order('open_jobs', { ascending: false })

        if (error) throw error
        setCompanies(data || [])
      } catch (error) {
        console.error('Erro ao carregar empresas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  const getCompanyInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Empresas</h1>
        <p className="text-muted-foreground">
          Conheça as empresas que estão contratando no Japão.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-muted" />
                  <div className="flex-1">
                    <div className="h-6 w-3/4 bg-muted rounded mb-2" />
                    <div className="h-4 w-1/2 bg-muted rounded" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-muted rounded mb-2" />
                <div className="h-4 w-2/3 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="glass-panel-hover group cursor-pointer border-border">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  {company.logo_url ? (
                    <img 
                      src={company.logo_url} 
                      alt={company.name} 
                      className="h-16 w-16 rounded-xl border border-border object-contain bg-white/5"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-muted to-background border border-border flex items-center justify-center text-xl font-bold text-foreground shadow-lg group-hover:glow-primary transition-all">
                      {getCompanyInitials(company.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors truncate">
                      {company.name}
                    </CardTitle>
                    {company.industry && (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        {company.industry}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {company.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {company.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center text-sm text-foreground/80">
                    <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-primary">{company.open_jobs}</span>
                    <span className="text-muted-foreground ml-1">vagas abertas</span>
                  </div>
                  
                  {company.website && (
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma empresa cadastrada ainda.</p>
        </div>
      )}
    </div>
  )
}
