import { supabase } from './supabase'
import type {
  AdminStats,
  AdminUser,
  AdminCompany,
  AdminJob,
  AdminApplication,
  CreateAccountForm,
} from './adminTypes'

// ─── Mock Data (fallback when Supabase tables are empty or unavailable) ───

const MOCK_USERS: AdminUser[] = [
  { id: '1', email: 'joao@email.com', full_name: 'João da Silva', avatar_url: null, bio: 'Desenvolvedor Frontend', location: 'Tokyo', phone: '+81 90-1234-5678', role: 'candidate', is_admin: false, status: 'active', created_at: '2026-01-15T10:00:00Z', updated_at: '2026-03-20T10:00:00Z' },
  { id: '2', email: 'maria@email.com', full_name: 'Maria Santos', avatar_url: null, bio: 'Designer UX/UI', location: 'Osaka', phone: '+81 90-2345-6789', role: 'candidate', is_admin: false, status: 'active', created_at: '2026-01-20T10:00:00Z', updated_at: '2026-03-18T10:00:00Z' },
  { id: '3', email: 'pedro@email.com', full_name: 'Pedro Lima', avatar_url: null, bio: 'Engenheiro de Software', location: 'Nagoya', phone: '+81 90-3456-7890', role: 'candidate', is_admin: false, status: 'inactive', created_at: '2026-02-01T10:00:00Z', updated_at: '2026-03-10T10:00:00Z' },
  { id: '4', email: 'ana@email.com', full_name: 'Ana Oliveira', avatar_url: null, bio: 'Product Manager', location: 'Tokyo', phone: '+81 90-4567-8901', role: 'candidate', is_admin: false, status: 'active', created_at: '2026-02-10T10:00:00Z', updated_at: '2026-03-22T10:00:00Z' },
  { id: '5', email: 'carlos@email.com', full_name: 'Carlos Mendes', avatar_url: null, bio: 'Data Analyst', location: 'Sapporo', phone: '+81 90-5678-9012', role: 'candidate', is_admin: false, status: 'suspended', created_at: '2026-02-15T10:00:00Z', updated_at: '2026-03-15T10:00:00Z' },
]

const MOCK_ADMINS: AdminUser[] = [
  { id: 'admin-1', email: 'admin@kibojobs.com', full_name: 'Admin Principal', avatar_url: null, bio: 'Administrador do sistema', location: 'Tokyo', phone: '+81 90-0000-0001', role: 'admin', is_admin: true, status: 'active', created_at: '2025-12-01T10:00:00Z', updated_at: '2026-03-23T10:00:00Z' },
  { id: 'admin-2', email: 'suporte@kibojobs.com', full_name: 'Suporte KiboJobs', avatar_url: null, bio: 'Suporte técnico', location: 'Osaka', phone: '+81 90-0000-0002', role: 'admin', is_admin: true, status: 'active', created_at: '2025-12-15T10:00:00Z', updated_at: '2026-03-20T10:00:00Z' },
]

const MOCK_COMPANIES: AdminCompany[] = [
  { id: 'c1', name: 'Tech Solutions', logo_url: null, description: 'Soluções tecnológicas inovadoras', website: 'https://techsolutions.jp', industry: 'Tecnologia', open_jobs: 5, status: 'active', created_at: '2026-01-10T10:00:00Z', updated_at: '2026-03-20T10:00:00Z' },
  { id: 'c2', name: 'Global Systems', logo_url: null, description: 'Sistemas empresariais globais', website: 'https://globalsystems.jp', industry: 'Tecnologia', open_jobs: 3, status: 'active', created_at: '2026-01-15T10:00:00Z', updated_at: '2026-03-19T10:00:00Z' },
  { id: 'c3', name: 'InovaTech', logo_url: null, description: 'Inovação em tecnologia', website: 'https://inovatech.jp', industry: 'Tecnologia', open_jobs: 2, status: 'active', created_at: '2026-02-01T10:00:00Z', updated_at: '2026-03-18T10:00:00Z' },
  { id: 'c4', name: 'DataCorp', logo_url: null, description: 'Análise de dados empresariais', website: 'https://datacorp.jp', industry: 'Dados', open_jobs: 4, status: 'inactive', created_at: '2026-02-10T10:00:00Z', updated_at: '2026-03-15T10:00:00Z' },
  { id: 'c5', name: 'Creative Agency', logo_url: null, description: 'Agência criativa', website: 'https://creative.jp', industry: 'Design', open_jobs: 1, status: 'active', created_at: '2026-02-20T10:00:00Z', updated_at: '2026-03-22T10:00:00Z' },
  { id: 'c_kowa', name: 'Kowa Corporation', logo_url: null, description: 'Fundada em 1991, sempre trabalhando para o bem estar dos nossos funcionários e para melhor atendermos temos além de nossa matriz em Gunma, contamos com filiais em Aichi, Hyogo, Ibaraki, Kagoshima, Kanagawa, Shiga, Tochigi e Yokohama. "A empreiteira que se importa com você!"', website: 'https://jobsonline.jp/empresas/kowa-corporation/', industry: 'Manufatura e Produção', open_jobs: 13, status: 'active', created_at: '2026-03-23T10:00:00Z', updated_at: '2026-03-23T10:00:00Z' },
]

