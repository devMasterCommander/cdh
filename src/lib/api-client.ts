// API Client para comunicación con el backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async signIn(email: string) {
    return this.request('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Courses endpoints
  async getCourses() {
    return this.request('/api/courses');
  }

  async getCourse(id: string) {
    return this.request(`/api/courses/${id}`);
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/api/user/profile');
  }

  async getUserCourses() {
    return this.request('/api/my-courses');
  }

  async getUserProgress() {
    return this.request('/api/user/progress-stats');
  }

  async getUserAffiliateStats() {
    return this.request('/api/user/affiliate-stats');
  }

  async requestAffiliate() {
    return this.request('/api/user/request-affiliate', {
      method: 'POST',
    });
  }

  // Progress endpoints
  async updateProgress(lessonId: string, completed: boolean) {
    return this.request('/api/progress/toggle-complete', {
      method: 'POST',
      body: JSON.stringify({ lessonId, completed }),
    });
  }

  async updateVideoTime(lessonId: string, time: number) {
    return this.request('/api/progress/update-time', {
      method: 'POST',
      body: JSON.stringify({ lessonId, time }),
    });
  }

  // Checkout endpoints
  async createCheckoutSession(courseId: string) {
    return this.request('/api/checkout_sessions', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  }

  // Demo endpoints (solo en desarrollo)
  async demoLogin(email: string, password: string) {
    return this.request('/api/demo/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
}

// Instancia singleton
export const apiClient = new ApiClient();

// Hook para usar en componentes React
export function useApiClient() {
  return apiClient;
}
