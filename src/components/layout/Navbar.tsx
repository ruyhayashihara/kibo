import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { Briefcase, Sun, Moon, Shield } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, isAdmin, isCompany, isCandidate, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + nav links */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent glow-primary">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Kibo<span className="text-primary">Jobs</span>
            </span>
          </Link>

          {/* Nav links — always visible, condensed on mobile */}
          <nav className="flex items-center gap-1 sm:gap-6 text-sm font-medium text-muted-foreground">
            <Link
              to="/vagas"
              className="px-2 py-1 rounded-md hover:text-foreground hover:bg-muted transition-colors"
            >
              Vagas
            </Link>
            <Link
              to="/empresas"
              className="px-2 py-1 rounded-md hover:text-foreground hover:bg-muted transition-colors"
            >
              Empresas
            </Link>
            {isCandidate && (
              <Link to="/dashboard" className="hidden sm:block hover:text-foreground transition-colors">
                Dashboard
              </Link>
            )}
            {isCompany && (
              <Link to="/empresa/dashboard" className="hidden sm:block hover:text-foreground transition-colors">
                Painel Empresa
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Right: actions */}
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
              {isAdmin && (
                <Button variant="gradient" asChild className="rounded-full hidden sm:inline-flex">
                  <Link to="/admin">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Link>
                </Button>
              )}
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
              <Button variant="ghost" asChild className="rounded-full text-muted-foreground hover:text-foreground">
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
