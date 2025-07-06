import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { toast } from 'react-toastify'

const InstallPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    siteTitle: 'HT5PLAY',
    siteDescription: 'Ultimate HTML5 Games Platform',
    siteUrl: '',
    adminEmail: '',
    adminUsername: 'admin',
    adminPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleInstall = async () => {
    if (formData.adminPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.adminPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      // Mock installation process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('HT5PLAY installed successfully!')
      setCurrentStep(4)
    } catch (error) {
      toast.error('Installation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2 font-montserrat">
                Site Information
              </h2>
              <p className="text-gray-400 font-poppins">
                Configure your HT5PLAY gaming platform
              </p>
            </div>

            <Input
              label="Site Title"
              name="siteTitle"
              value={formData.siteTitle}
              onChange={handleChange}
              placeholder="Enter site title"
              required
            />

            <Input
              label="Site Description"
              name="siteDescription"
              value={formData.siteDescription}
              onChange={handleChange}
              placeholder="Enter site description"
              required
            />

            <Input
              label="Site URL"
              name="siteUrl"
              value={formData.siteUrl}
              onChange={handleChange}
              placeholder="https://yoursite.com"
              required
            />

            <Input
              label="Admin Email"
              type="email"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              placeholder="admin@yoursite.com"
              required
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2 font-montserrat">
                Admin Account
              </h2>
              <p className="text-gray-400 font-poppins">
                Create your administrator account
              </p>
            </div>

            <Input
              label="Admin Username"
              name="adminUsername"
              value={formData.adminUsername}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />

            <Input
              label="Admin Password"
              type="password"
              name="adminPassword"
              value={formData.adminPassword}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2 font-montserrat">
                Review & Install
              </h2>
              <p className="text-gray-400 font-poppins">
                Please review your configuration
              </p>
            </div>

            <div className="glass-card p-6 rounded-lg space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Site Title:</span>
                <span className="text-white">{formData.siteTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Site URL:</span>
                <span className="text-white">{formData.siteUrl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Admin Email:</span>
                <span className="text-white">{formData.adminEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Admin Username:</span>
                <span className="text-white">{formData.adminUsername}</span>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Important</span>
              </div>
              <p className="text-yellow-300 text-sm">
                Make sure to delete the install.html file after installation is complete for security reasons.
              </p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-6">
            <motion.div
              className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <ApperIcon name="CheckCircle" className="w-10 h-10 text-green-400" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-2 font-montserrat">
              Installation Complete!
            </h2>
            <p className="text-gray-400 font-poppins">
              HT5PLAY v3.0 has been successfully installed on your server.
            </p>

            <div className="glass-card p-6 rounded-lg text-left">
              <h3 className="text-lg font-bold text-white mb-4 font-montserrat">
                Admin Login Credentials
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Username:</span>
                  <span className="text-white font-mono">{formData.adminUsername}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Password:</span>
                  <span className="text-white font-mono">{formData.adminPassword}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white font-mono">{formData.adminEmail}</span>
                </div>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Shield" className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">Security Notice</span>
              </div>
              <p className="text-red-300 text-sm">
                Please delete the install.html file from your server immediately for security reasons.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                icon="Settings"
                onClick={() => navigate('/admin')}
                className="flex-1"
              >
                Go to Admin Panel
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon="ExternalLink"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Visit Site
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-dark via-primary-dark to-surface-dark flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-card-strong rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Gamepad2" className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white font-montserrat">
              HT5PLAY Installation
            </h1>
            <p className="text-gray-400 mt-2 font-poppins">
              Version 3.0 - HTML5 Games Platform
            </p>
          </div>

          {/* Progress Steps */}
          {currentStep < 4 && (
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep 
                      ? 'bg-accent text-white' 
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-0.5 ${
                      step < currentStep ? 'bg-accent' : 'bg-gray-600'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step Content */}
          {renderStep()}

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleInstall}
                  loading={loading}
                >
                  Install HT5PLAY
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default InstallPage