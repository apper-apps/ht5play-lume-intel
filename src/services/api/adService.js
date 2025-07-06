// Ad Service - Mock implementation with localStorage
const STORAGE_KEY = 'ht5play_ads'

// Mock ad data
const mockAds = [
  {
    id: 1,
    slot: 'header',
    name: 'Header Banner',
    code: '<!-- AdSense Header Banner -->\n<ins class="adsbygoogle"\n     style="display:block"\n     data-ad-client="ca-pub-1234567890"\n     data-ad-slot="1234567890"\n     data-ad-format="auto"></ins>\n<script>\n(adsbygoogle = window.adsbygoogle || []).push({});\n</script>',
    active: true,
    position: 'header',
    type: 'banner',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    slot: 'sidebar',
    name: 'Sidebar Ad',
    code: '<!-- AdSense Sidebar -->\n<ins class="adsbygoogle"\n     style="display:block"\n     data-ad-client="ca-pub-1234567890"\n     data-ad-slot="0987654321"\n     data-ad-format="auto"></ins>\n<script>\n(adsbygoogle = window.adsbygoogle || []).push({});\n</script>',
    active: true,
    position: 'sidebar',
    type: 'banner',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    slot: 'footer',
    name: 'Footer Banner',
    code: '<!-- AdSense Footer Banner -->\n<ins class="adsbygoogle"\n     style="display:block"\n     data-ad-client="ca-pub-1234567890"\n     data-ad-slot="5678901234"\n     data-ad-format="auto"></ins>\n<script>\n(adsbygoogle = window.adsbygoogle || []).push({});\n</script>',
    active: false,
    position: 'footer',
    type: 'banner',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

class AdService {
  constructor() {
    this.initializeStorage()
  }

  initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAds))
    }
  }

  getAds() {
    try {
      const ads = localStorage.getItem(STORAGE_KEY)
      return ads ? JSON.parse(ads) : []
    } catch (error) {
      console.error('Error loading ads:', error)
      return mockAds
    }
  }

  async getAllAds() {
    await new Promise(resolve => setTimeout(resolve, 400))
    return this.getAds()
  }

  async getActiveAds() {
    await new Promise(resolve => setTimeout(resolve, 400))
    const ads = this.getAds()
    return ads.filter(ad => ad.active)
  }

  async getAdById(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const ads = this.getAds()
    const ad = ads.find(a => a.id === parseInt(id))
    
    if (!ad) {
      throw new Error(`Ad with ID ${id} not found`)
    }
    
    return ad
  }

  async getAdBySlot(slot) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const ads = this.getAds()
    return ads.find(a => a.slot === slot)
  }

  async getAdsByPosition(position) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const ads = this.getAds()
    return ads.filter(a => a.position === position && a.active)
  }

  async createAd(adData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const ads = this.getAds()
    const newAd = {
      id: Math.max(...ads.map(a => a.id)) + 1,
      ...adData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    ads.push(newAd)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ads))
    return newAd
  }

  async updateAd(id, adData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const ads = this.getAds()
    const index = ads.findIndex(a => a.id === parseInt(id))
    
    if (index === -1) {
      throw new Error(`Ad with ID ${id} not found`)
    }
    
    ads[index] = {
      ...ads[index],
      ...adData,
      updated_at: new Date().toISOString()
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ads))
    return ads[index]
  }

  async updateAdBySlot(slot, adData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const ads = this.getAds()
    const index = ads.findIndex(a => a.slot === slot)
    
    if (index === -1) {
      // Create new ad if slot doesn't exist
      const newAd = {
        id: Math.max(...ads.map(a => a.id)) + 1,
        slot: slot,
        ...adData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      ads.push(newAd)
    } else {
      ads[index] = {
        ...ads[index],
        ...adData,
        updated_at: new Date().toISOString()
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ads))
    return ads[index === -1 ? ads.length - 1 : index]
  }

  async deleteAd(id) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const ads = this.getAds()
    const filteredAds = ads.filter(a => a.id !== parseInt(id))
    
    if (filteredAds.length === ads.length) {
      throw new Error(`Ad with ID ${id} not found`)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredAds))
    return { success: true }
  }

  async toggleActive(id) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const ads = this.getAds()
    const index = ads.findIndex(a => a.id === parseInt(id))
    
    if (index === -1) {
      throw new Error(`Ad with ID ${id} not found`)
    }
    
    ads[index].active = !ads[index].active
    ads[index].updated_at = new Date().toISOString()
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ads))
    return ads[index]
  }

  async getAdStats() {
    await new Promise(resolve => setTimeout(resolve, 300))
    const ads = this.getAds()
    
    return {
      total: ads.length,
      active: ads.filter(a => a.active).length,
      inactive: ads.filter(a => !a.active).length,
      byPosition: ads.reduce((acc, ad) => {
        acc[ad.position] = (acc[ad.position] || 0) + 1
        return acc
      }, {}),
      byType: ads.reduce((acc, ad) => {
        acc[ad.type] = (acc[ad.type] || 0) + 1
        return acc
      }, {})
    }
  }

  generateAdsTxt(publisherId) {
    return `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n# This ads.txt file was generated by HT5Play Admin Panel\n# Last updated: ${new Date().toISOString()}`
  }
}

export const adService = new AdService()