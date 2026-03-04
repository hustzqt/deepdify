import { Redis } from "@upstash/redis"
import type { VercelRequest, VercelResponse } from "@vercel/node"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const STAGES_KEY = "stages:data"

// 初始化默认阶段数据
const defaultStages: StagesData = {
  stages: [
    {
      id: "stage-1",
      title: "第一阶段：基础入门",
      description: "从零开始，掌握编程基础和核心概念",
      items: [
        { id: "s1-1", title: "环境搭建", completed: false },
        { id: "s1-2", title: "变量和数据类型", completed: false },
        { id: "s1-3", title: "条件语句", completed: false },
        { id: "s1-4", title: "循环结构", completed: false },
        { id: "s1-5", title: "函数基础", completed: false },
      ],
    },
    {
      id: "stage-2",
      title: "第二阶段：进阶提升",
      description: "深入学习高级特性和最佳实践",
      items: [
        { id: "s2-1", title: "面向对象编程", completed: false },
        { id: "s2-2", title: "异步编程", completed: false },
        { id: "s2-3", title: "错误处理", completed: false },
        { id: "s2-4", title: "模块化开发", completed: false },
        { id: "s2-5", title: "测试基础", completed: false },
      ],
    },
    {
      id: "stage-3",
      title: "第三阶段：项目实战",
      description: "通过实际项目巩固所学知识",
      items: [
        { id: "s3-1", title: "项目规划", completed: false },
        { id: "s3-2", title: "需求分析", completed: false },
        { id: "s3-3", title: "编码实现", completed: false },
        { id: "s3-4", title: "测试与调试", completed: false },
        { id: "s3-5", title: "部署上线", completed: false },
      ],
    },
  ],
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { method } = request

  // GET /api/stages - 获取阶段数据
  if (method === "GET") {
    try {
      let stages = await redis.get<StagesData>(STAGES_KEY)
      if (!stages) {
        // 如果没有数据，初始化默认数据
        stages = defaultStages
        await redis.set(STAGES_KEY, stages)
      }
      return response.status(200).json(stages)
    } catch (error) {
      console.error("Error fetching stages:", error)
      return response.status(500).json({ error: "Failed to fetch stages" })
    }
  }

  // PUT /api/stages - 更新阶段数据（需要管理员权限）
  if (method === "PUT") {
    try {
      // 检查管理员权限
      const adminEmail = request.headers["x-admin-email"] as string
      if (adminEmail !== "admin@deepdify.com") {
        return response.status(403).json({ error: "Forbidden: Admin access required" })
      }

      const { stages } = request.body

      if (!stages || !Array.isArray(stages)) {
        return response.status(400).json({ error: "Invalid stages data" })
      }

      const updatedData: StagesData = { stages }
      await redis.set(STAGES_KEY, updatedData)
      return response.status(200).json(updatedData)
    } catch (error) {
      console.error("Error updating stages:", error)
      return response.status(500).json({ error: "Failed to update stages" })
    }
  }

  return response.status(405).json({ error: "Method not allowed" })
}

interface StagesData {
  stages: Stage[]
}

interface Stage {
  id: string
  title: string
  description: string
  items: StageItem[]
}

interface StageItem {
  id: string
  title: string
  completed: boolean
}
