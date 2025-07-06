import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { toast } from 'react-toastify'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Mock login - in real app, this would call authentication service
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (formData.email === 'admin@ht5play.com' && formData.password === 'admin123') {
        toast.success('Login successful!')
        navigate('/admin')
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-dark via-primary-dark to-surface-dark flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
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
            <h1 className="text-2xl font-bold text-white font-montserrat">
              Welcome Back
            </h1>
            <p className="text-gray-400 mt-2 font-poppins">
              Sign in to access HT5PLAY Admin Panel
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
<Input
              id="email"
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              icon="Mail"
              required
            />

<Input
              id="password"
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              icon="Lock"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm font-poppins">
              Demo credentials: admin@ht5play.com / admin123
            </p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <Link
                to="/"
                className="text-accent hover:text-accent-light transition-colors font-poppins"
              >
                ← Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage