import { Link } from "react-router-dom"
import { Briefcase, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/50 backdrop-blur-lg pt-16 pb-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Kibo<span className="text-primary">Jobs</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs mb-6">
              A principal plataforma para estrangeiros encontrarem as melhores oportunidades de trabalho no Japão.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Candidatos</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/vagas" className="hover:text-white transition-colors">Buscar Vagas</Link></li>
              <li><Link to="/cadastro" className="hover:text-white transition-colors">Cadastrar Currículo</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Alerta de Vagas</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Dicas de Carreira</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Empresas</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">Anunciar Vaga</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Buscar Currículos</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Planos e Preços</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Sobre</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">Quem Somos</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Contato</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Termos de Uso</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Privacidade</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} KiboJobs. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>Português (BR)</span>
            <span>¥ JPY</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
