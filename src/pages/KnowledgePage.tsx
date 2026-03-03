import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, FileText, Video, Wrench, Briefcase, X } from "lucide-react"

type ResourceType = "书籍" | "文章" | "视频" | "工具" | "案例"
type ResourceTag = "入门" | "进阶" | "实战"

interface KnowledgeItem {
  id: number
  title: string
  description: string
  type: ResourceType
  tags: ResourceTag[]
  updatedAt: string
  author: string
}

const knowledgeItems: KnowledgeItem[] = [
  {
    id: 1,
    title: "React 进阶指南",
    description: "深入理解 React 组件生命周期和 Hooks，包含大量实际案例和最佳实践。",
    type: "书籍",
    tags: ["进阶", "实战"],
    updatedAt: "2026-03-01",
    author: "张三"
  },
  {
    id: 2,
    title: "TypeScript 入门教程",
    description: "TypeScript 开发入门指南，从基础类型到高级特性，适合初学者。",
    type: "文章",
    tags: ["入门"],
    updatedAt: "2026-02-28",
    author: "李四"
  },
  {
    id: 3,
    title: "Node.js 性能优化实战",
    description: "提升 Node.js 应用性能的实用技巧，包含性能分析和优化方案。",
    type: "视频",
    tags: ["进阶", "实战"],
    updatedAt: "2026-02-25",
    author: "王五"
  },
  {
    id: 4,
    title: "数据库设计原则",
    description: "关系型数据库设计的最佳实践，涵盖范式选择和索引优化。",
    type: "文章",
    tags: ["入门", "进阶"],
    updatedAt: "2026-02-20",
    author: "赵六"
  },
  {
    id: 5,
    title: "Docker 容器化部署",
    description: "使用 Docker 进行应用容器化部署的完整指南。",
    type: "工具",
    tags: ["入门", "实战"],
    updatedAt: "2026-02-15",
    author: "孙七"
  },
  {
    id: 6,
    title: "RESTful API 设计规范",
    description: "设计高质量 RESTful API 的指南，包含错误处理和版本控制。",
    type: "案例",
    tags: ["进阶"],
    updatedAt: "2026-02-10",
    author: "周八"
  },
  {
    id: 7,
    title: "Vue3 组合式 API 教程",
    description: "Vue3 新特性组合式 API 的详细讲解和实战应用。",
    type: "视频",
    tags: ["入门", "进阶"],
    updatedAt: "2026-02-08",
    author: "吴九"
  },
  {
    id: 8,
    title: "Git 进阶技巧",
    description: "Git 高级用法，包括分支策略、代码审查和团队协作。",
    type: "书籍",
    tags: ["进阶"],
    updatedAt: "2026-02-05",
    author: "郑十"
  },
  {
    id: 9,
    title: "微服务架构实战",
    description: "微服务架构设计模式和实践，包含服务注册、熔断和限流。",
    type: "案例",
    tags: ["进阶", "实战"],
    updatedAt: "2026-02-01",
    author: "钱十一"
  },
  {
    id: 10,
    title: "Python 数据分析入门",
    description: "使用 Python 进行数据分析的基础教程，包含 Pandas 和 NumPy。",
    type: "文章",
    tags: ["入门"],
    updatedAt: "2026-01-28",
    author: "陈十二"
  }
]

const typeIcons: Record<ResourceType, React.ReactNode> = {
  "书籍": <BookOpen className="h-4 w-4" />,
  "文章": <FileText className="h-4 w-4" />,
  "视频": <Video className="h-4 w-4" />,
  "工具": <Wrench className="h-4 w-4" />,
  "案例": <Briefcase className="h-4 w-4" />
}

const typeColors: Record<ResourceType, string> = {
  "书籍": "bg-blue-500",
  "文章": "bg-green-500",
  "视频": "bg-purple-500",
  "工具": "bg-orange-500",
  "案例": "bg-cyan-500"
}

export function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<ResourceTag[]>([])
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>([])

  const filteredItems = useMemo(() => {
    return knowledgeItems.filter(item => {
      // Search filter
      const matchesSearch = searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Tag filter
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => item.tags.includes(tag))

      // Type filter
      const matchesTypes = selectedTypes.length === 0 ||
        selectedTypes.includes(item.type)

      return matchesSearch && matchesTags && matchesTypes
    })
  }, [searchQuery, selectedTags, selectedTypes])

  const toggleTag = (tag: ResourceTag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const toggleType = (type: ResourceType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
    setSelectedTypes([])
  }

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedTypes.length > 0

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">知识库</h1>
          <p className="text-muted-foreground">探索和分享知识 ({filteredItems.length} 条)</p>
        </div>
        <Button>创建新文章</Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-8">
        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索标题或描述..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">标签:</span>
          {(["入门", "进阶", "实战"] as ResourceTag[]).map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">类型:</span>
          {(["书籍", "文章", "视频", "工具", "案例"] as ResourceType[]).map(type => (
            <Badge
              key={type}
              variant={selectedTypes.includes(type) ? "default" : "outline"}
              className="cursor-pointer flex items-center gap-1"
              onClick={() => toggleType(type)}
            >
              {typeIcons[type]}
              {type}
            </Badge>
          ))}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            清除筛选
          </Button>
        )}
      </div>

      {/* Results */}
      {filteredItems.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(item => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`${typeColors[item.type]} hover:${typeColors[item.type]}`}>
                    <span className="flex items-center gap-1">
                      {typeIcons[item.type]}
                      {item.type}
                    </span>
                  </Badge>
                  <span className="text-xs text-muted-foreground">{item.updatedAt}</span>
                </div>
                <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{item.author}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">没有找到匹配的资源</p>
          <Button variant="link" onClick={clearFilters}>
            清除筛选条件
          </Button>
        </div>
      )}
    </div>
  )
}