const MOCK_JOBS: AdminJob[] = [
  { id: 'j1', title: 'Desenvolvedor Frontend Sênior', company_id: 'c1', company_name: 'Tech Solutions', location: 'Tokyo', work_mode: 'Híbrido', job_type: 'CLT', salary_min: 350000, salary_max: 550000, salary_tbd: false, area: 'tecnologia', experience_level: 'senior', requirements: ['React', 'TypeScript'], benefits: ['Plano de Saúde'], closing_date: '2026-12-31', description: 'Vaga para dev frontend senior', is_sponsored: true, is_featured: true, status: 'active', views: 234, created_at: '2026-03-20T10:00:00Z', updated_at: '2026-03-20T10:00:00Z' },
  { id: 'j2', title: 'Engenheiro de Software', company_id: 'c2', company_name: 'Global Systems', location: 'Osaka', work_mode: 'Remoto', job_type: 'PJ', salary_min: 400000, salary_max: 700000, salary_tbd: false, area: 'tecnologia', experience_level: 'pleno', requirements: ['Node.js'], benefits: [], closing_date: null, description: 'Vaga para engenheiro de software', is_sponsored: false, is_featured: false, status: 'active', views: 189, created_at: '2026-03-19T10:00:00Z', updated_at: '2026-03-19T10:00:00Z' },
  { id: 'j3', title: 'Product Manager', company_id: 'c3', company_name: 'InovaTech', location: 'Tokyo', work_mode: 'Presencial', job_type: 'CLT', salary_min: 500000, salary_max: 800000, salary_tbd: false, area: 'tecnologia', experience_level: 'senior', requirements: ['Scrum'], benefits: ['Vale Refeição (VR)'], closing_date: null, description: 'Vaga para PM', is_sponsored: true, is_featured: true, status: 'pending', views: 56, created_at: '2026-03-18T10:00:00Z', updated_at: '2026-03-18T10:00:00Z' },
  { id: 'j4', title: 'Analista de Dados', company_id: 'c4', company_name: 'DataCorp', location: 'Nagoya', work_mode: 'Remoto', job_type: 'Freelance', salary_min: 300000, salary_max: 450000, salary_tbd: false, area: 'tecnologia', experience_level: 'pleno', requirements: ['SQL', 'Python'], benefits: [], closing_date: null, description: 'Vaga para analista de dados', is_sponsored: false, is_featured: false, status: 'active', views: 145, created_at: '2026-03-18T10:00:00Z', updated_at: '2026-03-18T10:00:00Z' },
  { id: 'j5', title: 'Designer UX/UI', company_id: 'c5', company_name: 'Creative Agency', location: 'Tokyo', work_mode: 'Híbrido', job_type: 'CLT', salary_min: 280000, salary_max: 400000, salary_tbd: false, area: 'design', experience_level: 'pleno', requirements: ['Figma'], benefits: ['Gympass'], closing_date: null, description: 'Vaga para designer', is_sponsored: false, is_featured: false, status: 'rejected', views: 78, created_at: '2026-03-17T10:00:00Z', updated_at: '2026-03-17T10:00:00Z' },
  { id: 'j6', title: 'DevOps Engineer', company_id: 'c1', company_name: 'Tech Solutions', location: 'Tokyo', work_mode: 'Remoto', job_type: 'PJ', salary_min: 450000, salary_max: 650000, salary_tbd: false, area: 'tecnologia', experience_level: 'senior', requirements: ['AWS', 'Docker'], benefits: [], closing_date: null, description: 'Vaga para DevOps', is_sponsored: false, is_featured: false, status: 'pending', views: 32, created_at: '2026-03-16T10:00:00Z', updated_at: '2026-03-16T10:00:00Z' },
  { id: 'jk1', title: 'Produção de compressor para autos', company_id: 'c_kowa', company_name: 'Kowa Corporation', location: 'Isesaki, Gunma', work_mode: 'Presencial', job_type: 'Contrato', salary_min: null, salary_max: null, salary_tbd: true, area: 'manufatura', experience_level: 'junior', requirements: ['Nihongo básico'], benefits: ['Vale Transporte (VT)', 'Adicional noturno'], closing_date: '2026-12-31', description: 'Vaga para produção de compressor de autos.', is_sponsored: true, is_featured: true, status: 'active', views: 102, created_at: '2026-03-23T10:00:00Z', updated_at: '2026-03-23T10:00:00Z' },
  { id: 'jk2', title: 'Linha de montagem automotiva', company_id: 'c_kowa', company_name: 'Kowa Corporation', location: 'Ota, Gunma', work_mode: 'Presencial', job_type: 'Contrato', salary_min: 250000, salary_max: 300000, salary_tbd: false, area: 'manufatura', experience_level: 'junior', requirements: ['Disposição', 'Horas extras'], benefits: ['Vale Transporte (VT)', 'Ajuda de custo'], closing_date: '2026-12-31', description: 'Atuar em linha de montagem automotiva.', is_sponsored: false, is_featured: false, status: 'active', views: 80, created_at: '2026-03-23T10:01:00Z', updated_at: '2026-03-23T10:01:00Z' },
  { id: 'jk3', title: 'Operação de máquinas e abastecimento', company_id: 'c_kowa', company_name: 'Kowa Corporation', location: 'Shizuoka', work_mode: 'Presencial', job_type: 'Contrato', salary_min: null, salary_max: null, salary_tbd: true, area: 'manufatura', experience_level: 'pleno', requirements: ['Experiência em fábrica'], benefits: ['Apartamento', 'Vale Transporte (VT)'], closing_date: '2026-10-31', description: 'Operação de máquinas pesadas e abastecimento.', is_sponsored: false, is_featured: true, status: 'active', views: 300, created_at: '2026-03-23T10:02:00Z', updated_at: '2026-03-23T10:02:00Z' },
  { id: 'jk4', title: 'Manufatura de alimentos (Contrato FIXO ou ARUBAITO)', company_id: 'c_kowa', company_name: 'Kowa Corporation', location: 'Kanagawa', work_mode: 'Presencial', job_type: 'Arubaito', salary_min: 150000, salary_max: 200000, salary_tbd: false, area: 'alimenticio', experience_level: 'junior', requirements: ['Sem experiência'], benefits: ['Vale Refeição (VR)'], closing_date: '2026-08-30', description: 'Trabalho em linha de alimentos.', is_sponsored: false, is_featured: false, status: 'active', views: 50, created_at: '2026-03-23T10:03:00Z', updated_at: '2026-03-23T10:03:00Z' },
  { id: 'jk5', title: 'Fabricação de pães para lojas de conveniência', company_id: 'c_kowa', company_name: 'Kowa Corporation', location: 'Funabashi, Chiba', work_mode: 'Presencial', job_type: 'Contrato', salary_min: null, salary_max: null, salary_tbd: true, area: 'alimenticio', experience_level: 'junior', requirements: [], benefits: ['Vale Transporte (VT)'], closing_date: '2026-11-01', description: 'Vaga para fabricação de pães para lojas de conveniência.', is_sponsored: true, is_featured: false, status: 'active', views: 30, created_at: '2026-03-23T10:04:00Z', updated_at: '2026-03-23T10:04:00Z' },
  { id: 'jk6', title: 'Produção de bancos para carros', company_id: 'c_kowa', company_name: 'Kowa Corporation', location: 'Ota, Gunma', work_mode: 'Presencial', job_type: 'Contrato', salary_min: 300000, salary_max: 350000, salary_tbd: false, area: 'manufatura', experience_level: 'pleno', requirements: ['Agilidade', 'Nihongo intermediário'], benefits: ['Vale Transporte (VT)'], closing_date: '2026-09-15', description: 'Montagem de bancos para carros zero.', is_sponsored: false, is_featured: false, status: 'active', views: 92, created_at: '2026-03-23T10:05:00Z', updated_at: '2026-03-23T10:05:00Z' },
  { id: 'jk7', title: 'Operação de empilhadeira', company_id: 'c_kowa', company_name: 'Kowa Corporation', location: 'Aichi', work_mode: 'Presencial', job_type: 'Contrato', salary_min: null, salary_max: null, salary_tbd: true, area: 'logistica', experience_level: 'senior', requirements: ['Carteira de Empilhadeira', 'Experiência'], benefits: ['Vale Transporte (VT)', 'Seguro'], closing_date: '2026-07-20', description: 'Vaga para operador de empilhadeira experiente.', is_sponsored: true, is_featured: true, status: 'active', views: 800, created_at: '2026-03-23T10:06:00Z', updated_at: '2026-03-23T10:06:00Z' },
  { id: 'jk8', title: 'Produção de peças plásticas', company_id: 'c_kowa', company_name: 'Kowa Corporation', location: 'Tochigi', work_mode: 'Presencial', job_type: 'Contrato', salary_min: 220000, salary_max: 270000, salary_tbd: false, area: 'manufatura', experience_level: 'junior', requirements: ['Paciência'], benefits: ['Ajuda Maternidade'], closing_date: '2026-12-01', description: 'Fábrica de plásticos injetáveis.', is_sponsored: false, is_featured: false, status: 'active', views: 112, created_at: '2026-03-23T10:07:00Z', updated_at: '2026-03-23T10:07:00Z' },
  { id: 'jk9', title: 'Produção de compressor para autos', company_id: 'c_kowa', company_name: 'Kowa Corporation', location: 'Oizumi, Gunma', work_mode: 'Presencial', job_type: 'Contrato', salary_min: null, salary_max: null, salary_tbd: true, area: 'manufatura', experience_level: 'junior', requirements: ['Nihongo básico'], benefits: ['Vale Transporte (VT)'], closing_date: '2026-12-31', description: 'Vaga para produção de compressor de autos. Salário: ¥1.450/h. Turno: Diurno Fixo.', is_sponsored: true, is_featured: true, status: 'active', views: 85, created_at: '2026-03-24T10:00:00Z', updated_at: '2026-03-24T10:00:00Z' },
  { id: 'jk10', title: 'Produção de compressor para autos', company_id: 'c_kowa', company_name: 'Kowa Corporation', location: 'Ota, Gunma', work_mode: 'Presencial', job_type: 'Contrato', salary_min: null, salary_max: null, salary_tbd: true, area: 'manufatura', experience_level: 'junior', requirements: ['Nihongo básico'], benefits: ['Vale Transporte (VT)', 'Adicional noturno'], closing_date: '2026-12-31', description: 'Vaga para produção de compressor de autos. Salário: ¥1.600/h. Turno: Noturno Fixo.', is_sponsored: false, is_featured: false, status: 'active', views: 120, created_at: '2026-03-24T10:00:00Z', updated_at: '2026-03-24T10:00:00Z' },
  { id: 'jk11', title: 'Produção de compressor para autos', company_id: 'c_kowa', company_name: 'Kowa Corporation', location: 'Hamamatsu, Shizuoka', work_mode: 'Presencial', job_type: 'Contrato', salary_min: null, salary_max: null, salary_tbd: true, area: 'manufatura', experience_level: 'junior', requirements: ['Nihongo básico'], benefits: ['Vale Transporte (VT)', 'Adicional noturno'], closing_date: '2026-12-31', description: 'Vaga para produção de compressor de autos. Salário: ¥1.550/h. Turno: Alternado.', is_sponsored: false, is_featured: false, status: 'active', views: 90, created_at: '2026-03-24T10:00:00Z', updated_at: '2026-03-24T10:00:00Z' },
  { id: 'jk12', title: 'Qualidade e Inspeção de compressores', company_id: 'c_kowa', company_name: 'Kowa Corporation', location: 'Toyohashi, Aichi', work_mode: 'Presencial', job_type: 'Contrato', salary_min: null, salary_max: null, salary_tbd: true, area: 'manufatura', experience_level: 'pleno', requirements: ['Nihongo intermediário', 'Atenção a detalhes'], benefits: ['Vale Transporte (VT)', 'Adicional noturno'], closing_date: '2026-12-31', description: 'Vaga para área de Qualidade e Inspeção. Salário: ¥1.700/h. Turno: Alternado.', is_sponsored: true, is_featured: false, status: 'active', views: 200, created_at: '2026-03-24T10:00:00Z', updated_at: '2026-03-24T10:00:00Z' },
  { id: 'jk13', title: 'Produção de compressor para autos', company_id: 'c_kowa', company_name: 'Kowa Corporation', location: 'Tochigi', work_mode: 'Presencial', job_type: 'Contrato', salary_min: null, salary_max: null, salary_tbd: true, area: 'manufatura', experience_level: 'junior', requirements: ['Nihongo básico'], benefits: ['Vale Transporte (VT)'], closing_date: '2026-12-31', description: 'Vaga para produção de compressor de autos. Salário: ¥1.400/h. Turno: Diurno Fixo.', is_sponsored: false, is_featured: false, status: 'active', views: 60, created_at: '2026-03-24T10:00:00Z', updated_at: '2026-03-24T10:00:00Z' }
]

