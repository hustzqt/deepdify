// API 服务层 - 用于调用后端 API

const API_BASE = ""

export interface KnowledgeItem {
  id: string
  title: string
  description: string
  type: string
  tags: string[]
  author: string
  updatedAt: string
  createdAt?: string
}

export interface NewsItem {
  id: string
  title: string
  summary: string
  category: string
  date: string
  isRead: boolean
  createdAt: string
}

export interface Stage {
  id: string
  title: string
  description: string
  items: StageItem[]
}

export interface StageItem {
  id: string
  title: string
  completed: boolean
}

export interface StagesData {
  stages: Stage[]
}

// 知识库 API
export const knowledgeApi = {
  async getAll(): Promise<KnowledgeItem[]> {
    const response = await fetch(`${API_BASE}/api/knowledge`)
    if (!response.ok) throw new Error("Failed to fetch knowledge")
    return response.json()
  },

  async create(data: Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt">): Promise<KnowledgeItem> {
    const response = await fetch(`${API_BASE}/api/knowledge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-email": localStorage.getItem("deepdify_admin_email") || "",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create knowledge")
    }
    return response.json()
  },

  async update(id: string, data: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    const response = await fetch(`${API_BASE}/api/knowledge/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-email": localStorage.getItem("deepdify_admin_email") || "",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update knowledge")
    }
    return response.json()
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api/knowledge/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-email": localStorage.getItem("deepdify_admin_email") || "",
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to delete knowledge")
    }
  },
}

// 资讯 API
export const newsApi = {
  async getAll(): Promise<NewsItem[]> {
    const response = await fetch(`${API_BASE}/api/news`)
    if (!response.ok) throw new Error("Failed to fetch news")
    return response.json()
  },

  async create(data: Omit<NewsItem, "id" | "isRead" | "createdAt">): Promise<NewsItem> {
    const response = await fetch(`${API_BASE}/api/news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-email": localStorage.getItem("deepdify_admin_email") || "",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create news")
    }
    return response.json()
  },
}

// 阶段学习 API
export const stagesApi = {
  async getAll(): Promise<StagesData> {
    const response = await fetch(`${API_BASE}/api/stages`)
    if (!response.ok) throw new Error("Failed to fetch stages")
    return response.json()
  },

  async update(data: StagesData): Promise<StagesData> {
    const response = await fetch(`${API_BASE}/api/stages`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-email": localStorage.getItem("deepdify_admin_email") || "",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update stages")
    }
    return response.json()
  },
}
