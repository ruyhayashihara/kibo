import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { Briefcase, Sun, Moon } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent glow-primary">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Kibo<span className="text-primary">Jobs</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/vagas" className="hover:text-foreground transition-colors">Vagas</Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/empresa/dashboard" className="hover:text-foreground transition-colors">Empresas</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Alternar tema"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          {user ? (
            <>
              <span className="hidden lg:inline-block text-xs text-muted-foreground mr-2 truncate max-w-[150px]">
                {user.email}
              </span>
              <Button 
                variant="ghost" 
                onClick={() => signOut()}
                className="rounded-full text-muted-foreground hover:text-red-500"
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex rounded-full text-muted-foreground hover:text-foreground">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button variant="gradient" asChild className="rounded-full">
                <Link to="/cadastro">Cadastrar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