const MOCK_APPLICATIONS: AdminApplication[] = [
  { id: 'a1', user_id: '1', user_name: 'João da Silva', user_email: 'joao@email.com', job_id: 'j1', job_title: 'Desenvolvedor Frontend Sênior', company_name: 'Tech Solutions', status: 'pending', applied_at: '2026-03-21T10:00:00Z' },
  { id: 'a2', user_id: '2', user_name: 'Maria Santos', user_email: 'maria@email.com', job_id: 'j5', job_title: 'Designer UX/UI', company_name: 'Creative Agency', status: 'interview', applied_at: '2026-03-20T10:00:00Z' },
  { id: 'a3', user_id: '4', user_name: 'Ana Oliveira', user_email: 'ana@email.com', job_id: 'j3', job_title: 'Product Manager', company_name: 'InovaTech', status: 'viewed', applied_at: '2026-03-19T10:00:00Z' },
  { id: 'a4', user_id: '3', user_name: 'Pedro Lima', user_email: 'pedro@email.com', job_id: 'j2', job_title: 'Engenheiro de Software', company_name: 'Global Systems', status: 'rejected', applied_at: '2026-03-18T10:00:00Z' },
  { id: 'a5', user_id: '5', user_name: 'Carlos Mendes', user_email: 'carlos@email.com', job_id: 'j4', job_title: 'Analista de Dados', company_name: 'DataCorp', status: 'accepted', applied_at: '2026-03-17T10:00:00Z' },
]

