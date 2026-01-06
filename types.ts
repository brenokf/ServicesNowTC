
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
}

export type ModuleType = 'devices' | 'notebooks' | 'profiles' | 'tests' | 'admin' | 'dashboard' | 'projects';
