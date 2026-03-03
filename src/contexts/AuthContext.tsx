import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  username: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, username: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "deepdify_users"
const CURRENT_USER_KEY = "deepdify_current_user"

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function getStoredUsers(): { id: string; email: string; password: string; username: string; createdAt: string }[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveUsers(users: { id: string; email: string; password: string; username: string; createdAt: string }[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY)
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getStoredUsers()
    const foundUser = users.find(u => u.email === email && u.password === password)

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
        createdAt: foundUser.createdAt
      }
      setUser(userData)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData))
      return true
    }
    return false
  }

  const register = async (email: string, password: string, username: string): Promise<boolean> => {
    const users = getStoredUsers()

    if (users.some(u => u.email === email)) {
      return false
    }

    const newUser = {
      id: generateId(),
      email,
      password,
      username,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    saveUsers(users)

    const userData: User = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      createdAt: newUser.createdAt
    }
    setUser(userData)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
