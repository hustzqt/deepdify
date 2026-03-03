import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { format, isToday, parseISO } from "date-fns"

export type NewsCategory = "新闻" | "工具" | "教程" | "研究"

interface NewsItem {
  id: string
  title: string
  summary: string
  category: NewsCategory
  date: string // YYYY-MM-DD
  isRead: boolean
  createdAt: string // ISO timestamp
}

interface NewsContextType {
  newsItems: NewsItem[]
  hasUnreadToday: boolean
  markAllAsRead: () => void
  refreshNews: () => void
}

const NewsContext = createContext<NewsContextType | undefined>(undefined)

const NEWS_STORAGE_KEY = "deepdify_news"

// Mock data templates
const mockNewsTemplates: { category: NewsCategory; titles: string[]; summaries: string[] }[] = [
  {
    category: "新闻",
    titles: [
      "React 19 正式发布，带来全新特性",
      "TypeScript 5.5 版本正式发布",
      "Vue 4.0 路线图公布",
      "Rust 2024 年度调查报告发布"
    ],
    summaries: [
      "React 19 引入了新的编译器和改进的 Hooks API，为开发者提供更强大的能力。",
      "TypeScript 5.5 带来更智能的类型推断和性能优化，开发者体验大幅提升。",
      "Vue 团队公布了 Vue 4.0 的开发计划，预计将带来更大的性能提升。",
      "Rust 社区公布了年度开发者调查，展示了 Rust 生态的快速发展。"
    ]
  },
  {
    category: "工具",
    titles: [
      "新一代 AI 编程助手发布",
      "Docker Desktop 优化更新",
      "VS Code 新版发布",
      "GitHub Copilot X 正式版推出"
    ],
    summaries: [
      "各大科技公司纷纷推出 AI 编程助手，开发者效率显著提升。",
      "Docker Desktop 带来更轻量级的容器运行方式，资源占用大幅降低。",
      "VS Code 新版增强了对 AI 的支持，智能化程度更高。",
      "GitHub Copilot X 正式版支持更多编程语言和框架。"
    ]
  },
  {
    category: "教程",
    titles: [
      "从零开始的 React 教程",
      "Node.js 最佳实践指南",
      "TypeScript 进阶之路",
      "Docker 入门到精通"
    ],
    summaries: [
      "适合初学者的 React 完整教程，包含大量示例代码。",
      "Node.js 开发中的常见问题和最佳实践总结。",
      "深入理解 TypeScript 类型系统，提升代码质量。",
      "Docker 容器化部署的完整指南，从基础到进阶。"
    ]
  },
  {
    category: "研究",
    titles: [
      "2026 年前端发展趋势报告",
      "JavaScript 引擎性能对比",
      "WebAssembly 现状与未来",
      "AI 辅助编程最新研究"
    ],
    summaries: [
      "分析前端领域的技术趋势和未来发展方向。",
      "主流 JavaScript 引擎性能测试和对比分析。",
      "WebAssembly 技术的最新进展和应用场景。",
      "AI 在编程辅助领域的研究成果和实际应用。"
    ]
  }
]

function generateMockNews(): NewsItem[] {
  const today = format(new Date(), "yyyy-MM-dd")
  const items: NewsItem[] = []
  let id = 1

  mockNewsTemplates.forEach(template => {
    const count = template.titles.length
    for (let i = 0; i < count; i++) {
      items.push({
        id: `news_${id++}`,
        title: template.titles[i],
        summary: template.summaries[i],
        category: template.category,
        date: today,
        isRead: false,
        createdAt: new Date().toISOString()
      })
    }
  })

  return items
}

function loadStoredNews(): NewsItem[] {
  const stored = localStorage.getItem(NEWS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveNews(news: NewsItem[]): void {
  localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(news))
}

export function NewsProvider({ children }: { children: ReactNode }) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])

  const initializeNews = useCallback(() => {
    const stored = loadStoredNews()
    const today = format(new Date(), "yyyy-MM-dd")

    // Check if today's news exists
    const hasTodayNews = stored.some(item => item.date === today)

    if (stored.length === 0) {
      // First time, generate mock data
      const mockNews = generateMockNews()
      saveNews(mockNews)
      setNewsItems(mockNews)
    } else if (!hasTodayNews) {
      // Generate new news for today
      const mockNews = generateMockNews()
      const updated = [...mockNews, ...stored]
      saveNews(updated)
      setNewsItems(updated)
    } else {
      setNewsItems(stored)
    }
  }, [])

  useEffect(() => {
    initializeNews()
  }, [initializeNews])

  const hasUnreadToday = newsItems.some(
    item => isToday(parseISO(item.date)) && !item.isRead
  )

  const markAllAsRead = () => {
    const updated = newsItems.map(item => ({
      ...item,
      isRead: true
    }))
    saveNews(updated)
    setNewsItems(updated)
  }

  const refreshNews = () => {
    initializeNews()
  }

  return (
    <NewsContext.Provider value={{ newsItems, hasUnreadToday, markAllAsRead, refreshNews }}>
      {children}
    </NewsContext.Provider>
  )
}

export function useNews() {
  const context = useContext(NewsContext)
  if (context === undefined) {
    throw new Error("useNews must be used within a NewsProvider")
  }
  return context
}
