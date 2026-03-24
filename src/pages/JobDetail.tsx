import { Link, useParams } from "react-router-dom"
import { MapPin, Briefcase, Building2, Clock, Globe, GraduationCap, ChevronLeft, Share2, BookmarkPlus } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"

export function JobDetail() {
  const { id } = useParams()
  
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
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-muted to-background border border-border flex items-center justify-center text-3xl font-bold text-foreground shadow-xl shrink-0">
                TN
              </div>
              
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Desenvolvedor Front-end Sênior</h1>
                    <div className="flex items-center text-lg text-primary font-medium">
                      <Building2 className="mr-2 h-5 w-5" />
                      TechNova Tokyo
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
                      <p className="font-medium">Tóquio (Híbrido)</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-foreground/80">
                    <Briefcase className="mr-2 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Salário</p>
                      <p className="font-medium">¥6M - ¥9M / ano</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-foreground/80">
                    <Clock className="mr-2 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Contrato</p>
                      <p className="font-medium">CLT (Seishain)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs (Visual only for now) */}
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
              <p className="text-foreground/80 leading-relaxed">
                Estamos procurando um Desenvolvedor Front-end Sênior talentoso e apaixonado para se juntar à nossa equipe em expansão em Tóquio. Você será responsável por arquitetar e desenvolver interfaces de usuário escaláveis e de alto desempenho para nossos principais produtos SaaS.
              </p>
              <p className="text-foreground/80 leading-relaxed mt-4">
                O candidato ideal tem profunda experiência com React, TypeScript e ecossistemas modernos de front-end, além de um forte senso de design e UX.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Responsabilidades</h2>
              <ul className="list-disc pl-5 text-foreground/80 space-y-2">
                <li>Liderar o desenvolvimento de novas features usando React e TypeScript.</li>
                <li>Colaborar com designers e gerentes de produto para traduzir requisitos em interfaces elegantes.</li>
                <li>Otimizar aplicações para máxima velocidade e escalabilidade.</li>
                <li>Mentorar desenvolvedores juniores e realizar revisões de código.</li>
                <li>Participar ativamente nas decisões de arquitetura de software.</li>
              </ul>
            </section>

            <section className="glass-panel p-6 rounded-2xl border-border bg-muted/30">
              <h2 className="text-xl font-semibold text-foreground mb-6">Requisitos</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Nível de Japonês</h3>
                    <p className="text-sm text-muted-foreground mt-1">N3 (Intermediário) ou superior. Capacidade de participar de reuniões técnicas.</p>
                    <Badge variant="n3" className="mt-2 font-mono">JLPT N3</Badge>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-accent/20 text-accent">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Nível de Inglês</h3>
                    <p className="text-sm text-muted-foreground mt-1">Avançado/Fluente. A documentação técnica é toda em inglês.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Experiência</h3>
                    <p className="text-sm text-muted-foreground mt-1">5+ anos em desenvolvimento front-end, 3+ anos com React.</p>
                  </div>
                </div>
              </div>
            </section>
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
              <p className="font-medium text-foreground">20 de Março de 2026</p>
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
                  <p className="text-sm font-medium text-foreground">Tecnologia / SaaS</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tamanho</p>
                  <p className="text-sm font-medium text-foreground">50 - 200 funcionários</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Website</p>
                  <a href="https://technova.jp" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">technova.jp</a>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full rounded-full mt-6 border-border bg-muted hover:bg-muted/80">
              Ver Perfil da Empresa
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
