import { Redis } from "@upstash/redis"
import type { VercelRequest, VercelResponse } from "@vercel/node"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const NEWS_KEY = "news:items"

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { method } = request

  // GET /api/news - 获取资讯列表
  if (method === "GET") {
    try {
      const items = await redis.lrange<NewsItem>(NEWS_KEY, 0, -1)
      return response.status(200).json(items.reverse())
    } catch (error) {
      console.error("Error fetching news:", error)
      return response.status(500).json({ error: "Failed to fetch news" })
    }
  }

  // POST /api/news - 添加资讯（需要管理员权限）
  if (method === "POST") {
    try {
      // 检查管理员权限
      const adminEmail = request.headers["x-admin-email"] as string
      if (adminEmail !== "admin@deepdify.com") {
        return response.status(403).json({ error: "Forbidden: Admin access required" })
      }

      const { title, summary, category, date } = request.body

      if (!title || !summary || !category) {
        return response.status(400).json({ error: "Missing required fields" })
      }

      const newItem: NewsItem = {
        id: `news_${Date.now()}`,
        title,
        summary,
        category,
        date: date || new Date().toISOString().split("T")[0],
        isRead: false,
        createdAt: new Date().toISOString(),
      }

      await redis.rpush(NEWS_KEY, newItem)
      return response.status(201).json(newItem)
    } catch (error) {
      console.error("Error creating news:", error)
      return response.status(500).json({ error: "Failed to create news" })
    }
  }

  return response.status(405).json({ error: "Method not allowed" })
}

interface NewsItem {
  id: string
  title: string
  summary: string
  category: string
  date: string
  isRead: boolean
  createdAt: string
}
