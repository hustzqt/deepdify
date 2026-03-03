import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Database, Users, ArrowRight, Sparkles } from "lucide-react"

interface LearningPhase {
  id: number
  phase: string
  title: string
  concept: string
  objectives: string[]
  icon: React.ReactNode
  gradient: string
}

const learningPhases: LearningPhase[] = [
  {
    id: 1,
    phase: "阶段一",
    title: "AI基建与新读写能力",
    concept: "成为AI的老管家，掌握上下文工程",
    objectives: [
      "理解大型语言模型的工作原理",
      "掌握提示词工程与上下文优化",
      "学习如何高效与AI协作"
    ],
    icon: <Brain className="h-8 w-8" />,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    phase: "阶段二",
    title: "知识库驱动与技能封装",
    concept: "成为经验的架构师，RAG与技能封装",
    objectives: [
      "构建个人知识管理系统",
      "掌握RAG检索增强生成技术",
      "实现经验的数字化封装与复用"
    ],
    icon: <Database className="h-8 w-8" />,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    phase: "阶段三",
    title: "智能体搭建与编排",
    concept: "成为超级个体的指挥官，多Agent协作",
    objectives: [
      "掌握AI Agent开发技术",
      "学习多Agent系统设计与编排",
      "打造个人AI工作流自动化"
    ],
    icon: <Users className="h-8 w-8" />,
    gradient: "from-orange-500 to-red-500"
  }
]

export function HomePage() {
  return (
    <div className="container py-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-6 w-6" />
          <span className="text-sm font-medium">AI 学习平台</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          欢迎来到 Deepdify
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          探索知识的海洋，获取每日最新资讯，打造属于你的个人知识库
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link to="/register">立即开始</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/knowledge">了解更多</Link>
          </Button>
        </div>
      </section>

      {/* Learning Phases */}
      <section className="py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">三阶段学习路径</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            跟着这个系统的学习路径，从AI基础到智能体搭建，
            逐步成为AI时代的超级个体
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {learningPhases.map((phase, index) => (
            <Card
              key={phase.id}
              className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${phase.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />

              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="font-normal">
                    {phase.phase}
                  </Badge>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${phase.gradient} text-white`}>
                    {phase.icon}
                  </div>
                </div>
                <CardTitle className="text-xl">{phase.title}</CardTitle>
                <CardDescription className="text-base font-medium text-foreground/80">
                  {phase.concept}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {phase.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-sm text-muted-foreground">{obj}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full group-hover:gap-2 transition-all">
                  开始学习
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>

              {/* Step Indicator */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1">
                  {learningPhases.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i <= index ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-6 md:grid-cols-3 py-10">
        <Card>
          <CardHeader>
            <CardTitle>知识库</CardTitle>
            <CardDescription>整理和分享你的知识</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              建立个人知识库，系统化管理你的学习资料和笔记
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>每日资讯</CardTitle>
            <CardDescription>获取最新资讯</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              每天更新精选资讯，让你随时掌握行业动态
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>社区交流</CardTitle>
            <CardDescription>与志同道合的人交流</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              与其他学习者分享经验，共同成长进步
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
