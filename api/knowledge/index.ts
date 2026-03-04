import { Redis } from "@upstash/redis"
import type { VercelRequest, VercelResponse } from "@vercel/node"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const KNOWLEDGE_KEY = "knowledge:items"
const NEWS_KEY = "news:items"
const STAGES_KEY = "stages:data"

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { method } = request

  // GET /api/knowledge - 获取知识库列表
  if (method === "GET") {
    try {
      const items = await redis.lrange<KnowledgeItem>(KNOWLEDGE_KEY, 0, -1)
      return response.status(200).json(items.reverse())
    } catch (error) {
      console.error("Error fetching knowledge:", error)
      return response.status(500).json({ error: "Failed to fetch knowledge" })
    }
  }

  // POST /api/knowledge - 添加新知识（需要管理员权限）
  if (method === "POST") {
    try {
      // 检查管理员权限
      const adminEmail = request.headers["x-admin-email"] as string
      if (adminEmail !== "admin@deepdify.com") {
        return response.status(403).json({ error: "Forbidden: Admin access required" })
      }

      const { title, description, type, tags, author } = request.body

      if (!title || !description || !type) {
        return response.status(400).json({ error: "Missing required fields" })
      }

      const newItem: KnowledgeItem = {
        id: Date.now().toString(),
        title,
        description,
        type,
        tags: tags || [],
        author: author || "管理员",
        updatedAt: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      }

      await redis.rpush(KNOWLEDGE_KEY, newItem)
      return response.status(201).json(newItem)
    } catch (error) {
      console.error("Error creating knowledge:", error)
      return response.status(500).json({ error: "Failed to create knowledge" })
    }
  }

  return response.status(405).json({ error: "Method not allowed" })
}

interface KnowledgeItem {
  id: string
  title: string
  description: string
  type: string
  tags: string[]
  author: string
  updatedAt: string
  createdAt?: string
}
