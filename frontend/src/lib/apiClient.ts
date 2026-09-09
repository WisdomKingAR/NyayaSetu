import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 35_000, // 35s — Sarvam OCR can be slow
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor: inject auth token ──────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Read token from localStorage (set by auth.store.ts)
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('nyaya_access_token')
        : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor: handle 401 + error normalisation ─────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear stored credentials
      localStorage.removeItem('nyaya_access_token');
      localStorage.removeItem('nyaya_refresh_token');
      // Redirect to login (avoid using router here — we're outside React)
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  },
);

// ─── Typed API helpers ───────────────────────────────────────────────────────

/** Upload a file and create a document record */
export async function uploadDocument(file: File, userId?: string) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/api/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/** Trigger the OCR → Summarize → Translate pipeline */
export async function processDocument(documentId: string) {
  const response = await apiClient.post(`/api/documents/${documentId}/process`);
  return response.data;
}

/** Get list of all documents */
export async function listDocuments(search?: string) {
  const params = search ? { search } : undefined;
  const response = await apiClient.get('/api/documents', { params });
  return response.data;
}

/** Get a single document by ID */
export async function getDocument(documentId: string) {
  const response = await apiClient.get(`/api/documents/${documentId}`);
  return response.data;
}

/** Send a chat message for a specific document */
export async function chatWithDocument(documentId: string, question: string) {
  const response = await apiClient.post(`/api/documents/${documentId}/chat`, {
    question,
  });
  return response.data;
}

/** Sign up a new user */
export async function signUp(
  data: { email: string; password: string; name?: string; role?: string } | string,
  password?: string,
  fullName?: string,
  role?: string,
) {
  if (typeof data === 'object') {
    const response = await apiClient.post('/api/auth/signup', {
      email: data.email,
      password: data.password,
      fullName: data.name,
      role: data.role,
    });
    return response.data;
  }
  const response = await apiClient.post('/api/auth/signup', {
    email: data,
    password,
    fullName,
    role,
  });
  return response.data;
}

/** Sign in an existing user */
export async function signIn(
  data: { username?: string; email?: string; password: string } | string,
  password?: string,
) {
  const email = typeof data === 'object' ? data.email || data.username : data;
  const pwd = typeof data === 'object' ? data.password : password;
  const response = await apiClient.post('/api/auth/signin', { email, password: pwd });
  return response.data;
}

export const logIn = signIn;

/** Get current user profile */
export async function getMe() {
  const response = await apiClient.get('/api/auth/me');
  return response.data;
}

/** Sign out */
export async function signOut() {
  const response = await apiClient.post('/api/auth/signout');
  return response.data;
}

/** Health check — used for cold-start detection */
export async function healthCheck() {
  const response = await apiClient.get('/health', { timeout: 5000 });
  return response.data;
}

export default apiClient;
