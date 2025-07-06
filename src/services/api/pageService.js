// Page Service - Mock implementation with localStorage
const STORAGE_KEY = 'ht5play_pages'

// Mock page data
const mockPages = [
  {
    id: 1,
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: '<h1>Privacy Policy</h1><p>This privacy policy explains how we collect, use, and protect your information when you use our gaming platform.</p><h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, play games, or contact us.</p><h2>How We Use Your Information</h2><p>We use the information we collect to provide, maintain, and improve our services.</p>',
    meta_title: 'Privacy Policy - HT5Play',
    meta_description: 'Learn about our privacy practices and how we protect your personal information.',
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    title: 'Terms of Service',
    slug: 'terms-of-service',
    content: '<h1>Terms of Service</h1><p>By using our gaming platform, you agree to these terms and conditions.</p><h2>Use of Service</h2><p>You may use our service for lawful purposes only. You agree not to use the service in any way that violates applicable laws.</p><h2>User Accounts</h2><p>You are responsible for maintaining the confidentiality of your account information.</p>',
    meta_title: 'Terms of Service - HT5Play',
    meta_description: 'Read our terms and conditions for using the HT5Play gaming platform.',
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    title: 'About Us',
    slug: 'about-us',
    content: '<h1>About HT5Play</h1><p>HT5Play is a premier destination for HTML5 games, offering a vast collection of free-to-play titles across various genres.</p><h2>Our Mission</h2><p>We aim to provide the best gaming experience through our carefully curated selection of HTML5 games.</p><h2>Our Team</h2><p>Our passionate team of developers and gamers work tirelessly to bring you the latest and greatest in browser gaming.</p>',
    meta_title: 'About Us - HT5Play',
    meta_description: 'Learn about HT5Play and our mission to provide the best HTML5 gaming experience.',
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    title: 'Contact Us',
    slug: 'contact-us',
    content: '<h1>Contact Us</h1><p>We\'d love to hear from you! Get in touch with us for any questions, suggestions, or feedback.</p><h2>Email</h2><p>contact@ht5play.com</p><h2>Social Media</h2><p>Follow us on social media for the latest updates and game releases.</p>',
    meta_title: 'Contact Us - HT5Play',
    meta_description: 'Get in touch with the HT5Play team. We\'d love to hear from you!',
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

class PageService {
  constructor() {
    this.initializeStorage()
  }

  initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockPages))
    }
  }

  getPages() {
    try {
      const pages = localStorage.getItem(STORAGE_KEY)
      return pages ? JSON.parse(pages) : []
    } catch (error) {
      console.error('Error loading pages:', error)
      return mockPages
    }
  }

  async getAllPages() {
    await new Promise(resolve => setTimeout(resolve, 400))
    return this.getPages()
  }

  async getPublishedPages() {
    await new Promise(resolve => setTimeout(resolve, 400))
    const pages = this.getPages()
    return pages.filter(page => page.status === 'published')
  }

  async getPageById(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const pages = this.getPages()
    const page = pages.find(p => p.id === parseInt(id))
    
    if (!page) {
      throw new Error(`Page with ID ${id} not found`)
    }
    
    return page
  }

  async getPageBySlug(slug) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const pages = this.getPages()
    const page = pages.find(p => p.slug === slug)
    
    if (!page) {
      throw new Error(`Page with slug ${slug} not found`)
    }
    
    return page
  }

  async createPage(pageData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const pages = this.getPages()
    const newPage = {
      id: Math.max(...pages.map(p => p.id)) + 1,
      ...pageData,
      slug: this.generateSlug(pageData.title),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    pages.push(newPage)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages))
    return newPage
  }

  async updatePage(id, pageData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const pages = this.getPages()
    const index = pages.findIndex(p => p.id === parseInt(id))
    
    if (index === -1) {
      throw new Error(`Page with ID ${id} not found`)
    }
    
    pages[index] = {
      ...pages[index],
      ...pageData,
      updated_at: new Date().toISOString()
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages))
    return pages[index]
  }

  async deletePage(id) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const pages = this.getPages()
    const filteredPages = pages.filter(p => p.id !== parseInt(id))
    
    if (filteredPages.length === pages.length) {
      throw new Error(`Page with ID ${id} not found`)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPages))
    return { success: true }
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  async getPageStats() {
    await new Promise(resolve => setTimeout(resolve, 300))
    const pages = this.getPages()
    
    return {
      total: pages.length,
      published: pages.filter(p => p.status === 'published').length,
      draft: pages.filter(p => p.status === 'draft').length,
      recent: pages.filter(p => {
        const pageDate = new Date(p.created_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return pageDate > weekAgo
      }).length
    }
  }
}

export const pageService = new PageService()