import { Redis } from "@upstash/redis"
import type { VercelRequest, VercelResponse } from "@vercel/node"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const KNOWLEDGE_KEY = "knowledge:items"

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { method } = request
  const { id } = request.query

  if (!id || typeof id !== "string") {
    return response.status(400).json({ error: "Invalid ID" })
  }

  // PUT /api/knowledge/:id - 更新知识
  if (method === "PUT") {
    try {
      // 检查管理员权限
      const adminEmail = request.headers["x-admin-email"] as string
      if (adminEmail !== "admin@deepdify.com") {
        return response.status(403).json({ error: "Forbidden: Admin access required" })
      }

      const items = await redis.lrange<KnowledgeItem>(KNOWLEDGE_KEY, 0, -1)
      const index = items.findIndex((item) => item.id === id)

      if (index === -1) {
        return response.status(404).json({ error: "Knowledge item not found" })
      }

      const { title, description, type, tags, author } = request.body

      const updatedItem: KnowledgeItem = {
        ...items[index],
        ...(title && { title }),
        ...(description && { description }),
        ...(type && { type }),
        ...(tags && { tags }),
        ...(author && { author }),
        updatedAt: new Date().toISOString().split("T")[0],
      }

      await redis.lset(KNOWLEDGE_KEY, index, updatedItem)
      return response.status(200).json(updatedItem)
    } catch (error) {
      console.error("Error updating knowledge:", error)
      return response.status(500).json({ error: "Failed to update knowledge" })
    }
  }

  // DELETE /api/knowledge/:id - 删除知识
  if (method === "DELETE") {
    try {
      // 检查管理员权限
      const adminEmail = request.headers["x-admin-email"] as string
      if (adminEmail !== "admin@deepdify.com") {
        return response.status(403).json({ error: "Forbidden: Admin access required" })
      }

      const items = await redis.lrange<KnowledgeItem>(KNOWLEDGE_KEY, 0, -1)
      const index = items.findIndex((item) => item.id === id)

      if (index === -1) {
        return response.status(404).json({ error: "Knowledge item not found" })
      }

      await redis.lrem(KNOWLEDGE_KEY, 1, items[index])
      return response.status(200).json({ success: true })
    } catch (error) {
      console.error("Error deleting knowledge:", error)
      return response.status(500).json({ error: "Failed to delete knowledge" })
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