// ─── Service Functions ───

export async function fetchAdminStats(): Promise<AdminStats> {
  try {
    const [usersRes, companiesRes, jobsRes, appsRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('companies').select('id', { count: 'exact', head: true }),
      supabase.from('jobs').select('id', { count: 'exact', head: true }),
      supabase.from('applications').select('id', { count: 'exact', head: true }),
    ])

    const totalUsers = usersRes.count ?? MOCK_USERS.length
    const totalCompanies = companiesRes.count ?? MOCK_COMPANIES.length
    const totalJobs = jobsRes.count ?? MOCK_JOBS.length
    const totalApplications = appsRes.count ?? MOCK_APPLICATIONS.length

    return {
      totalUsers,
      totalCompanies,
      totalJobs,
      totalApplications,
      activeJobs: MOCK_JOBS.filter(j => j.status === 'active').length,
      pendingJobs: MOCK_JOBS.filter(j => j.status === 'pending').length,
    }
  } catch {
    return {
      totalUsers: MOCK_USERS.length,
      totalCompanies: MOCK_COMPANIES.length,
      totalJobs: MOCK_JOBS.length,
      totalApplications: MOCK_APPLICATIONS.length,
      activeJobs: MOCK_JOBS.filter(j => j.status === 'active').length,
      pendingJobs: MOCK_JOBS.filter(j => j.status === 'pending').length,
    }
  }
}

