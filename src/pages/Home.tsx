import { Link } from "react-router-dom"
import { Search, MapPin, Briefcase, Building2, Globe, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"

const FEATURED_JOBS = [
  {
    id: 1,
    title: "Desenvolvedor Front-end Sênior",
    company: "TechNova Tokyo",
    location: "Tóquio (Híbrido)",
    salary: "¥6M - ¥9M / ano",
    type: "CLT",
    jlpt: "N3",
    tags: ["React", "TypeScript", "Tailwind"],
    logo: "TN"
  },
  {
    id: 2,
    title: "Especialista em Marketing Digital",
    company: "Global Reach Inc.",
    location: "Osaka",
    salary: "¥4.5M - ¥6M / ano",
    type: "CLT",
    jlpt: "N2",
    tags: ["SEO", "Google Ads", "Conteúdo"],
    logo: "GR"
  },
  {
    id: 3,
    title: "Engenheiro de Software Backend",
    company: "FinTech Japan",
    location: "Tóquio (Remoto)",
    salary: "¥7M - ¥11M / ano",
    type: "Autônomo (Kojin Jigyou Nushi)",
    jlpt: "N4",
    tags: ["Node.js", "Python", "AWS"],
    logo: "FJ"
  },
  {
    id: 4,
    title: "Professor de Inglês (ALT)",
    company: "EduCorp",
    location: "Kyoto",
    salary: "¥3M - ¥3.5M / ano",
    type: "Temporário",
    jlpt: "N5",
    tags: ["Educação", "Inglês Nativo"],
    logo: "EC"
  },
  {
    id: 5,
    title: "Gerente de Projetos de TI",
    company: "Innova Solutions",
    location: "Fukuoka",
    salary: "¥6M - ¥8.5M / ano",
    type: "CLT",
    jlpt: "N2",
    tags: ["Agile", "Scrum", "Liderança"],
    logo: "IS"
  },
  {
    id: 6,
    title: "Analista de Suporte Bilíngue",
    company: "SupportTech",
    location: "Yokohama",
    salary: "¥3.5M - ¥5M / ano",
    type: "CLT",
    jlpt: "N1",
    tags: ["Atendimento", "TI", "Inglês"],
    logo: "ST"
  }
]

export function Home() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="glass" className="mb-6 py-1.5 px-4 text-sm border-primary/30 text-primary-foreground/90">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
            Mais de 2.500 vagas abertas hoje
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 glow-text text-foreground">
            Encontre sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">vaga ideal</span><br /> no Japão
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Conectamos profissionais internacionais às melhores empresas japonesas. 
            Oportunidades que valorizam seu talento e diversidade.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto glass-panel p-2 rounded-full flex flex-col md:flex-row gap-2">
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
            <Button size="lg" variant="gradient" className="w-full md:w-auto rounded-full px-8 h-12">
              Buscar Vagas
            </Button>
          </div>
          
          {/* Quick Filters */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <span className="text-sm text-gray-500 flex items-center mr-2">Buscas populares:</span>
            {["TI & Software", "Engenharia", "Marketing", "Nível N3+", "Inglês Nativo", "Remoto"].map((tag) => (
              <Badge key={tag} variant="glass" className="hover:bg-white/10 cursor-pointer transition-colors py-1.5 px-4">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>
      
      {/* Ad Banner Slot */}
      <section className="container mx-auto max-w-7xl px-4 flex flex-col items-center -mt-8 mb-16">
        <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Anúncio</span>
        <div className="w-[320px] h-[50px] md:w-[728px] md:h-[90px] bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-500 text-xs md:text-sm font-medium">
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
          {FEATURED_JOBS.map((job) => (
            <Card key={job.id} className="glass-panel-hover flex flex-col group cursor-pointer border-border">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-muted to-background border border-border flex items-center justify-center text-xl font-bold text-foreground shadow-lg group-hover:glow-primary transition-all">
                    {job.logo}
                  </div>
                  <Badge variant={job.jlpt.toLowerCase() as any} className="font-mono">{job.jlpt}</Badge>
                </div>
                <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors text-foreground">{job.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building2 className="mr-1.5 h-4 w-4" />
                  {job.company}
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
                    {job.salary}
                  </div>
                  <div className="flex items-center text-sm text-foreground/80">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    {job.type}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80">
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
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" className="w-full rounded-full" asChild>
            <Link to="/vagas">Ver todas as vagas</Link>
          </Button>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">Empresas Contratando</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Junte-se a milhares de estrangeiros trabalhando nas empresas mais inovadoras do Japão.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 relative z-10">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer group">
                <Building2 className="h-8 w-8 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
