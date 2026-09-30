export type StaffRole = 'ROLE_OWNER' | 'ROLE_MANAGER' | 'ROLE_TECHNICIAN' | 'ROLE_RECEPTIONIST' | 'ROLE_ACCOUNTANT';

export interface StaffUser {
  id: string;
  fullName: string;
  email: string;
  role: StaffRole;
  active: boolean;
  branchName?: string;
}

export interface AuthResponse {
  token: string;
  user: StaffUser;
}

export interface ShopKpis {
  todaysJobs: number;
  inRepairJobs: number;
  completedJobsToday: number;
  todayRevenueCents: number;
  lowStockItemsCount: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isMainBranch: boolean;
  activeStaffCount: number;
}

export interface RepairJob {
  id: string;
  jobNumber: string;
  customerName: string;
  deviceModel: string;
  status: 'RECEIVED' | 'DIAGNOSING' | 'WAITING_APPROVAL' | 'IN_REPAIR' | 'READY' | 'DELIVERED' | 'CANCELLED';
  estimatedCostCents: number;
  createdAt: string;
  assignedTechnician?: string;
  recordHash?: string;
}

export interface InventoryItem {
  id: string;
  partName: string;
  sku: string;
  quantityOnHand: number;
  reorderThreshold: number;
  unitCostCents: number;
  sellingPriceCents: number;
  compatibleModels: string;
}

export interface ShopConfig {
  shopName: string;
  tagline: string;
  primaryPhone: string;
  primaryEmail: string;
  currencySymbol: string;
  taxRatePercent: number;
  defaultWarrantyDays: number;
  receiptFooterText: string;
}