import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, MapPin, JapaneseYen, Tag, Calendar, Star, 
  CheckCircle2, ChevronRight, ChevronLeft, Building2, 
  Bold, Italic, List, Link as LinkIcon, AlertCircle,
  Plus, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

export function CompanyNewJob() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    area: '',
    contractType: '',
    workMode: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    salaryTbd: false,
    experienceLevel: '',
    description: '',
    requirements: [] as string[],
    benefits: [] as string[],
    closingDate: '',
    isSponsored: false,
  });

  const [reqInput, setReqInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddRequirement = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && reqInput.trim()) {
      e.preventDefault();
      if (!formData.requirements.includes(reqInput.trim())) {
        setFormData(prev => ({
          ...prev,
          requirements: [...prev.requirements, reqInput.trim()]
        }));
      }
      setReqInput('');
    }
  };

  const removeRequirement = (req: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(r => r !== req)
    }));
  };

  const toggleBenefit = (benefit: string) => {
    setFormData(prev => {
      const exists = prev.benefits.includes(benefit);
      if (exists) {
        return { ...prev, benefits: prev.benefits.filter(b => b !== benefit) };
      } else {
        return { ...prev, benefits: [...prev.benefits, benefit] };
      }
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      navigate('/empresa/dashboard');
    }, 1000);
  };

  const availableBenefits = [
    'Vale Transporte (VT)', 'Vale Refeição (VR)', 'Plano de Saúde', 
    'Plano Odontológico', 'Auxílio Home Office', 'Gympass', 
    'Participação nos Lucros (PLR)', 'Horário Flexível'
  ];

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-1.5";

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header & Progress */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <Link to="/empresa/dashboard" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 mb-4 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Voltar ao Dashboard
              </Link>
              <h1 className="text-4xl font-bold text-white glow-text flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                Publicar Nova Vaga
              </h1>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="relative px-2">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0" />
            <div className="relative z-10 flex justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center gap-3">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                      currentStep >= step 
                        ? 'bg-primary text-white glow-primary scale-110' 
                        : 'bg-gray-800 text-gray-500 border border-white/10'
                    }`}
                  >
                    {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${currentStep >= step ? 'text-primary' : 'text-gray-500'}`}>
                    {step === 1 ? 'Básico' : step === 2 ? 'Detalhes' : 'Publicar'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="glass-panel rounded-3xl overflow-hidden border-white/10">
          <div className="p-8 sm:p-12">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Basic Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-1 bg-primary rounded-full" />
                    <h2 className="text-2xl font-bold text-white">Informações Gerais</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="col-span-1 md:col-span-2">
                      <label className={labelClasses}>Título da Vaga *</label>
                      <input 
                        type="text" name="title" value={formData.title} onChange={handleInputChange}
                        placeholder="Ex: Desenvolvedor Front-end Sênior"
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Área / Setor *</label>
                      <select name="area" value={formData.area} onChange={handleInputChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                        <option value="" className="bg-gray-900">Selecione uma área</option>
                        <option value="tecnologia" className="bg-gray-900">Tecnologia / TI</option>
                        <option value="design" className="bg-gray-900">Design / UX</option>
                        <option value="marketing" className="bg-gray-900">Marketing</option>
                        <option value="vendas" className="bg-gray-900">Vendas</option>
                        <option value="rh" className="bg-gray-900">Recursos Humanos</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClasses}>Nível de Experiência *</label>
                      <select name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                        <option value="" className="bg-gray-900">Selecione o nível</option>
                        <option value="estagio" className="bg-gray-900">Estágio</option>
                        <option value="junior" className="bg-gray-900">Júnior</option>
                        <option value="pleno" className="bg-gray-900">Pleno</option>
                        <option value="senior" className="bg-gray-900">Sênior</option>
                        <option value="especialista" className="bg-gray-900">Especialista</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClasses}>Tipo de Contrato *</label>
                      <select name="contractType" value={formData.contractType} onChange={handleInputChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                        <option value="" className="bg-gray-900">Selecione o contrato</option>
                        <option value="clt" className="bg-gray-900">CLT (Seishain)</option>
                        <option value="contrato" className="bg-gray-900">Contrato (Keiyaku)</option>
                        <option value="arubaito" className="bg-gray-900">Meio Período (Arubaito)</option>
                        <option value="autonomo" className="bg-gray-900">Autônomo (Kojin Jigyou Nushi)</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClasses}>Modalidade *</label>
                      <select name="workMode" value={formData.workMode} onChange={handleInputChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                        <option value="" className="bg-gray-900">Selecione a modalidade</option>
                        <option value="remoto" className="bg-gray-900">100% Remoto</option>
                        <option value="hibrido" className="bg-gray-900">Híbrido</option>
                        <option value="presencial" className="bg-gray-900">Presencial</option>
                      </select>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label className={labelClasses}>Localização (Cidade - Estado)</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                        <input 
                          type="text" name="location" value={formData.location} onChange={handleInputChange}
                          placeholder="Ex: Osaka"
                          className={`${inputClasses} pl-11`}
                          disabled={formData.workMode === 'remoto'}
                        />
                      </div>
                      {formData.workMode === 'remoto' && (
                        <p className="text-xs text-accent mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" /> Localização desabilitada para vagas 100% remotas.
                        </p>
                      )}
                    </div>

                    <div className="col-span-1 md:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/5">
                      <div className="flex items-center justify-between mb-6">
                        <label className="text-sm font-semibold text-white uppercase tracking-wider">Faixa Salarial (Mensal)</label>
                        <label className="flex items-center cursor-pointer group">
                          <div className="relative">
                            <input type="checkbox" name="salaryTbd" checked={formData.salaryTbd} onChange={handleInputChange} className="sr-only" />
                            <div className={`block w-12 h-7 rounded-full transition-colors ${formData.salaryTbd ? 'bg-primary' : 'bg-gray-700'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${formData.salaryTbd ? 'transform translate-x-5' : ''}`}></div>
                          </div>
                          <div className="ml-3 text-sm font-medium text-gray-400 group-hover:text-white transition-colors">A combinar</div>
                        </label>
                      </div>
                      
                      {!formData.salaryTbd && (
                        <div className="grid grid-cols-2 gap-6">
                          <div className="relative">
                            <JapaneseYen className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                            <input 
                              type="number" name="salaryMin" value={formData.salaryMin} onChange={handleInputChange}
                              placeholder="Mínimo"
                              className={`${inputClasses} pl-11`}
                            />
                          </div>
                          <div className="relative">
                            <JapaneseYen className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                            <input 
                              type="number" name="salaryMax" value={formData.salaryMax} onChange={handleInputChange}
                              placeholder="Máximo"
                              className={`${inputClasses} pl-11`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-1 bg-primary rounded-full" />
                    <h2 className="text-2xl font-bold text-white">Detalhes da Vaga</h2>
                  </div>
                  
                  <div>
                    <label className={labelClasses}>Descrição da Vaga *</label>
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                      <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex gap-3">
                        <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Bold className="w-4 h-4" /></button>
                        <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Italic className="w-4 h-4" /></button>
                        <div className="w-px h-6 bg-white/10 mx-1 self-center"></div>
                        <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><List className="w-4 h-4" /></button>
                        <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><LinkIcon className="w-4 h-4" /></button>
                      </div>
                      <textarea 
                        name="description" value={formData.description} onChange={handleInputChange}
                        rows={8}
                        placeholder="Descreva as responsabilidades, o dia a dia e o que você espera do candidato..."
                        className="w-full px-6 py-4 bg-transparent outline-none resize-y min-h-[200px] text-white placeholder:text-gray-600"
                      ></textarea>
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>Requisitos Obrigatórios *</label>
                    <p className="text-xs text-gray-500 mb-3">Pressione Enter para adicionar uma tag.</p>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-primary/50 transition-all flex flex-wrap gap-2.5 items-center min-h-[60px]">
                      {formData.requirements.map(req => (
                        <Badge key={req} variant="glass" className="bg-primary/20 text-primary border-primary/30 px-3 py-1.5 flex items-center gap-2 text-sm">
                          {req}
                          <button type="button" onClick={() => removeRequirement(req)} className="hover:text-white transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </Badge>
                      ))}
                      <input 
                        type="text" 
                        value={reqInput} 
                        onChange={e => setReqInput(e.target.value)}
                        onKeyDown={handleAddRequirement}
                        placeholder={formData.requirements.length === 0 ? "Ex: React, Node.js, Inglês Fluente..." : "Adicionar mais..."}
                        className="flex-1 min-w-[200px] outline-none bg-transparent py-1.5 px-3 text-white placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>Benefícios</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {availableBenefits.map(benefit => (
                        <label key={benefit} className={`flex items-center p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${formData.benefits.includes(benefit) ? 'border-primary bg-primary/10 glow-primary' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}>
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.benefits.includes(benefit) ? 'bg-primary border-primary' : 'border-white/20'}`}>
                            {formData.benefits.includes(benefit) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <input 
                            type="checkbox" 
                            className="sr-only"
                            checked={formData.benefits.includes(benefit)}
                            onChange={() => toggleBenefit(benefit)}
                          />
                          <span className={`ml-4 text-sm font-medium ${formData.benefits.includes(benefit) ? 'text-white' : 'text-gray-400'}`}>{benefit}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>Data de Encerramento (Opcional)</label>
                    <div className="relative max-w-xs">
                      <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                      <input 
                        type="date" name="closingDate" value={formData.closingDate} onChange={handleInputChange}
                        className={`${inputClasses} pl-11`}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Publication */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-1 bg-primary rounded-full" />
                    <h2 className="text-2xl font-bold text-white">Revisão e Publicação</h2>
                  </div>
                  
                  {/* Preview Card */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative glass-panel rounded-3xl p-8 border-white/10 overflow-hidden">
                      <div className="absolute top-0 right-0 bg-primary/20 text-primary text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-bl-2xl border-l border-b border-primary/20">
                        Visualização
                      </div>
                      <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl border border-white/10 shrink-0">
                          TC
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-1">{formData.title || 'Título da Vaga'}</h3>
                          <p className="text-gray-400 text-sm mb-6 flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> TechCorp Japan • <MapPin className="w-4 h-4" /> {formData.location || 'Localização'}
                          </p>
                          
                          <div className="flex flex-wrap gap-3 mb-6">
                            <Badge variant="glass" className="bg-white/5 border-white/10 text-gray-300 px-3 py-1 text-xs">
                              <Briefcase className="w-3 h-3 mr-1.5" /> {formData.workMode || 'Modalidade'}
                            </Badge>
                            <Badge variant="glass" className="bg-white/5 border-white/10 text-gray-300 px-3 py-1 text-xs">
                              <JapaneseYen className="w-3 h-3 mr-1.5" /> {formData.salaryTbd ? 'A combinar' : (formData.salaryMin ? `¥${formData.salaryMin} - ¥${formData.salaryMax}` : 'Salário')}
                            </Badge>
                            <Badge variant="glass" className="bg-white/5 border-white/10 text-gray-300 px-3 py-1 text-xs">
                              <Tag className="w-3 h-3 mr-1.5" /> {formData.experienceLevel || 'Nível'}
                            </Badge>
                          </div>

                          <div className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                            {formData.description || 'A descrição detalhada da vaga aparecerá aqui para os candidatos revisarem antes de você publicar.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sponsored Toggle */}
                  <div className={`p-8 rounded-3xl border-2 transition-all duration-500 ${formData.isSponsored ? 'border-accent bg-accent/5 glow-accent' : 'border-white/5 bg-white/5'}`}>
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                      <div className="flex items-start gap-5">
                        <div className={`p-4 rounded-2xl ${formData.isSponsored ? 'bg-accent/20 text-accent' : 'bg-gray-800 text-gray-600'}`}>
                          <Star className="w-8 h-8" fill={formData.isSponsored ? "currentColor" : "none"} />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white flex items-center gap-3">
                            Vaga em Destaque
                            {formData.isSponsored && <Badge variant="default" className="bg-accent text-white border-none text-[10px] py-0.5">ATIVADO</Badge>}
                          </h4>
                          <p className="text-sm text-gray-400 mt-2 max-w-md leading-relaxed">
                            Sua vaga aparecerá no topo das buscas e será enviada por e-mail para candidatos compatíveis. Aumente em até 5x o número de currículos recebidos.
                          </p>
                          <p className="text-lg font-bold text-accent mt-4">+ ¥15,000 / mês</p>
                        </div>
                      </div>
                      <label className="flex items-center cursor-pointer mt-2">
                        <div className="relative">
                          <input type="checkbox" name="isSponsored" checked={formData.isSponsored} onChange={handleInputChange} className="sr-only" />
                          <div className={`block w-16 h-9 rounded-full transition-colors ${formData.isSponsored ? 'bg-accent' : 'bg-gray-700'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-7 h-7 rounded-full transition-transform ${formData.isSponsored ? 'transform translate-x-7' : ''}`}></div>
                        </div>
                      </label>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="bg-white/5 px-8 py-6 border-t border-white/5 flex items-center justify-between">
            {currentStep > 1 ? (
              <Button 
                variant="ghost" 
                onClick={prevStep}
                className="text-gray-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>
            ) : (
              <div />
            )}

            <div className="flex gap-4">
              {currentStep < 3 ? (
                <Button 
                  variant="gradient" 
                  size="lg"
                  onClick={nextStep}
                  className="px-10"
                >
                  Próximo Passo <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  variant="gradient" 
                  size="lg"
                  onClick={handleSubmit}
                  className="px-12 font-bold"
                >
                  <CheckCircle2 className="mr-2 w-5 h-5" /> Publicar Vaga
                </Button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
