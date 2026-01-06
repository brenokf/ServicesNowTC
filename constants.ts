
import { UserRole, ItemStatus, User, Device, AuditLog, Project } from './types';

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@nexus.corp', role: UserRole.ADMIN, function: 'System Administrator', createdAt: '2023-01-01', avatar: 'https://i.pravatar.cc/150?u=admin' },
  { id: '2', name: 'John Doe', email: 'john@nexus.corp', role: UserRole.USER, function: 'QA Tester', createdAt: '2023-05-12', avatar: 'https://i.pravatar.cc/150?u=john' },
  { id: '3', name: 'Jane Smith', email: 'jane@nexus.corp', role: UserRole.USER, function: 'Developer', createdAt: '2023-08-20', avatar: 'https://i.pravatar.cc/150?u=jane' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'P1', name: 'iOS Mobile App', client: 'Nexus Retail', category: 'Mobility', status: ItemStatus.ACTIVE, testsCount: 1240, successRate: 94, assignedUsers: ['2'], thumbnailColor: 'bg-indigo-500' },
  { id: 'P2', name: 'Cloud API Gateway', client: 'Global Bank', category: 'Infrastructure', status: ItemStatus.ACTIVE, testsCount: 850, successRate: 88, assignedUsers: ['3'], thumbnailColor: 'bg-rose-500' },
  { id: 'P3', name: 'Nexus Core SDK', client: 'Internal R&D', category: 'Library', status: ItemStatus.PENDING, testsCount: 420, successRate: 72, assignedUsers: ['2', '3'], thumbnailColor: 'bg-amber-500' },
  { id: 'P4', name: 'Security Shield', client: 'CyberGov', category: 'Security', status: ItemStatus.ACTIVE, testsCount: 3100, successRate: 99, assignedUsers: ['1'], thumbnailColor: 'bg-emerald-500' },
];

export const MOCK_DEVICES: Device[] = [
  { id: 'D001', name: 'iPad Air 5th Gen', status: ItemStatus.ACTIVE, createdAt: '2024-01-10', responsible: 'John Doe' },
  { id: 'D002', name: 'Samsung S23 Ultra', status: ItemStatus.PENDING, createdAt: '2024-02-15', responsible: 'Jane Smith' },
  { id: 'D003', name: 'MacBook Pro M3', status: ItemStatus.ACTIVE, createdAt: '2024-03-01', responsible: 'Admin User' },
  { id: 'D004', name: 'Pixel 8 Pro', status: ItemStatus.INACTIVE, createdAt: '2024-03-05', responsible: 'John Doe' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: '1', user: 'Admin User', action: 'System Security Patch Applied', timestamp: '2024-04-10 14:30:00', details: 'Kernel version updated to 6.2' },
  { id: '2', user: 'John Doe', action: 'New Device Provisioning', timestamp: '2024-04-10 15:15:22', details: 'iPad Air configured for staging' },
  { id: '3', user: 'Jane Smith', action: 'Database Index Optimization', timestamp: '2024-04-10 16:45:10', details: 'Improved query latency by 15%' },
  { id: '4', user: 'Admin User', action: 'User Permissions Change', timestamp: '2024-04-11 09:00:00', details: 'Modified access for QA Dept' },
];

export const STATUS_COLORS = {
  [ItemStatus.ACTIVE]: 'text-green-700 bg-green-100',
  [ItemStatus.INACTIVE]: 'text-red-700 bg-red-100',
  [ItemStatus.PENDING]: 'text-yellow-700 bg-yellow-100',
  [ItemStatus.SUCCESS]: 'text-green-700 bg-green-100',
  [ItemStatus.FAILED]: 'text-red-700 bg-red-100',
};