export async function fetchUsers(): Promise<AdminUser[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) return MOCK_USERS
    return data.map((u: any) => ({
      ...u,
      email: u.email || 'N/A',
      role: u.role || 'candidate',
      is_admin: u.is_admin || false,
      status: u.status || 'active',
    }))
  } catch {
    return MOCK_USERS
  }
}

export async function fetchAdmins(): Promise<AdminUser[]> {
  // Admins are typically stored with is_admin flag
  // Fallback to mock data
  return MOCK_ADMINS
}

export async function fetchCompanies(): Promise<AdminCompany[]> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) return MOCK_COMPANIES
    return data.map((c: any) => ({
      ...c,
      status: c.status || 'active',
    }))
  } catch {
    return MOCK_COMPANIES
  }
}

export async function fetchJobs(): Promise<AdminJob[]> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, companies(name)')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) return MOCK_JOBS
    return data.map((j: any) => ({
      ...j,
      company_name: j.companies?.name || 'N/A',
      status: j.status || 'active',
    }))
  } catch {
    return MOCK_JOBS
  }
}

export async function fetchApplications(): Promise<AdminApplication[]> {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, profiles(full_name, email), jobs(title, companies(name))')
      .order('applied_at', { ascending: false })

    if (error || !data || data.length === 0) return MOCK_APPLICATIONS
    return data.map((a: any) => ({
      ...a,
      user_name: a.profiles?.full_name || 'N/A',
      user_email: a.profiles?.email || 'N/A',
      job_title: a.jobs?.title || 'N/A',
      company_name: a.jobs?.companies?.name || 'N/A',
    }))
  } catch {
    return MOCK_APPLICATIONS
  }
}

