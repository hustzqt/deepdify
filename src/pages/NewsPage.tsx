import { useState, useMemo, useEffect } from "react"
import { format, isToday, parseISO } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNews, type NewsCategory } from "@/contexts/NewsContext"
import { Newspaper, Wrench, GraduationCap, FlaskConical, Bell } from "lucide-react"

const categories: (NewsCategory | "全部")[] = ["全部", "新闻", "工具", "教程", "研究"]

const categoryIcons: Record<NewsCategory, React.ReactNode> = {
  "新闻": <Newspaper className="h-4 w-4" />,
  "工具": <Wrench className="h-4 w-4" />,
  "教程": <GraduationCap className="h-4 w-4" />,
  "研究": <FlaskConical className="h-4 w-4" />
}

const categoryColors: Record<NewsCategory, string> = {
  "新闻": "bg-red-500",
  "工具": "bg-blue-500",
  "教程": "bg-green-500",
  "研究": "bg-purple-500"
}

export function NewsPage() {
  const { newsItems, markAllAsRead } = useNews()
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | "全部">("全部")

  // Mark all as read when entering the page
  useEffect(() => {
    markAllAsRead()
  }, [markAllAsRead])

  const filteredNews = useMemo(() => {
    if (selectedCategory === "全部") {
      return newsItems
    }
    return newsItems.filter(item => item.category === selectedCategory)
  }, [newsItems, selectedCategory])

  // Sort by date descending
  const sortedNews = useMemo(() => {
    return [...filteredNews].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [filteredNews])

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">每日资讯</h1>
        <p className="text-muted-foreground">获取最新科技资讯</p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="flex items-center gap-1"
          >
            {category !== "全部" && categoryIcons[category as NewsCategory]}
            {category}
          </Button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-4">
        {sortedNews.length > 0 ? (
          sortedNews.map(news => {
            const isNew = isToday(parseISO(news.date))
            return (
              <Card key={news.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className={`${categoryColors[news.category]} hover:${categoryColors[news.category]}`}>
                      <span className="flex items-center gap-1">
                        {categoryIcons[news.category]}
                        {news.category}
                      </span>
                    </Badge>
                    {isNew && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Bell className="h-3 w-3" />
                        NEW
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {format(parseISO(news.date), "yyyy年MM月dd日", { locale: zhCN })}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{news.title}</CardTitle>
                  <CardDescription className="text-base">
                    {news.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost">阅读全文</Button>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无资讯</p>
          </div>
        )}
      </div>
    </div>
  )
}
