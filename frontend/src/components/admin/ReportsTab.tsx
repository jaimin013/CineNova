import React, { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { LoadingSkeleton } from './SharedComponents'

interface ReportsTabProps {
  onConfirmDelete: (id: number, type: 'reports') => void
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ onConfirmDelete }) => {
  const [reportedReviews, setReportedReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportedReviews()
  }, [])

  const fetchReportedReviews = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) setReportedReviews(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDismissReport = async (reportId: number) => {
    try {
      const token = localStorage.getItem('adminAccessToken')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/reports/${reportId}/dismiss`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      const data = await response.json()
      if (data.success) {
        setReportedReviews(reportedReviews.filter((r) => r.id !== reportId))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {loading ? (
        <LoadingSkeleton />
      ) : reportedReviews.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mb-8">
            <CheckCircle2 className="text-green-500/40" size={40} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight mb-2">All Clear</h3>
          <p className="text-white/20 font-bold uppercase tracking-widest text-xs">
            No pending review reports to moderate
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reportedReviews.map((report) => (
            <div
              key={report.id}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md hover:bg-white/[0.03] transition-all"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Report Reason */}
                <div className="lg:w-1/3 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center">
                      <AlertCircle className="text-red-500" size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase tracking-wider">Violation Reported</h4>
                      <p className="text-[10px] text-white/30 font-black uppercase">
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-600/5 border border-red-600/10 rounded-2xl p-4">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Reason</p>
                    <p className="text-sm text-white/80 font-medium italic">"{report.reason}"</p>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white/20 text-[8px]">By</span>
                    <span className="text-blue-400">{report.reportedBy}</span>
                    <span className="text-white/10">•</span>
                    <span className="text-white/30">{report.reportedByEmail}</span>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 space-y-4 border-l border-white/5 pl-8">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                    The Content In Question
                  </p>
                  <div className="bg-white/5 rounded-2xl p-6 relative">
                    <p className="text-white/90 leading-relaxed font-medium">"{report.reviewText}"</p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-white/5 p-0.5 border border-white/10">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${report.reviewAuthorId}`}
                          className="w-full h-full rounded"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{report.reviewAuthor}</p>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                          Review ID #{report.reviewId}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:w-48 flex flex-col gap-3 justify-center">
                  <button
                    onClick={() => handleDismissReport(report.id)}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Dismiss Report
                  </button>
                  <button
                    onClick={() => onConfirmDelete(report.id, 'reports')}
                    className="w-full py-4 bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/10"
                  >
                    Delete Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
