import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Briefcase, User, Building2, Check } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"
import { useNavigate, useLocation } from "react-router-dom"

export function Register() {
  const [isLogin, setIsLogin] = useState(false)
  const [userType, setUserType] = useState<"candidate" | "company" | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  // Company form fields
  const [companyName, setCompanyName] = useState("")
  const [companyIndustry, setCompanyIndustry] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [companyCity, setCompanyCity] = useState("")
  const [companyPhone, setCompanyPhone] = useState("")
  
  const { user, signIn, isAdmin, isCompany, isCandidate } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = (location.state as any)?.from?.pathname || "/"

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin', { replace: true })
      } else if (isCompany) {
        navigate('/empresas/dashboard', { replace: true })
      } else if (isCandidate) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    }
  }, [user, isAdmin, isCompany, isCandidate, navigate, from])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await signIn(email, password)
      if (error) throw error
      
      // Navigation is handled by the useEffect above which reacts to auth state changes
    } catch (error: any) {
      setError(error.message || "Erro ao entrar. Verifique suas credenciais.")
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // If it's a login attempt, use the new handleLogin function
      if (isLogin) {
        await handleLogin(e); // Call handleLogin for login
      } else {
        // Otherwise, proceed with sign-up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: userType,
              is_admin: email.endsWith('@kibojobs.com') // Demo logic for admin
            }
          }
        })
        if (error) throw error
        
        // If user is a company, create company record
        if (userType === "company" && data.user) {
          const { error: companyError } = await supabase
            .from('companies')
            .insert({
              name: companyName || 'Nova Empresa',
              industry: companyIndustry || null,
              description: null,
              website: null,
              logo_url: null,
              open_jobs: 0,
              user_id: data.user.id
            })
          
          if (companyError) {
            console.error('Erro ao criar empresa:', companyError)
          }
        }
        
        alert("Cadastro realizado! Verifique seu email.")
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro na autenticação")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex justify-center min-h-[calc(100vh-4rem)] items-center">
      <div className="w-full max-w-2xl relative">

        <div className="glass-panel rounded-3xl p-8 md:p-12 relative z-10 border-border">
          <div className="text-center mb-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-none bg-primary mb-6 shadow-sm">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? "Entre com suas credenciais para continuar." : "Escolha o tipo de conta para começar."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="grid grid-cols-2 gap-4 mb-10">
              <button
                onClick={() => setUserType("candidate")}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                  userType === "candidate"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-muted hover:bg-muted/80"
                }`}
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 ${userType === "candidate" ? "bg-primary text-white" : "bg-background border border-border text-muted-foreground"}`}>
                  <User className="h-6 w-6" />
                </div>
                <span className={`font-semibold ${userType === "candidate" ? "text-foreground" : "text-muted-foreground"}`}>Sou candidato</span>
              </button>

              <button
                onClick={() => setUserType("company")}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                  userType === "company"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-muted hover:bg-muted/80"
                }`}
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 ${userType === "company" ? "bg-primary text-white" : "bg-background border border-border text-muted-foreground"}`}>
                  <Building2 className="h-6 w-6" />
                </div>
                <span className={`font-semibold ${userType === "company" ? "text-foreground" : "text-muted-foreground"}`}>Sou empresa</span>
              </button>
            </div>
          )}

          {(isLogin || userType) && (
            <form onSubmit={handleAuth} className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              {isLogin ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Email</label>
                    <Input 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Senha</label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Demo Admin Login Button */}
                  <div className="pt-2">
                    <Button 
                      type="button"
                      variant="outline"
                      className="w-full border-primary/30 hover:bg-primary/10 text-primary text-xs h-8"
                      onClick={() => {
                        setEmail("admin@kibojobs.com");
                        setPassword("admin123");
                      }}
                    >
                      Preencher credenciais de Admin (Demo)
                    </Button>
                    <p className="text-[10px] text-muted-foreground mt-1 text-center">
                      Use estas credenciais para testar a proteção da rota /admin.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {userType === "candidate" ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Nome completo</label>
                          <Input placeholder="Ex: João da Silva" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Email</label>
                          <Input 
                            type="email" 
                            placeholder="joao@exemplo.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Senha</label>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Confirmar senha</label>
                          <Input type="password" placeholder="••••••••" required />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Área de interesse</label>
                          <select defaultValue="" className="flex h-10 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none">
                            <option value="" disabled className="bg-background">Selecione...</option>
                            <option value="it" className="bg-background">TI & Software</option>
                            <option value="engineering" className="bg-background">Engenharia</option>
                            <option value="marketing" className="bg-background">Vendas & Marketing</option>
                            <option value="education" className="bg-background">Educação</option>
                            <option value="other" className="bg-background">Outros</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Estado</label>
                          <Input placeholder="Ex: Osaka" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Nome da empresa</label>
                          <Input 
                            placeholder="Ex: Tech Solutions" 
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Email corporativo</label>
                          <Input 
                            type="email" 
                            placeholder="contato@empresa.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Senha</label>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Confirmar senha</label>
                          <Input type="password" placeholder="••••••••" required />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Setor</label>
                          <select 
                            value={companyIndustry}
                            onChange={(e) => setCompanyIndustry(e.target.value)}
                            className="flex h-10 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none"
                          >
                            <option value="" className="bg-background">Selecione...</option>
                            <option value="Tecnologia" className="bg-background">Tecnologia</option>
                            <option value="Indústria" className="bg-background">Indústria</option>
                            <option value="Serviços" className="bg-background">Serviços</option>
                            <option value="Comércio" className="bg-background">Comércio</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Tamanho da empresa</label>
                          <select 
                            value={companySize}
                            onChange={(e) => setCompanySize(e.target.value)}
                            className="flex h-10 w-full rounded-full border border-border bg-input px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none"
                          >
                            <option value="" className="bg-background">Selecione...</option>
                            <option value="1-10" className="bg-background">1-10 funcionários</option>
                            <option value="11-50" className="bg-background">11-50 funcionários</option>
                            <option value="51-200" className="bg-background">51-200 funcionários</option>
                            <option value="201+" className="bg-background">Mais de 200</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Cidade</label>
                          <Input 
                            placeholder="Ex: Tóquio" 
                            value={companyCity}
                            onChange={(e) => setCompanyCity(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Telefone</label>
                          <Input 
                            placeholder="Ex: +81 00-0000-0000" 
                            value={companyPhone}
                            onChange={(e) => setCompanyPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-start space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setAgreedToTerms(!agreedToTerms)}
                      className={`mt-0.5 h-5 w-5 shrink-0 rounded border border-border transition-colors flex items-center justify-center ${
                        agreedToTerms ? "bg-primary border-primary" : "bg-muted"
                      }`}
                    >
                      {agreedToTerms && <Check className="h-3.5 w-3.5 text-white" />}
                    </button>
                    <label className="text-sm text-muted-foreground leading-tight cursor-pointer" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                      Concordo com os <Link to="/termos" className="text-primary hover:underline">Termos de uso</Link> e <Link to="/privacidade" className="text-primary hover:underline">Política de privacidade</Link>
                    </label>
                  </div>
                </>
              )}

              <Button 
                variant="default" 
                className="w-full rounded-full h-12 text-base font-semibold mt-4"
                type="submit"
                disabled={loading}
              >
                {loading ? "Processando..." : (isLogin ? "Entrar" : "Criar conta")}
              </Button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-4 text-muted-foreground">ou continue com</span>
                </div>
              </div>

              <Button variant="outline" className="w-full rounded-full h-12" type="button">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Google
              </Button>
              
              <p className="text-center text-sm text-muted-foreground mt-6">
                {isLogin ? "Ainda não tem uma conta?" : "Já tem uma conta?"} {" "}
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? "Criar conta" : "Entrar"}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

