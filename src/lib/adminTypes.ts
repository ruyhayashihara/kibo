// Admin Types for KiboJobs Admin Panel

export interface AdminStats {
  totalUsers: number
  totalCompanies: number
  totalJobs: number
  totalApplications: number
  activeJobs: number
  pendingJobs: number
}

export interface AdminUser {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  location: string | null
  phone: string | null
  role: 'candidate' | 'company' | 'admin'
  is_admin: boolean
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

export interface AdminCompany {
  id: string
  name: string
  logo_url: string | null
  description: string | null
  website: string | null
  industry: string | null
  open_jobs: number
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

export interface AdminJob {
  id: string
  title: string
  company_id: string
  company_name?: string
  location: string
  work_mode: string
  job_type: string
  salary_min: number | null
  salary_max: number | null
  salary_tbd: boolean
  description: string
  area: string
  experience_level: string
  requirements: string[]
  benefits: string[]
  closing_date: string | null
  is_sponsored: boolean
  is_featured: boolean
  status: 'active' | 'pending' | 'rejected' | 'closed'
  views: number
  applications?: number
  created_at: string
  updated_at: string
}

export interface AdminApplication {
  id: string
  user_id: string
  user_name?: string
  user_email?: string
  job_id: string
  job_title?: string
  company_name?: string
  status: 'pending' | 'viewed' | 'interview' | 'rejected' | 'accepted'
  applied_at: string
}

export interface CreateAccountForm {
  email: string
  password: string
  accountType: 'candidate' | 'company' | 'admin'
  full_name: string
  company_name?: string
  industry?: string
  location?: string
  phone?: string
}

export type AdminTab = 'overview' | 'accounts' | 'content' | 'create' | 'ads'
export type AccountSubTab = 'users' | 'companies' | 'admins'
export type ContentSubTab = 'jobs' | 'applications'
