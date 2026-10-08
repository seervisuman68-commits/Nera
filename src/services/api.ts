import type { User, Business, Worker, Shift, AttendanceRecord, Rating, PlatformAnalytics } from '../types';

// Use relative API path '/api/v1' for seamless Vercel production deployment & local Vite proxying
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  console.log(`📡 [FRONTEND API REQUEST] -> ${method} ${url}`, options.body ? JSON.parse(options.body as string) : '');

  try {
    const response = await fetch(url, config);
    let data: any;
    try {
      data = await response.json();
    } catch {
      data = { error: `Server returned non-JSON response (${response.status} ${response.statusText})` };
    }

    console.log(`📥 [FRONTEND API RESPONSE] <- Status: ${response.status} from ${endpoint}:`, data);

    if (!response.ok) {
      const errMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
      throw new Error(errMsg);
    }
    return data;
  } catch (error: any) {
    console.error(`❌ [FRONTEND API ERROR] on ${endpoint}:`, error.message);
    throw error;
  }
}

// REST API Service Client
export const api = {
  // Health
  checkHealth: async () => {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch {
      return { status: 'offline', database: 'Disconnected' };
    }
  },

  // Auth
  register: (userData: Partial<User>) => request<{ success: boolean; user: User; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (email: string, role?: string) => request<{ success: boolean; user: User; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  }),

  // Users
  getUsers: () => request<{ success: boolean; users: User[] }>('/users'),

  // Businesses
  getBusinesses: () => request<{ success: boolean; businesses: Business[] }>('/businesses'),
  getBusinessById: (id: string) => request<{ success: boolean; business: Business }>(`/businesses/${id}`),
  createBusiness: (data: Partial<Business>) => request<{ success: boolean; business: Business }>('/businesses', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Workers
  getWorkers: () => request<{ success: boolean; workers: Worker[] }>('/workers'),
  getWorkerById: (id: string) => request<{ success: boolean; worker: Worker }>(`/workers/${id}`),
  createWorker: (data: Partial<Worker>) => request<{ success: boolean; worker: Worker }>('/workers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateWorker: (id: string, data: Partial<Worker>) => request<{ success: boolean; worker: Worker }>(`/workers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Shifts
  getShifts: () => request<{ success: boolean; shifts: Shift[] }>('/shifts'),
  getShiftById: (id: string) => request<{ success: boolean; shift: Shift }>(`/shifts/${id}`),
  createShift: (data: Partial<Shift>) => request<{ success: boolean; shift: Shift }>('/shifts', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateShift: (id: string, data: Partial<Shift>) => request<{ success: boolean; shift: Shift }>(`/shifts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteShift: (id: string) => request<{ success: boolean; message: string }>(`/shifts/${id}`, {
    method: 'DELETE',
  }),

  // Smart Matching & Cascade
  getShiftMatches: (shiftId: string) => request<{ success: boolean; candidates: any[] }>(`/shifts/${shiftId}/matches`),
  launchCascade: (shiftId: string, candidateWorkerIds?: string[]) => request<{ success: boolean; shift: Shift }>(`/shifts/${shiftId}/cascade`, {
    method: 'POST',
    body: JSON.stringify({ candidateWorkerIds }),
  }),
  acceptShift: (shiftId: string, workerId: string) => request<{ success: boolean; shift: Shift }>(`/shifts/${shiftId}/accept`, {
    method: 'POST',
    body: JSON.stringify({ workerId }),
  }),
  declineShift: (shiftId: string, workerId: string) => request<{ success: boolean; shift: Shift }>(`/shifts/${shiftId}/decline`, {
    method: 'POST',
    body: JSON.stringify({ workerId }),
  }),

  // QR Attendance
  getShiftQRCode: (shiftId: string) => request<{ success: boolean; qrCodeSecret: string; qrPayload: string }>(`/shifts/${shiftId}/qr-code`),
  getAttendanceLogs: () => request<{ success: boolean; attendance: AttendanceRecord[] }>('/attendance'),
  scanQRCode: (payload: { shiftId: string; workerId: string; qrCodeSecret: string; scanType: 'check_in' | 'check_out' }) =>
    request<{ success: boolean; message: string; shift: Shift; attendance?: AttendanceRecord }>('/attendance/scan', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Ratings
  getRatings: () => request<{ success: boolean; ratings: Rating[] }>('/ratings'),
  submitRating: (data: Partial<Rating>) => request<{ success: boolean; rating: Rating }>('/ratings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Analytics
  getAnalytics: () => request<{ success: boolean; analytics: PlatformAnalytics }>('/analytics'),

  // Database Clear
  clearDatabase: () => request<{ success: boolean; message: string }>('/database/clear', {
    method: 'POST',
  }),

  // Test Endpoint
  testInsertUser: (userData?: { name?: string; email?: string; role?: string; phone?: string }) => request<{
    success: boolean;
    message: string;
    activeDatabase: string;
    isAtlasConnected: boolean;
    document: any;
    totalUsersInCollection: number;
    auditChecklist: any;
  }>('/test/insert-user', {
    method: 'POST',
    body: JSON.stringify(userData || {}),
  }),
};
