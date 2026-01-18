import { Layout } from '@/components/layout'
import { Camera, Leaf, Shield, BarChart3, Map, Users, ArrowRight, CheckCircle, TrendingUp, Clock, Wifi } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const features = [
    {
      icon: Camera,
      title: 'IoT Monitoring',
      description: 'Pemantauan otomatis menggunakan kamera sensor berkualitas tinggi untuk tracking perkembangan daun anggur secara real-time.',
      color: 'bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white'
    },
    {
      icon: BarChart3,
      title: 'Analisis Data',
      description: 'Grafik komprehensif dan tabel data terstruktur untuk menganalisis perkembangan tanaman per hari, bulan, dan tahun.',
      color: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
    },
    {
      icon: Map,
      title: 'Pemetaan Lokasi',
      description: 'Integrasi dengan Leaflet.js untuk menampilkan lokasi titik pemantauan di STT Terpadu Nurul Fikri.',
      color: 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'
    },
    {
      icon: Shield,
      title: 'Keamanan Data',
      description: 'Sistem keamanan berlapis dengan autentikasi user dan enkripsi data untuk melindungi informasi pertanian.',
      color: 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white'
    }
  ]

  const benefits = [
    'Meningkatkan produktivitas pertanian anggur',
    'Deteksi dini penyakit dan hama tanaman',
    'Pengambilan keputusan berbasis data',
    'Mengurangi biaya operasional monitoring',
    'Mendukung ketahanan pangan kota',
    'Kolaborasi dengan pemerintah Depok'
  ]

  const partners = [
    {
      name: 'DP3K Kota Depok',
      description: 'Dinas Pertanian, Perikanan, dan Ketahanan Pangan',
      icon: '🏛️'
    },
    {
      name: 'Walikota Depok',
      description: 'Pemerintah Kota Depok',
      icon: '🏢'
    }
  ]

  const stats = [
    { number: '24/7', label: 'Monitoring Real-time', icon: Clock },
    { number: '99.9%', label: 'Akurasi Deteksi', icon: TrendingUp },
    { number: '50+', label: 'Titik Pemantauan', icon: Wifi },
    { number: '100%', label: 'Support Lokal', icon: Users }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/30"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-green-100 border border-white/20">
                  <Shield className="w-4 h-4 mr-2" />
                  Platform Terpercaya Pemerintah Depok
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  VisitGuard: Solusi IoT untuk
                  <span className="text-green-300 block"> Ketahanan Pangan</span>
                </h1>
                <p className="text-xl text-green-100 leading-relaxed max-w-2xl">
                  Platform monitoring terpercaya untuk pemantauan perkembangan daun anggur secara otomatis. 
                  Bergandengan tangan dengan Pemerintah Kota Depok dalam mendukung pertanian modern.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/monitor"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  Lihat Demo
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <stat.icon className="w-8 h-8 mx-auto mb-2 text-green-300" />
                      <div className="text-3xl font-bold text-green-300">{stat.number}</div>
                      <div className="text-sm text-green-100">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Didukung oleh Mitra Terpercaya
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Kerjasama strategis dengan pemerintah daerah untuk mewujudkan ketahanan pangan Kota Depok
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{partner.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">{partner.name}</h3>
                    <p className="text-gray-600">{partner.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan VisitGuard
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Teknologi terkini untuk monitoring pertanian yang lebih efisien dan akurat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gray-50 rounded-xl p-8 h-full hover:bg-green-50 hover:border-green-200 border-2 border-transparent transition-all duration-300 group-hover:shadow-lg">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 ${feature.color}`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                Mengapa Memilih VisitGuard?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link
                  href="/data"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Lihat Data Analisis
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
                    <Leaf className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Monitoring Tanaman</h4>
                    <p className="text-sm text-gray-600">Real-time leaf detection</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <BarChart3 className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Analitik Canggih</h4>
                    <p className="text-sm text-gray-600">Data-driven insights</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <Users className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Kolaborasi</h4>
                    <p className="text-sm text-gray-600">Government partnership</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-blue-700"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Siap Meningkatkan Produktivitas Pertanian Anda?
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Bergabunglah dengan VisitGuard dan rasakan kemudahan monitoring pertanian modern 
            yang didukung oleh teknologi IoT dan kerjasama dengan Pemerintah Kota Depok.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <Users className="w-5 h-5" />
              Daftar Sekarang
            </Link>
            <Link
              href="/maps"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <Map className="w-5 h-5" />
              Lihat Lokasi
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}