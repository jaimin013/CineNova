import React, { useState, useEffect } from 'react'
import { Search, Users, Trash2 } from 'lucide-react'
import { User } from '../../types/admin'
import { LoadingSkeleton } from './SharedComponents'

interface UsersTabProps {
  onConfirmDelete: (id: number, type: 'users') => void
}

export const UsersTab: React.FC<UsersTabProps> = ({ onConfirmDelete }) => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setUsers(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8">
            <Users className="text-white/10" size={40} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight mb-2">No Users Found</h3>
          <p className="text-white/20 font-bold uppercase tracking-widest text-xs">
            {searchTerm ? `No users matching "${searchTerm}"` : 'Your community is just getting started'}
          </p>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-white/30">
                    User
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-white/30">
                    Email
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-white/30">
                    Joined Date
                  </th>
                  <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-white/30">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/[0.03] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                            className="w-8 h-8 rounded-lg"
                          />
                        </div>
                        <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm text-white/60 font-medium">{user.email}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black uppercase text-white/30">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onConfirmDelete(user.id, 'users')}
                          className="p-2 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
