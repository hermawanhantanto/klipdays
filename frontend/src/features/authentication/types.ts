export type AuthRole = 'BRAND' | 'CREATOR' | 'ADMIN'

export interface BrandRegisterInput {
  role: 'BRAND'
  email: string
  password: string
  companyName: string
  phoneNumber: string
  industry: string
}

export interface CreatorRegisterInput {
  role: 'CREATOR'
  email: string
  password: string
  fullName: string
}

export type RegisterInput = BrandRegisterInput | CreatorRegisterInput

export interface LoginInput {
  email: string
  password: string
}

export interface ApiResponse<T> {
  status: string
  data: T
  message: string
}

export interface RegisteredAccount {
  id: string
  email: string
  role: string
  createdAt: string
}

export interface LoggedInAccount {
  id: string
  email: string
  role: string
}

export interface BrandProfile {
  id: string
  companyName: string
  phoneNumber?: string | null
  industry?: string | null
}

export interface CreatorProfile {
  id: string
  fullName: string
}

export interface AdminProfile {
  id: string
  fullName: string
}

export interface CurrentAccountProfile {
  id: string
  email: string
  role: AuthRole
  name: string
  isEmailVerified: boolean
  brand?: BrandProfile | null
  creator?: CreatorProfile | null
  admin?: AdminProfile | null
}
