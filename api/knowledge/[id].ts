import { Redis } from "@upstash/redis";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// 定义知识项的类型（可根据实际字段调整）
interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  type: string;
  tags: string[];
  author: string;
  createdAt: string;
}

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const KNOWLEDGE_KEY = "knowledge:items";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { method } = request;
  const { id } = request.query;

  if (!id || typeof id !== "string") {
    return response.status(400).json({ error: "Invalid ID" });
  }

  // 管理员验证（统一处理）
  const adminEmail = request.headers["x-admin-email"] as string;
  if (adminEmail !== "admin@deepdify.com") {
    return response.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    if (method === "PUT") {
      // 处理更新知识
      const items = await redis.lrange<KnowledgeItem>(KNOWLEDGE_KEY, 0, -1);
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) {
        return response.status(404).json({ error: "Knowledge item not found" });
      }

      const { title, description, type, tags, author } = request.body;
      const updatedItem: KnowledgeItem = {
        ...items[index],
        title: title || items[index].title,
        description: description || items[index].description,
        type: type || items[index].type,
        tags: tags || items[index].tags,
        author: author || items[index].author,
      };

      // 更新列表中的对应项
      items[index] = updatedItem;
      await redis.del(KNOWLEDGE_KEY);
      if (items.length > 0) {
        await redis.rpush(KNOWLEDGE_KEY, ...items);
      }

      return response.status(200).json(updatedItem);
    } else if (method === "DELETE") {
      // 处理删除知识
      const items = await redis.lrange<KnowledgeItem>(KNOWLEDGE_KEY, 0, -1);
      const newItems = items.filter((item) => item.id !== id);

      if (items.length === newItems.length) {
        return response.status(404).json({ error: "Knowledge item not found" });
      }

      // 删除原列表并重新添加新列表
      await redis.del(KNOWLEDGE_KEY);
      if (newItems.length > 0) {
        await redis.rpush(KNOWLEDGE_KEY, ...newItems);
      }

      return response.status(200).json({ success: true });
    } else {
      // 其他方法（GET等）暂时不支持，返回405
      response.setHeader("Allow", ["PUT", "DELETE"]);
      return response.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("API error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}
