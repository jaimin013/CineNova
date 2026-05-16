import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tab } from '../types/admin'
import { Sidebar } from '../components/admin/Sidebar'
import { AdminHeader } from '../components/admin/SharedComponents'
import { ConfirmModal } from '../components/movie-detail/ConfirmModal'

// Tabs
import { OverviewTab } from '../components/admin/OverviewTab'
import { ContentTab } from '../components/admin/ContentTab'
import { CollectionsTab } from '../components/admin/CollectionsTab'
import { PlatformsTab } from '../components/admin/PlatformsTab'
import { CommunitiesTab } from '../components/admin/CommunitiesTab'
import { PipelineTab } from '../components/admin/PipelineTab'
import { UsersTab } from '../components/admin/UsersTab'
import { ReportsTab } from '../components/admin/ReportsTab'

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  // Modal state for confirmation
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => Promise<void> | void
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  // Check admin auth
  useEffect(() => {
    const token = localStorage.getItem('adminAccessToken')
    if (!token) {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminAccessToken')
    localStorage.removeItem('adminRefreshToken')
    localStorage.removeItem('admin')
    navigate('/admin/login')
  }

  const handleConfirmDelete = (id: number, type: string) => {
    let title = 'Delete Item?'
    let message = 'Are you sure you want to delete this? This action cannot be undone.'
    let endpoint = ''

    switch (type) {
      case 'content':
        title = 'Delete Content?'
        message = 'Are you sure you want to delete this content? This will remove all associated reviews and data.'
        endpoint = `/api/admin/content/${id}`
        break
      case 'users':
        title = 'Delete User?'
        message = 'Are you sure you want to delete this user? All their reviews and history will be permanently removed.'
        endpoint = `/api/admin/users/${id}`
        break
      case 'sections':
        title = 'Delete Section?'
        message = 'Are you sure you want to delete this section? This action cannot be undone.'
        endpoint = `/api/admin/sections/${id}`
        break
      case 'genres':
        title = 'Delete Genre?'
        message = 'Are you sure you want to delete this genre? This action cannot be undone.'
        endpoint = `/api/admin/genres/${id}`
        break
      case 'platforms':
        title = 'Delete Platform?'
        message = 'Are you sure you want to delete this platform? This will remove it from all content associations.'
        endpoint = `/api/admin/platforms/${id}`
        break
      case 'communities':
        title = 'Delete Community?'
        message = 'Are you sure you want to delete this club? All messages within it will be permanently lost.'
        endpoint = `/api/admin/communities/${id}`
        break
      case 'editors-pick-categories':
        title = 'Delete Favorites Category?'
        message = 'Are you sure you want to delete this favorites category? Items will become Uncategorized.'
        endpoint = `/api/admin/editors-pick-categories/${id}`
        break
      case 'reports':
        title = 'Delete Reported Review?'
        message = 'This will permanently remove the review and all its data. The user will not be notified.'
        endpoint = `/api/admin/reports/${id}/delete`
        break
    }

    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('adminAccessToken')
          const method = type === 'reports' ? 'POST' : 'DELETE'
          const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
            method,
            headers: { Authorization: `Bearer ${token}` },
          })
          const data = await response.json()
          if (data.success) {
            // Force a re-render of the active tab by slightly toggling it or just letting the component handle its own refresh if it was passed a callback.
            // Since we want them independent, the tabs should probably handle their own refresh or we can use a key.
            setConfirmModal((prev) => ({ ...prev, isOpen: false }))
            // Simple hack to refresh the current tab component
            const currentTab = activeTab
            setActiveTab('overview')
            setTimeout(() => setActiveTab(currentTab), 10)
          }
        } catch (err) {
          console.error(err)
        }
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white flex">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="flex-1 relative z-10 flex flex-col min-w-0">
        <AdminHeader activeTab={activeTab} />

        <div className="p-10">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'content' && <ContentTab onConfirmDelete={handleConfirmDelete} />}
          {activeTab === 'collections' && <CollectionsTab onConfirmDelete={handleConfirmDelete} />}
          {activeTab === 'platforms' && <PlatformsTab onConfirmDelete={handleConfirmDelete} />}
          {activeTab === 'communities' && <CommunitiesTab onConfirmDelete={handleConfirmDelete} />}
          {activeTab === 'pipeline' && <PipelineTab />}
          {activeTab === 'users' && <UsersTab onConfirmDelete={handleConfirmDelete} />}
          {activeTab === 'reports' && <ReportsTab onConfirmDelete={handleConfirmDelete} />}
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
      />
    </div>
  )
}
