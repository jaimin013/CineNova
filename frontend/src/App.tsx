import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import CommunitiesClubs from './pages/CommunitiesClubs'
import ExploreCategories from './pages/ExploreCategories'
import Dashboard from './pages/Dashboard'
import LoginPortal from './pages/LoginPortal'
import RegisterPortal from './pages/RegisterPortal'
import MovieDetail from './pages/MovieDetail'
import MyLibrary from './pages/MyLibrary'
import EditorsFavorites from './pages/EditorsFavorites'
import ProfilePage from './pages/ProfilePage'
import CollectionDetails from './pages/CollectionDetails'
import AuthenticatedLayout from './components/AuthenticatedLayout'
import { AdminLogin } from './pages/AdminLogin'
import { AdminDashboard } from './pages/AdminDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPortal />} />
            <Route path="/register" element={<RegisterPortal />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Routes */}
            <Route element={<AuthenticatedLayout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collection/:id"
                element={
                  <ProtectedRoute>
                    <CollectionDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute>
                    <ExploreCategories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/communities"
                element={
                  <ProtectedRoute>
                    <CommunitiesClubs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movie-detail/:id"
                element={
                  <ProtectedRoute>
                    <MovieDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/library"
                element={
                  <ProtectedRoute>
                    <MyLibrary />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <EditorsFavorites />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
