// Blog Service - Mock implementation with localStorage
const STORAGE_KEY = 'ht5play_blogs'

// Mock blog data
const mockBlogs = [
  {
    id: 1,
    title: 'Top 10 HTML5 Games of 2024',
    slug: 'top-10-html5-games-2024',
    content: '<p>Discover the most exciting HTML5 games that have taken the gaming world by storm this year. From puzzle games to action-packed adventures, we\'ve compiled a list of must-play titles.</p><p>These games showcase the incredible potential of HTML5 technology and provide hours of entertainment directly in your browser.</p>',
    excerpt: 'Discover the most exciting HTML5 games that have taken the gaming world by storm this year.',
    featured_image: 'https://via.placeholder.com/800x400',
    author: 'Gaming Team',
    status: 'published',
    featured: true,
    views: 1540,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'The Future of Browser Gaming',
    slug: 'future-of-browser-gaming',
    content: '<p>Browser gaming has come a long way since the early days of Flash. With HTML5, WebGL, and WebAssembly, the possibilities are endless.</p><p>In this article, we explore the technologies that are shaping the future of gaming in the browser.</p>',
    excerpt: 'Browser gaming has come a long way since the early days of Flash.',
    featured_image: 'https://via.placeholder.com/800x400',
    author: 'Tech Editor',
    status: 'published',
    featured: false,
    views: 892,
    created_at: '2024-01-14T15:45:00Z',
    updated_at: '2024-01-14T15:45:00Z'
  },
  {
    id: 3,
    title: 'Game Development Tips for Beginners',
    slug: 'game-development-tips-beginners',
    content: '<p>Starting your journey in game development can be overwhelming. Here are some essential tips to help you get started.</p><p>From choosing the right tools to understanding game mechanics, we cover everything you need to know.</p>',
    excerpt: 'Starting your journey in game development can be overwhelming.',
    featured_image: 'https://via.placeholder.com/800x400',
    author: 'Dev Team',
    status: 'draft',
    featured: false,
    views: 0,
    created_at: '2024-01-13T09:20:00Z',
    updated_at: '2024-01-13T09:20:00Z'
  }
]

class BlogService {
  constructor() {
    this.initializeStorage()
  }

  initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockBlogs))
    }
  }

  getBlogs() {
    try {
      const blogs = localStorage.getItem(STORAGE_KEY)
      return blogs ? JSON.parse(blogs) : []
    } catch (error) {
      console.error('Error loading blogs:', error)
      return mockBlogs
    }
  }

  async getAllBlogs() {
    await new Promise(resolve => setTimeout(resolve, 500))
    return this.getBlogs()
  }

  async getPublishedBlogs() {
    await new Promise(resolve => setTimeout(resolve, 400))
    const blogs = this.getBlogs()
    return blogs.filter(blog => blog.status === 'published')
  }

  async getBlogById(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const blogs = this.getBlogs()
    const blog = blogs.find(b => b.id === parseInt(id))
    
    if (!blog) {
      throw new Error(`Blog with ID ${id} not found`)
    }
    
    return blog
  }

  async getBlogBySlug(slug) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const blogs = this.getBlogs()
    const blog = blogs.find(b => b.slug === slug)
    
    if (!blog) {
      throw new Error(`Blog with slug ${slug} not found`)
    }
    
    return blog
  }

  async getFeaturedBlogs() {
    await new Promise(resolve => setTimeout(resolve, 400))
    const blogs = this.getBlogs()
    return blogs.filter(blog => blog.featured && blog.status === 'published')
  }

  async getRecentBlogs(limit = 5) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const blogs = this.getBlogs()
    return blogs
      .filter(blog => blog.status === 'published')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit)
  }

  async createBlog(blogData) {
    await new Promise(resolve => setTimeout(resolve, 600))
    const blogs = this.getBlogs()
    const newBlog = {
      id: Math.max(...blogs.map(b => b.id)) + 1,
      ...blogData,
      slug: this.generateSlug(blogData.title),
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    blogs.push(newBlog)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs))
    return newBlog
  }

  async updateBlog(id, blogData) {
    await new Promise(resolve => setTimeout(resolve, 600))
    const blogs = this.getBlogs()
    const index = blogs.findIndex(b => b.id === parseInt(id))
    
    if (index === -1) {
      throw new Error(`Blog with ID ${id} not found`)
    }
    
    blogs[index] = {
      ...blogs[index],
      ...blogData,
      updated_at: new Date().toISOString()
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs))
    return blogs[index]
  }

  async deleteBlog(id) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const blogs = this.getBlogs()
    const filteredBlogs = blogs.filter(b => b.id !== parseInt(id))
    
    if (filteredBlogs.length === blogs.length) {
      throw new Error(`Blog with ID ${id} not found`)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBlogs))
    return { success: true }
  }

  async incrementViews(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const blogs = this.getBlogs()
    const index = blogs.findIndex(b => b.id === parseInt(id))
    
    if (index !== -1) {
      blogs[index].views = (blogs[index].views || 0) + 1
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs))
    }
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  async getBlogStats() {
    await new Promise(resolve => setTimeout(resolve, 300))
    const blogs = this.getBlogs()
    
    return {
      total: blogs.length,
      published: blogs.filter(b => b.status === 'published').length,
      draft: blogs.filter(b => b.status === 'draft').length,
      featured: blogs.filter(b => b.featured).length,
      totalViews: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)
    }
  }
}

export const blogService = new BlogService()