import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Footer = () => {
  const footerColumns = [
    {
      title: "About Us",
      content: "HT5PLAY is your ultimate destination for free HTML5 games. Play hundreds of games directly in your browser without downloads."
    },
    {
      title: "Everything is FREE",
      content: "All our games are completely free to play. No subscriptions, no hidden fees, just pure gaming fun for everyone."
    },
    {
      title: "Enjoy Fun",
      content: "Discover new games daily, challenge yourself with puzzles, compete in action games, and have endless fun."
    }
  ]

  const footerLinks = [
    { label: "Privacy Policy", path: "/page/privacy" },
    { label: "Terms of Service", path: "/page/terms" },
    { label: "Contact Us", path: "/page/contact" },
    { label: "About", path: "/page/about" }
  ]

  return (
    <footer className="bg-primary-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {footerColumns.map((column, index) => (
            <div key={index} className="glass-card p-6 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-4 font-montserrat">
                {column.title}
              </h3>
              <p className="text-gray-300 font-poppins leading-relaxed">
                {column.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-gray-400 hover:text-accent transition-colors font-poppins"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <ApperIcon name="Gamepad2" className="w-5 h-5 text-accent" />
              <span className="text-white font-medium font-montserrat">
                HT5PLAY v3.0
              </span>
            </div>
            
            <div className="text-center text-gray-400 font-poppins">
              <p>
                Developed by <span className="text-accent font-medium">Muhammad Ali</span>
              </p>
              <p className="text-sm mt-1">
                Contact: <a href="tel:+971569248419" className="text-accent hover:underline">+971569248419</a>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="mailto:support@airamtechhub.com"
                className="text-gray-400 hover:text-accent transition-colors"
              >
                <ApperIcon name="Mail" className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-accent transition-colors"
              >
                <ApperIcon name="Github" className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer