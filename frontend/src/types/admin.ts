export interface Content {
  id: number
  title: string
  description: string
  type: string
  section: string
  genre: string
  posterUrl: string
  backdropUrl?: string
  rating?: number
  releaseYear?: number
  duration?: number
  platform?: string
  featured: boolean
  editorsPick?: boolean
  editorsPickOrder?: number
  editorsPickCategoryId?: number
  groupId?: number
  groupOrder?: number
  videoUrl?: string
  casts?: string
  createdAt: string
}

export interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

export interface Section {
  id: number
  name: string
  order: number
}

export interface Genre {
  id: number
  name: string
}

export interface Platform {
  id: number
  name: string
  imageUrl?: string
}

export interface EditorsPickCategory {
  id: number
  name: string
  order: number
}

export interface Community {
  id: number
  name: string
  description: string
  imageUrl?: string
  _count?: {
    messages: number
  }
}

export interface Stats {
  totalUsers: number
  totalContent: number
  featuredContent: number
  moviesCount: number
  seriesCount: number
}

export type Tab =
  | 'overview'
  | 'content'
  | 'users'
  | 'collections'
  | 'platforms'
  | 'communities'
  | 'pipeline'
  | 'reports'
