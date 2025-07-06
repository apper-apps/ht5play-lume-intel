import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { toast } from 'react-toastify'

export default function AdminSettings() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [settings, setSettings] = useState({
    siteName: 'HT5Play',
    siteDescription: 'Free HTML5 Games Platform',
    siteKeywords: 'games, html5, free, online',
    analyticsCode: '',
    adsensePublisherId: '',
    socialFacebook: '',
    socialTwitter: '',
    socialInstagram: '',
    maintenanceMode: false,
    allowRegistration: true,
    gamesPerPage: 24,
    maxFileSize: 10
  })

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      setLoading(true)
      setError(null)
      
      // Load settings from localStorage (replace with API call)
      const savedSettings = localStorage.getItem('adminSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (err) {
      setError('Failed to load settings')
      console.error('Settings load error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Save settings to localStorage (replace with API call)
      localStorage.setItem('adminSettings', JSON.stringify(settings))
      
      toast.success('Settings saved successfully!')
    } catch (err) {
      toast.error('Failed to save settings')
      console.error('Settings save error:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(field, value) {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} />

  const settingSections = [
    {
      title: 'General Settings',
      icon: 'Settings',
      fields: [
        { key: 'siteName', label: 'Site Name', type: 'text' },
        { key: 'siteDescription', label: 'Site Description', type: 'textarea' },
        { key: 'siteKeywords', label: 'SEO Keywords', type: 'text' },
        { key: 'gamesPerPage', label: 'Games Per Page', type: 'number' },
        { key: 'maxFileSize', label: 'Max File Size (MB)', type: 'number' }
      ]
    },
    {
      title: 'Analytics & Ads',
      icon: 'BarChart',
      fields: [
        { key: 'analyticsCode', label: 'Google Analytics Code', type: 'text' },
        { key: 'adsensePublisherId', label: 'AdSense Publisher ID', type: 'text' }
      ]
    },
    {
      title: 'Social Media',
      icon: 'Share2',
      fields: [
        { key: 'socialFacebook', label: 'Facebook URL', type: 'text' },
        { key: 'socialTwitter', label: 'Twitter URL', type: 'text' },
        { key: 'socialInstagram', label: 'Instagram URL', type: 'text' }
      ]
    },
    {
      title: 'System Settings',
      icon: 'Cog',
      fields: [
        { key: 'maintenanceMode', label: 'Maintenance Mode', type: 'checkbox' },
        { key: 'allowRegistration', label: 'Allow Registration', type: 'checkbox' }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Manage your site configuration</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary"
        >
          <ApperIcon name="Save" size={20} />
          Save Settings
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {settingSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <ApperIcon name={section.icon} size={24} className="text-accent" />
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {field.label}
                  </label>
                  
                  {field.type === 'checkbox' ? (
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings[field.key]}
                        onChange={(e) => handleInputChange(field.key, e.target.checked)}
                        className="w-4 h-4 text-accent bg-gray-700 border-gray-600 rounded focus:ring-accent"
                      />
                      <span className="text-gray-300">Enable {field.label}</span>
                    </label>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={settings[field.key]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  ) : (
                    <Input
                      type={field.type}
                      value={settings[field.key]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="w-full"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </form>
    </div>
  )
}