import { Link } from "react-router-dom"
import { Search, MapPin, Briefcase, Filter, ChevronDown, Clock, Building2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"

const JOBS = [
  {
    id: 1,
    title: "Desenvolvedor Front-end Sênior",
    company: "TechNova Tokyo",
    location: "Tóquio (Híbrido)",
    salary: "¥6M - ¥9M / ano",
    type: "CLT (Seishain)",
    jlpt: "N3",
    tags: ["React", "TypeScript", "Tailwind"],
    postedAt: "Há 2 horas",
    featured: true,
    logo: "TN"
  },
  {
    id: 2,
    title: "Especialista em Marketing Digital",
    company: "Global Reach Inc.",
    location: "Osaka",
    salary: "¥4.5M - ¥6M / ano",
    type: "CLT (Seishain)",
    jlpt: "N2",
    tags: ["SEO", "Google Ads", "Conteúdo"],
    postedAt: "Há 5 horas",
    featured: false,
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
    postedAt: "Ontem",
    featured: true,
    logo: "FJ"
  },
  {
    id: 4,
    title: "Professor de Inglês (ALT)",
    company: "EduCorp",
    location: "Kyoto",
    salary: "¥3M - ¥3.5M / ano",
    type: "Contrato (Keiyaku)",
    jlpt: "N5",
    tags: ["Educação", "Inglês Nativo"],
    postedAt: "Ontem",
    featured: false,
    logo: "EC"
  },
  {
    id: 5,
    title: "Gerente de Projetos de TI",
    company: "Innova Solutions",
    location: "Fukuoka",
    salary: "¥6M - ¥8.5M / ano",
    type: "CLT (Seishain)",
    jlpt: "N2",
    tags: ["Agile", "Scrum", "Liderança"],
    postedAt: "Há 2 dias",
    featured: false,
    logo: "IS"
  }
]

export function Jobs() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Search Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Buscar Vagas</h1>
        <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex items-center px-4 bg-white/5 rounded-xl border border-white/5">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Cargo, habilidade ou empresa..." 
              className="w-full bg-transparent border-none focus:outline-none text-white h-12 placeholder:text-gray-500"
            />
          </div>
          <div className="flex-1 flex items-center px-4 bg-white/5 rounded-xl border border-white/5">
            <MapPin className="h-5 w-5 text-gray-400 mr-3" />
            <select 
              name="region"
              defaultValue=""
              className="w-full bg-transparent border-none focus:outline-none text-white h-12 appearance-none cursor-pointer"
            >
              <option value="" className="bg-gray-900">Todas as Localidades</option>
              <optgroup label="Região" className="bg-gray-900">
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
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Nível de Japonês</h3>
              <div className="space-y-3">
                {["N1 (Fluente)", "N2 (Avançado)", "N3 (Intermediário)", "N4 (Básico)", "N5 (Iniciante)", "Sem requisito"].map((level) => (
                  <label key={level} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-white/20 bg-black/20 group-hover:border-primary transition-colors flex items-center justify-center">
                      {/* Checkbox icon would go here when active */}
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Tipo de Contrato</h3>
              <div className="space-y-3">
                {["CLT (Seishain)", "Contrato (Keiyaku)", "Meio Período (Arubaito)", "Autônomo (Kojin Jigyou Nushi)"].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-white/20 bg-black/20 group-hover:border-primary transition-colors flex items-center justify-center" />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Indústria</h3>
              <div className="space-y-3">
                {["TI & Software", "Educação", "Engenharia", "Vendas & Marketing", "Finanças"].map((ind) => (
                  <label key={ind} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-white/20 bg-black/20 group-hover:border-primary transition-colors flex items-center justify-center" />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{ind}</span>
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
            <p className="text-sm text-gray-400">Mostrando <span className="text-white font-medium">124</span> vagas</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Ordenar por:</span>
              <Button variant="ghost" size="sm" className="h-8 rounded-full bg-white/5 border border-white/10">
                Mais recentes <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {JOBS.map((job) => (
              <Card key={job.id} className={`glass-panel-hover flex flex-col sm:flex-row gap-6 p-6 transition-all cursor-pointer border-white/5 ${job.featured ? 'border-primary/30 glow-primary/10 bg-primary/5' : ''}`}>
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-xl font-bold text-white shadow-lg shrink-0">
                  {job.logo}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
                          <Link to={`/vagas/${job.id}`} className="hover:underline">{job.title}</Link>
                        </h3>
                        {job.featured && (
                          <Badge variant="glass" className="bg-primary/20 text-primary border-primary/30 text-[10px] uppercase tracking-wider py-0">
                            Destaque
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Building2 className="mr-1.5 h-4 w-4" />
                        {job.company}
                      </div>
                    </div>
                    <Badge variant={job.jlpt.toLowerCase() as any} className="font-mono self-start">{job.jlpt}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-y-2 gap-x-6 mb-4 mt-4">
                    <div className="flex items-center text-sm text-gray-300">
                      <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                      {job.salary}
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <Clock className="mr-2 h-4 w-4 text-gray-500" />
                      {job.type}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-white/5 text-gray-300 hover:bg-white/10">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500 hidden sm:inline-block">{job.postedAt}</span>
                      <Button variant="secondary" size="sm" className="rounded-full bg-white/10 hover:bg-white/20" asChild>
                        <Link to={`/vagas/${job.id}`}>Ver Vaga</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
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
