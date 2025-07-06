import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { adService } from '@/services/api/adService'
import { toast } from 'react-toastify'

const AdminAds = () => {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('code')
  const [formData, setFormData] = useState({
    head_code: '',
    body_start: '',
    body_end: '',
    banner_728x90: '',
    banner_300x250: '',
    banner_160x600: '',
    ads_txt: ''
  })

  useEffect(() => {
    loadAds()
  }, [])

  const loadAds = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adService.getAll()
      
      // Convert array to object for easier form handling
      const adsObj = {}
      data.forEach(ad => {
        adsObj[ad.slot] = ad.code
      })
      
      setAds(data)
      setFormData(prev => ({ ...prev, ...adsObj }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (slot) => {
    try {
      const code = formData[slot]
      
      // Check if ad exists
      const existingAd = ads.find(ad => ad.slot === slot)
      
      if (existingAd) {
        await adService.update(existingAd.id, { code })
        setAds(prev => prev.map(ad => 
          ad.slot === slot ? { ...ad, code } : ad
        ))
      } else {
        const newAd = await adService.create({ slot, code, type: 'code' })
        setAds(prev => [...prev, newAd])
      }
      
      toast.success(`${slot} code saved successfully`)
    } catch (err) {
      toast.error('Failed to save ad code')
    }
  }

  const handleGenerateAdsTxt = async () => {
    try {
      const publisherId = formData.ads_txt
      if (!publisherId) {
        toast.error('Please enter your publisher ID')
        return
      }

      // Mock ads.txt generation
      const adsTxtContent = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`
      
      // In real app, this would save to server root
      toast.success('ads.txt generated successfully')
      console.log('ads.txt content:', adsTxtContent)
    } catch (err) {
      toast.error('Failed to generate ads.txt')
    }
  }

  const tabs = [
    { id: 'code', label: 'Code Injection', icon: 'Code' },
    { id: 'banners', label: 'Banner Ads', icon: 'Image' },
    { id: 'ads-txt', label: 'ads.txt Generator', icon: 'FileText' }
  ]

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadAds} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-montserrat">
          Ads & Code Manager
        </h1>
        <p className="text-gray-400 font-poppins">
          Manage your advertising codes and banner placements
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-surface-light p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-accent text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <ApperIcon name={tab.icon} className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'code' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Head Code */}
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white font-montserrat">
                  Head Code
                </h3>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSave('head_code')}
                >
                  Save
                </Button>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Code that will be inserted in the &lt;head&gt; section of all pages
              </p>
              <textarea
                value={formData.head_code}
                onChange={(e) => setFormData(prev => ({ ...prev, head_code: e.target.value }))}
                placeholder="Enter your head code here (analytics, meta tags, etc.)"
                rows={6}
                className="form-input w-full px-3 py-2 rounded-lg resize-none font-mono text-sm"
              />
            </div>

            {/* Body Start Code */}
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white font-montserrat">
                  Body Start Code
                </h3>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSave('body_start')}
                >
                  Save
                </Button>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Code that will be inserted at the beginning of the &lt;body&gt; section
              </p>
              <textarea
                value={formData.body_start}
                onChange={(e) => setFormData(prev => ({ ...prev, body_start: e.target.value }))}
                placeholder="Enter your body start code here"
                rows={6}
                className="form-input w-full px-3 py-2 rounded-lg resize-none font-mono text-sm"
              />
            </div>

            {/* Body End Code */}
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white font-montserrat">
                  Body End Code
                </h3>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSave('body_end')}
                >
                  Save
                </Button>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Code that will be inserted at the end of the &lt;body&gt; section
              </p>
              <textarea
                value={formData.body_end}
                onChange={(e) => setFormData(prev => ({ ...prev, body_end: e.target.value }))}
                placeholder="Enter your body end code here"
                rows={6}
                className="form-input w-full px-3 py-2 rounded-lg resize-none font-mono text-sm"
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'banners' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 728x90 Banner */}
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white font-montserrat">
                  728x90 Banner (Leaderboard)
                </h3>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSave('banner_728x90')}
                >
                  Save
                </Button>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Banner ad code for 728x90 placements
              </p>
              <textarea
                value={formData.banner_728x90}
                onChange={(e) => setFormData(prev => ({ ...prev, banner_728x90: e.target.value }))}
                placeholder="Enter your 728x90 banner ad code here"
                rows={6}
                className="form-input w-full px-3 py-2 rounded-lg resize-none font-mono text-sm"
              />
            </div>

            {/* 300x250 Banner */}
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white font-montserrat">
                  300x250 Banner (Medium Rectangle)
                </h3>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSave('banner_300x250')}
                >
                  Save
                </Button>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Banner ad code for 300x250 placements
              </p>
              <textarea
                value={formData.banner_300x250}
                onChange={(e) => setFormData(prev => ({ ...prev, banner_300x250: e.target.value }))}
                placeholder="Enter your 300x250 banner ad code here"
                rows={6}
                className="form-input w-full px-3 py-2 rounded-lg resize-none font-mono text-sm"
              />
            </div>

            {/* 160x600 Banner */}
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white font-montserrat">
                  160x600 Banner (Wide Skyscraper)
                </h3>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSave('banner_160x600')}
                >
                  Save
                </Button>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Banner ad code for 160x600 placements
              </p>
              <textarea
                value={formData.banner_160x600}
                onChange={(e) => setFormData(prev => ({ ...prev, banner_160x600: e.target.value }))}
                placeholder="Enter your 160x600 banner ad code here"
                rows={6}
                className="form-input w-full px-3 py-2 rounded-lg resize-none font-mono text-sm"
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'ads-txt' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="FileText" className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white font-montserrat">
                  ads.txt Generator
                </h3>
              </div>
              
              <p className="text-gray-400 mb-6">
                Generate an ads.txt file for your domain to authorize ad sellers and prevent ad fraud.
              </p>

              <div className="space-y-4">
                <Input
                  label="Publisher ID"
                  value={formData.ads_txt}
                  onChange={(e) => setFormData(prev => ({ ...prev, ads_txt: e.target.value }))}
                  placeholder="pub-1234567890123456"
                />

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">Important</span>
                  </div>
                  <p className="text-yellow-300 text-sm">
                    The ads.txt file will be generated and saved to your domain root. 
                    Make sure your web server allows access to this file.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  icon="FileText"
                  onClick={handleGenerateAdsTxt}
                  className="w-full"
                >
                  Generate ads.txt
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminAds