import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { Briefcase, Sun, Moon, Shield, Menu, X } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, isAdmin, isCompany, isCandidate, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      {/* Main row */}
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={closeMobile}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent glow-primary">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Kibo<span className="text-primary">Jobs</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link to="/vagas" className="hover:text-foreground transition-colors">Vagas</Link>
          <Link to="/empresas" className="hover:text-foreground transition-colors">Empresas</Link>
          {isCandidate && (
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          )}
          {isCompany && (
            <Link to="/empresa/dashboard" className="hover:text-foreground transition-colors">Painel Empresa</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors font-semibold">
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full text-muted-foreground hover:text-foreground" aria-label="Alternar tema">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          {user ? (
            <>
              <span className="hidden lg:inline-block text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</span>
              <Button variant="ghost" onClick={() => signOut()} className="rounded-full text-muted-foreground hover:text-red-500">Sair</Button>
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

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full text-muted-foreground hover:text-foreground" aria-label="Alternar tema">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(prev => !prev)} className="rounded-full text-muted-foreground hover:text-foreground" aria-label="Menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="container mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
            <Link to="/vagas" onClick={closeMobile} className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              Vagas
            </Link>
            <Link to="/empresas" onClick={closeMobile} className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              Empresas
            </Link>
            {isCandidate && (
              <Link to="/dashboard" onClick={closeMobile} className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                Dashboard
              </Link>
            )}
            {isCompany && (
              <Link to="/empresa/dashboard" onClick={closeMobile} className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                Painel Empresa
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={closeMobile} className="px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:text-primary/80 hover:bg-muted transition-colors flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}

            <div className="border-t border-border mt-2 pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <span className="px-3 text-xs text-muted-foreground truncate">{user.email}</span>
                  <Button variant="ghost" onClick={() => { signOut(); closeMobile() }} className="rounded-full w-full text-muted-foreground hover:text-red-500">
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="rounded-full w-full text-muted-foreground hover:text-foreground">
                    <Link to="/login" onClick={closeMobile}>Entrar</Link>
                  </Button>
                  <Button variant="gradient" asChild className="rounded-full w-full">
                    <Link to="/cadastro" onClick={closeMobile}>Cadastrar</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
