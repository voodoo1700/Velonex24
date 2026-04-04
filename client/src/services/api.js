const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = `${API_URL}/api`;
  }

  getHeaders() {
    const token = localStorage.getItem('velonex_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request(path, options = {}) {
    const res = await fetch(`${this.baseURL}${path}`, {
      ...options,
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  // Auth
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Shipments
  async trackShipment(trackingId) {
    return this.request(`/shipments/track/${trackingId}`);
  }

  async getShipments(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/shipments${query ? `?${query}` : ''}`);
  }

  async createShipment(data) {
    return this.request('/shipments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateShipment(id, data) {
    return this.request(`/shipments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async updateShipmentStatus(id, data) {
    return this.request(`/shipments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async holdShipment(id, holdReason) {
    return this.request(`/shipments/${id}/hold`, {
      method: 'PUT',
      body: JSON.stringify({ holdReason })
    });
  }

  async resumeShipment(id) {
    return this.request(`/shipments/${id}/resume`, {
      method: 'PUT'
    });
  }

  async deleteShipment(id) {
    return this.request(`/shipments/${id}`, { method: 'DELETE' });
  }

  // Chat
  async getChatSessions(status) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/chat/sessions${query}`);
  }

  async getChatSession(sessionId) {
    return this.request(`/chat/sessions/${sessionId}`);
  }

  async createChatSession(sessionId, userName) {
    return this.request('/chat/sessions', {
      method: 'POST',
      body: JSON.stringify({ sessionId, userName })
    });
  }

  async closeChatSession(sessionId) {
    return this.request(`/chat/sessions/${sessionId}/close`, {
      method: 'PUT'
    });
  }

  // Admin
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAdminUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/users${query ? `?${query}` : ''}`);
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, { method: 'DELETE' });
  }

  async updateUserRole(id, role) {
    return this.request(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
  }
}

export default new ApiService();