export async function toggleUserStatus(userId: string, currentStatus: string): Promise<boolean> {
  const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', userId)
    return !error
  } catch {
    return false
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)
    return !error
  } catch {
    return false
  }
}

export async function toggleCompanyStatus(companyId: string, currentStatus: string): Promise<boolean> {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
  try {
    const { error } = await supabase
      .from('companies')
      .update({ status: newStatus })
      .eq('id', companyId)
    return !error
  } catch {
    return false
  }
}

export async function deleteCompany(companyId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', companyId)
    return !error
  } catch {
    return false
  }
}

export async function updateJobStatus(jobId: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('jobs')
      .update({ status })
      .eq('id', jobId)
    return !error
  } catch {
    return false
  }
}

export async function deleteJob(jobId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId)
    return !error
  } catch {
    return false
  }
}

export async function toggleJobSponsored(jobId: string, current: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('jobs')
      .update({ is_sponsored: !current })
      .eq('id', jobId)
    return !error
  } catch {
    return false
  }
}

export async function createAccount(form: CreateAccountForm): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          role: form.accountType,
          is_admin: form.accountType === 'admin',
        },
      },
    })

    if (error) {
      return { success: false, message: error.message }
    }

    // If it's a company account, also create a company record
    if (form.accountType === 'company' && form.company_name) {
      await supabase.from('companies').insert({
        name: form.company_name,
        industry: form.industry || null,
        description: null,
        website: null,
        logo_url: null,
        open_jobs: 0,
      })
    }

    // If it's a user/admin, create a profile record
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: form.full_name,
        avatar_url: null,
        bio: null,
        location: form.location || null,
        phone: form.phone || null,
        completion_percentage: 0,
      })
    }

    return {
      success: true,
      message: `Conta ${form.accountType === 'admin' ? 'de administrador' : form.accountType === 'company' ? 'de empresa' : 'de usuário'} criada com sucesso!`,
    }
  } catch (err: any) {
    return { success: false, message: err.message || 'Erro ao criar conta' }
  }
}
