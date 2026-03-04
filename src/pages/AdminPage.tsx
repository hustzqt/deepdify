import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { knowledgeApi, newsApi, stagesApi, type KnowledgeItem, type NewsItem, type StagesData } from "@/api/services"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  BookOpen,
  FileText,
  Video,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react"

type TabType = "knowledge" | "news" | "stages"
type ResourceType = "书籍" | "文章" | "视频" | "工具" | "案例"
type NewsCategory = "新闻" | "工具" | "教程" | "研究"

export function AdminPage() {
  const navigate = useNavigate()
  const { user, isAdmin, isLoading, adminEmail } = useAdminAuth()
  const [activeTab, setActiveTab] = useState<TabType>("knowledge")

  // 知识库状态
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [knowledgeLoading, setKnowledgeLoading] = useState(true)
  const [editingKnowledge, setEditingKnowledge] = useState<KnowledgeItem | null>(null)
  const [knowledgeForm, setKnowledgeForm] = useState({
    title: "",
    description: "",
    type: "文章" as ResourceType,
    tags: [] as string[],
    author: "",
  })

  // 资讯状态
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsForm, setNewsForm] = useState({
    title: "",
    summary: "",
    category: "新闻" as NewsCategory,
    date: new Date().toISOString().split("T")[0],
  })

  // 阶段状态
  const [stagesData, setStagesData] = useState<StagesData | null>(null)
  const [stagesLoading, setStagesLoading] = useState(true)
  const [savingStages, setSavingStages] = useState(false)

  // 权限检查
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/")
    }
  }, [isLoading, isAdmin, navigate])

  // 加载知识库数据
  useEffect(() => {
    if (!isAdmin) return

    async function loadKnowledge() {
      try {
        const data = await knowledgeApi.getAll()
        setKnowledgeItems(data)
      } catch (error) {
        console.error("Failed to load knowledge:", error)
      } finally {
        setKnowledgeLoading(false)
      }
    }
    loadKnowledge()
  }, [isAdmin])

  // 加载资讯数据
  useEffect(() => {
    if (!isAdmin) return

    async function loadNews() {
      try {
        const data = await newsApi.getAll()
        setNewsItems(data)
      } catch (error) {
        console.error("Failed to load news:", error)
      } finally {
        setNewsLoading(false)
      }
    }
    loadNews()
  }, [isAdmin])

  // 加载阶段数据
  useEffect(() => {
    if (!isAdmin) return

    async function loadStages() {
      try {
        const data = await stagesApi.getAll()
        setStagesData(data)
      } catch (error) {
        console.error("Failed to load stages:", error)
      } finally {
        setStagesLoading(false)
      }
    }
    loadStages()
  }, [isAdmin])

  // 知识库操作
  const handleKnowledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingKnowledge) {
        await knowledgeApi.update(editingKnowledge.id, knowledgeForm)
        setKnowledgeItems((prev) =>
          prev.map((item) =>
            item.id === editingKnowledge.id
              ? { ...item, ...knowledgeForm, updatedAt: new Date().toISOString().split("T")[0] }
              : item
          )
        )
      } else {
        const newItem = await knowledgeApi.create(knowledgeForm)
        setKnowledgeItems((prev) => [newItem, ...prev])
      }
      resetKnowledgeForm()
    } catch (error) {
      alert(error instanceof Error ? error.message : "操作失败")
    }
  }

  const handleKnowledgeDelete = async (id: string) => {
    if (!confirm("确定要删除这条知识吗？")) return
    try {
      await knowledgeApi.delete(id)
      setKnowledgeItems((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      alert(error instanceof Error ? error.message : "删除失败")
    }
  }

  const resetKnowledgeForm = () => {
    setKnowledgeForm({
      title: "",
      description: "",
      type: "文章",
      tags: [],
      author: "",
    })
    setEditingKnowledge(null)
  }

  const startEditKnowledge = (item: KnowledgeItem) => {
    setEditingKnowledge(item)
    setKnowledgeForm({
      title: item.title,
      description: item.description,
      type: item.type as ResourceType,
      tags: item.tags,
      author: item.author,
    })
  }

  // 资讯操作
  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newItem = await newsApi.create(newsForm)
      setNewsItems((prev) => [newItem, ...prev])
      setNewsForm({
        title: "",
        summary: "",
        category: "新闻",
        date: new Date().toISOString().split("T")[0],
      })
    } catch (error) {
      alert(error instanceof Error ? error.message : "操作失败")
    }
  }

  // 阶段操作
  const handleStagesSave = async () => {
    if (!stagesData) return
    setSavingStages(true)
    try {
      await stagesApi.update(stagesData)
      alert("保存成功！")
    } catch (error) {
      alert(error instanceof Error ? error.message : "保存失败")
    } finally {
      setSavingStages(false)
    }
  }

  const updateStageItem = (stageIndex: number, itemIndex: number, title: string) => {
    if (!stagesData) return
    const newStages = [...stagesData.stages]
    newStages[stageIndex] = {
      ...newStages[stageIndex],
      items: newStages[stageIndex].items.map((item, idx) =>
        idx === itemIndex ? { ...item, title } : item
      ),
    }
    setStagesData({ stages: newStages })
  }

  const addStageItem = (stageIndex: number) => {
    if (!stagesData) return
    const newStages = [...stagesData.stages]
    newStages[stageIndex] = {
      ...newStages[stageIndex],
      items: [
        ...newStages[stageIndex].items,
        { id: `s${stageIndex + 1}-${Date.now()}`, title: "新项目", completed: false },
      ],
    }
    setStagesData({ stages: newStages })
  }

  const deleteStageItem = (stageIndex: number, itemIndex: number) => {
    if (!stagesData) return
    const newStages = [...stagesData.stages]
    newStages[stageIndex] = {
      ...newStages[stageIndex],
      items: newStages[stageIndex].items.filter((_, idx) => idx !== itemIndex),
    }
    setStagesData({ stages: newStages })
  }

  // 加载中
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // 非管理员
  if (!isAdmin) {
    return (
      <div className="container py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              访问受限
            </CardTitle>
            <CardDescription>您没有访问管理后台的权限</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")}>返回首页</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">管理后台</h1>
          <p className="text-muted-foreground">
            管理员: {user?.email} ({adminEmail})
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "knowledge" ? "default" : "outline"}
          onClick={() => setActiveTab("knowledge")}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          知识库管理
        </Button>
        <Button
          variant={activeTab === "news" ? "default" : "outline"}
          onClick={() => setActiveTab("news")}
        >
          <FileText className="h-4 w-4 mr-2" />
          资讯管理
        </Button>
        <Button
          variant={activeTab === "stages" ? "default" : "outline"}
          onClick={() => setActiveTab("stages")}
        >
          <Video className="h-4 w-4 mr-2" />
          阶段学习
        </Button>
      </div>

      {/* 知识库管理 */}
      {activeTab === "knowledge" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingKnowledge ? "编辑知识" : "添加新知识"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleKnowledgeSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">标题</Label>
                    <Input
                      id="title"
                      value={knowledgeForm.title}
                      onChange={(e) => setKnowledgeForm({ ...knowledgeForm, title: e.target.value })}
                      placeholder="输入知识标题"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">类型</Label>
                    <select
                      id="type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={knowledgeForm.type}
                      onChange={(e) => setKnowledgeForm({ ...knowledgeForm, type: e.target.value as ResourceType })}
                    >
                      <option value="书籍">书籍</option>
                      <option value="文章">文章</option>
                      <option value="视频">视频</option>
                      <option value="工具">工具</option>
                      <option value="案例">案例</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">描述</Label>
                  <Input
                    id="description"
                    value={knowledgeForm.description}
                    onChange={(e) => setKnowledgeForm({ ...knowledgeForm, description: e.target.value })}
                    placeholder="输入知识描述"
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="author">作者</Label>
                    <Input
                      id="author"
                      value={knowledgeForm.author}
                      onChange={(e) => setKnowledgeForm({ ...knowledgeForm, author: e.target.value })}
                      placeholder="输入作者名称"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">标签（逗号分隔）</Label>
                    <Input
                      id="tags"
                      value={knowledgeForm.tags.join(", ")}
                      onChange={(e) =>
                        setKnowledgeForm({
                          ...knowledgeForm,
                          tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      placeholder="入门, 进阶, 实战"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingKnowledge ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        保存修改
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        添加知识
                      </>
                    )}
                  </Button>
                  {editingKnowledge && (
                    <Button type="button" variant="outline" onClick={resetKnowledgeForm}>
                      <X className="h-4 w-4 mr-2" />
                      取消
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>知识列表</CardTitle>
              <CardDescription>共 {knowledgeItems.length} 条知识</CardDescription>
            </CardHeader>
            <CardContent>
              {knowledgeLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {knowledgeItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{item.title}</span>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          <span className="text-xs text-muted-foreground">
                            {item.author} · {item.updatedAt}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEditKnowledge(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleKnowledgeDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 资讯管理 */}
      {activeTab === "news" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>添加新资讯</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNewsSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="news-title">标题</Label>
                    <Input
                      id="news-title"
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                      placeholder="输入资讯标题"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="news-category">分类</Label>
                    <select
                      id="news-category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newsForm.category}
                      onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value as NewsCategory })}
                    >
                      <option value="新闻">新闻</option>
                      <option value="工具">工具</option>
                      <option value="教程">教程</option>
                      <option value="研究">研究</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="news-summary">摘要</Label>
                  <Input
                    id="news-summary"
                    value={newsForm.summary}
                    onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                    placeholder="输入资讯摘要"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="news-date">日期</Label>
                  <Input
                    id="news-date"
                    type="date"
                    value={newsForm.date}
                    onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  添加资讯
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>资讯列表</CardTitle>
              <CardDescription>共 {newsItems.length} 条资讯</CardDescription>
            </CardHeader>
            <CardContent>
              {newsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {newsItems.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{item.title}</span>
                        <Badge>{item.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.summary}
                      </p>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 阶段学习 */}
      {activeTab === "stages" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>三阶段学习内容管理</CardTitle>
              <CardDescription>编辑学习阶段和项目</CardDescription>
            </CardHeader>
            <CardContent>
              {stagesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : stagesData ? (
                <div className="space-y-6">
                  {stagesData.stages.map((stage, stageIndex) => (
                    <div key={stage.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">{stage.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{stage.description}</p>
                      <div className="space-y-2">
                        {stage.items.map((item, itemIndex) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <Input
                              value={item.title}
                              onChange={(e) => updateStageItem(stageIndex, itemIndex, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => deleteStageItem(stageIndex, itemIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => addStageItem(stageIndex)}>
                          <Plus className="h-4 w-4 mr-2" />
                          添加项目
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button onClick={handleStagesSave} disabled={savingStages}>
                    {savingStages ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        保存所有修改
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">暂无数据</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
