export type Role = 'admin' | 'receptionist' | 'trainer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  salary?: number;
  joinDate: string;
  password?: string;
}

export interface Plan {
  id: string;
  name: string;
  duration: number; // in months
  price: number;
  description: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  planId: string;
  planName: string;
  trainer: string;
  startDate: string;
  endDate: string;
  paymentStatus: 'Paid' | 'Pending';
  status: 'Active' | 'Inactive' | 'Suspended';
  dob?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  planName: string;
  amount: number;
  date: string;
  method: string;
  status: 'Paid' | 'Pending';
}

export interface RolePermissions {
  pages: string[];
  actions: string[]; // e.g., 'member:add', 'member:edit', 'member:delete', 'payment:add', 'plan:add', 'staff:add'
}

export interface AppPermissions {
  trainer: RolePermissions;
  receptionist: RolePermissions;
}

export interface Attendance {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  time: string;
  checkOutTime?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  expectedJoinDate: string;
  status: 'Follow up' | 'Joined' | 'Not interested';
  notes?: string;
  createdAt: string;
}
