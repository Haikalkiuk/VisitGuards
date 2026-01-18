import { Mail, MapPin, Instagram, Linkedin, Facebook, Twitter } from 'lucide-react'
import { VisitGuardLogo } from './logo'

export function Footer() {
  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/kiuk2002', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/in/haikal-kautsar-kiuk', label: 'LinkedIn' },
    { icon: Facebook, href: 'https://facebook.com/haikal-kautsar-kiuk', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/haikalkautsar', label: 'Twitter/X' },
  ]

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <VisitGuardLogo size="lg" showText={true} className="text-white" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Platform IoT monitoring untuk pemantauan perkembangan daun anggur secara otomatis 
              dalam mendukung ketahanan pangan Kota Depok.
            </p>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Kontak</h3>
            <div className="space-y-3">
              <a 
                href="mailto:haikal.kautsar@example.com"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5 text-green-500" />
                <span className="text-sm">Haikal Kautsar</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">
                  STT Terpadu Nurul Fikri<br />
                  Kota Depok, Jawa Barat
                </span>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Ikuti Kami</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-green-600 text-white p-3 rounded-lg transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Mitra Kami</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
                  D
                </div>
                <span className="text-sm">DP3K Kota Depok</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-sm">
                  W
                </div>
                <span className="text-sm">Walikota Depok</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} VisitGuard. All rights reserved. 
            Developed with ❤️ for STT Terpadu Nurul Fikri
          </p>
        </div>
      </div>
    </footer>
  )
}