// Shared TypeScript types for the CRM application

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LEAD = 'lead',
  CHURNED = 'churned',
}

export enum DealStage {
  PROSPECTING = 'prospecting',
  QUALIFICATION = 'qualification',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  status: string
  createdAt: Date
  updatedAt: Date
  deals?: Deal[]
}

export interface Deal {
  id: string
  title: string
  value: number
  stage: string
  customerId: string
  customer?: Customer
  expectedCloseDate: Date | null
  createdAt: Date
  updatedAt: Date
}

export type CustomerWithDeals = Customer & {
  deals: Deal[]
}

export type DealWithCustomer = Deal & {
  customer: Customer
}

// Form input types (without auto-generated fields)
export type CreateCustomerInput = {
  name: string
  email: string
  phone?: string
  company?: string
  status?: string
}

export type UpdateCustomerInput = Partial<CreateCustomerInput>

export type CreateDealInput = {
  title: string
  value: number
  stage?: string
  customerId: string
  expectedCloseDate?: Date | null
}

export type UpdateDealInput = Partial<Omit<CreateDealInput, 'customerId'>>
