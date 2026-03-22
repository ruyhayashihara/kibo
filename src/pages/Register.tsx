import { useState } from "react"
import { Link } from "react-router-dom"
import { Briefcase, User, Building2, Check } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"

export function Register() {
  const [userType, setUserType] = useState<"candidate" | "company" | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex justify-center min-h-[calc(100vh-4rem)] items-center">
      <div className="w-full max-w-2xl relative">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="glass-panel rounded-3xl p-8 md:p-12 relative z-10 border-white/10">
          <div className="text-center mb-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent mb-6 glow-primary">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Crie sua conta</h1>
            <p className="text-gray-400">Escolha o tipo de conta para começar.</p>
          </div>

          {/* User Type Selector */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <button
              onClick={() => setUserType("candidate")}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                userType === "candidate"
                  ? "border-primary bg-primary/10"
                  : "border-white/5 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 ${userType === "candidate" ? "bg-primary text-white" : "bg-white/10 text-gray-400"}`}>
                <User className="h-6 w-6" />
              </div>
              <span className={`font-semibold ${userType === "candidate" ? "text-white" : "text-gray-400"}`}>Sou candidato</span>
            </button>

            <button
              onClick={() => setUserType("company")}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                userType === "company"
                  ? "border-primary bg-primary/10"
                  : "border-white/5 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 ${userType === "company" ? "bg-primary text-white" : "bg-white/10 text-gray-400"}`}>
                <Building2 className="h-6 w-6" />
              </div>
              <span className={`font-semibold ${userType === "company" ? "text-white" : "text-gray-400"}`}>Sou empresa</span>
            </button>
          </div>

          {userType && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              {userType === "candidate" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Nome completo</label>
                      <Input placeholder="Ex: João da Silva" className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email</label>
                      <Input type="email" placeholder="joao@exemplo.com" className="bg-black/20 border-white/10" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Senha</label>
                      <Input type="password" placeholder="••••••••" className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Confirmar senha</label>
                      <Input type="password" placeholder="••••••••" className="bg-black/20 border-white/10" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Área de interesse</label>
                      <select defaultValue="" className="flex h-10 w-full rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none">
                        <option value="" disabled>Selecione...</option>
                        <option value="it" className="bg-gray-900">TI & Software</option>
                        <option value="engineering" className="bg-gray-900">Engenharia</option>
                        <option value="marketing" className="bg-gray-900">Vendas & Marketing</option>
                        <option value="education" className="bg-gray-900">Educação</option>
                        <option value="other" className="bg-gray-900">Outros</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Estado</label>
                      <Input placeholder="Ex: Osaka" className="bg-black/20 border-white/10" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Nome da empresa</label>
                      <Input placeholder="Ex: Tech Solutions" className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email corporativo</label>
                      <Input type="email" placeholder="contato@empresa.com" className="bg-black/20 border-white/10" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Senha</label>
                      <Input type="password" placeholder="••••••••" className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Confirmar senha</label>
                      <Input type="password" placeholder="••••••••" className="bg-black/20 border-white/10" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Setor</label>
                      <select defaultValue="" className="flex h-10 w-full rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none">
                        <option value="" disabled>Selecione...</option>
                        <option value="it" className="bg-gray-900">Tecnologia</option>
                        <option value="industry" className="bg-gray-900">Indústria</option>
                        <option value="services" className="bg-gray-900">Serviços</option>
                        <option value="commerce" className="bg-gray-900">Comércio</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Tamanho da empresa</label>
                      <select defaultValue="" className="flex h-10 w-full rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none">
                        <option value="" disabled>Selecione...</option>
                        <option value="1-10" className="bg-gray-900">1-10 funcionários</option>
                        <option value="11-50" className="bg-gray-900">11-50 funcionários</option>
                        <option value="51-200" className="bg-gray-900">51-200 funcionários</option>
                        <option value="201+" className="bg-gray-900">Mais de 200</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Cidade</label>
                      <Input placeholder="Ex: Tóquio" className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Telefone</label>
                      <Input placeholder="Ex: +81 00-0000-0000" className="bg-black/20 border-white/10" />
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-start space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`mt-0.5 h-5 w-5 shrink-0 rounded border transition-colors flex items-center justify-center ${
                    agreedToTerms ? "bg-primary border-primary" : "border-white/20 bg-black/20"
                  }`}
                >
                  {agreedToTerms && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
                <label className="text-sm text-gray-400 leading-tight cursor-pointer" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                  Concordo com os <Link to="/termos" className="text-primary hover:underline">Termos de uso</Link> e <Link to="/privacidade" className="text-primary hover:underline">Política de privacidade</Link>
                </label>
              </div>

              <Button variant="gradient" className="w-full rounded-full h-12 text-base font-semibold mt-4">
                Criar conta
              </Button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-4 text-gray-500">ou continue com</span>
                </div>
              </div>

              <Button variant="outline" className="w-full rounded-full h-12 bg-white/5 border-white/10 hover:bg-white/10">
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
              
              <p className="text-center text-sm text-gray-400 mt-6">
                Já tem uma conta? <Link to="/login" className="text-primary hover:underline font-medium">Entrar</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

