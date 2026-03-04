import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { NewsProvider } from "@/contexts/NewsContext"
import { CheckInProvider } from "@/contexts/CheckInContext"
import { MainLayout } from "@/components/layout/MainLayout"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { HomePage } from "@/pages/HomePage"
import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"
import { ProfilePage } from "@/pages/ProfilePage"
import { KnowledgePage } from "@/pages/KnowledgePage"
import { NewsPage } from "@/pages/NewsPage"
import { AdminPage } from "@/pages/AdminPage"

function AppContent() {
  const { user } = useAuth()

  return (
    <NewsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  {user ? (
                    <CheckInProvider userId={user.id}>
                      <ProfilePage />
                    </CheckInProvider>
                  ) : (
                    <ProfilePage />
                  )}
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </NewsProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
