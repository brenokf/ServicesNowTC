
export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User'
}

export enum ItemStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending',
  SUCCESS = 'Success',
  FAILED = 'Failed'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  function: string;
  createdAt: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  category: string;
  status: ItemStatus;
  testsCount: number;
  successRate: number;
  assignedUsers: string[]; // IDs of allocated users
  thumbnailColor: string;
}

export interface Device {
  id: string;
  name: string;
  status: ItemStatus;
  createdAt: string;
  responsible: string;
}

export interface Client {
  id: string;
  name: string;
  type: 'client' | 'tester';
  city: string;
  country: string;
  location: {
    lat: number;
    lng: number;
  };
  industry?: string;
  devices?: string[];
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface ModuleItem {
  id: string;
  name: string;
  status: ItemStatus;
  createdAt: string;
  responsible: string;
  description?: string;
  // Common fields
  type?: string;
  tests?: string;
  approval?: string;
  goodPut?: string;
  txDown?: string;
  txUp?: string;
  // Specific Device/Tests Fields
  fabricante?: string;
  modelo?: string;
  hwVersion?: string;
  serialNumber?: string;
  mac24?: string;
  mac5?: string;
  mac6?: string;
  nss24?: string;
  nss5?: string;
  nss6?: string;
  chipset24?: string;
  chipset5?: string;
  chipset6?: string;
  deviceType?: string;
  connectionType?: string;
  mainChipset?: string;
  ram?: string;
  flash?: string;
  ethernet?: string;
  wifiVersion?: string;
  macLan?: string;
  macWan?: string;
  wifiPassword?: string;
  guiUser?: string;
  guiPassword?: string;
  // Tests Specific Table Fields
  caderno?: string;
  titulo?: string;
  categoria?: string;
  catTR?: string;
  local?: string;
  ref?: string;
  especif?: string;
}

export type ModuleType = 'devices' | 'notebooks' | 'profiles' | 'tests' | 'admin' | 'dashboard' | 'projects';
