# VisitGuard - IoT Monitoring System

Platform IoT monitoring untuk pemantauan perkembangan daun anggur secara otomatis dalam mendukung ketahanan pangan Kota Depok.

## 🌟 Fitur Utama

### 🔐 Autentikasi & Keamanan
- Login dan Register user
- Middleware proteksi halaman
- Session management

### 📸 IoT Monitor
- Galeri foto hasil tangkapan kamera sensor
- Grid dan List view
- Filter berdasarkan status dan lokasi
- Detail view dengan confidence score

### 📊 Data Analytics
- Grafik perkembangan (Harian, Bulanan, Tahunan) dengan Recharts
- Tabel data terstruktur
- Statistik real-time
- Import/Export CSV dan Excel

### 🗺️ Peta Monitoring
- Integrasi Leaflet.js
- Titik lokasi pemantauan di STT Terpadu Nurul Fikri
- Status sensor real-time
- Detail informasi tiap lokasi

## 🛠️ Teknologi

- **Framework**: Next.js 15 dengan App Router
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Maps**: Leaflet.js & React-Leaflet
- **Icons**: Lucide React
- **Export/Import**: XLSX, PapaParse
- **Language**: TypeScript

## 📁 Struktur Proyek

```
src/
├── app/
│   ├── api/                 # API Routes
│   │   └── data/
│   │       ├── export/      # Export CSV/Excel
│   │       └── import/      # Import data
│   ├── auth/               # Halaman Autentikasi
│   ├── data/               # Halaman Data Daun
│   ├── maps/               # Halaman Peta
│   ├── monitor/            # Halaman IoT Monitor
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Halaman Home
├── components/
│   ├── data/               # Komponen import/export
│   ├── layout/             # Layout components
│   │   ├── footer.tsx
│   │   ├── logo.tsx
│   │   ├── navbar.tsx
│   │   └── index.tsx
│   └── ui/                 # shadcn/ui components
├── lib/
│   └── utils.ts            # Utility functions
├── styles/
│   └── leaflet.css         # Leaflet styles
└── types/
    └── index.ts            # TypeScript types
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Bun atau npm

### Installation

1. Clone repository
```bash
git clone <repository-url>
cd visitguard
```

2. Install dependencies
```bash
bun install
```

3. Run development server
```bash
bun run dev
```

4. Buka [http://localhost:3000](http://localhost:3000)

## 📱 Halaman

### 1. Home (/)
Landing page profesional dengan:
- Branding VisitGuard
- Informasi kerjasama dengan Pemerintah Kota Depok
- Fitur unggulan
- Call-to-action

### 2. Autentikasi (/auth)
- Login dan Register form
- Responsive design
- Validasi form

### 3. IoT Monitor (/monitor) - *Protected*
- Gallery foto monitoring
- Grid/List view toggle
- Filter dan search
- Detail modal

### 4. Data Daun (/data) - *Protected*
- Grafik dengan Recharts (Line, Bar, Pie)
- Tabel data dengan filter
- Import/Export CSV/Excel
- Statistik cards

### 5. Peta (/maps) - *Protected*
- Peta interaktif dengan Leaflet
- Marker lokasi monitoring
- Detail informasi titik
- Real-time status

## 🔧 Konfigurasi

### Environment Variables
Buat file `.env.local`:
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Middleware
Halaman `/monitor`, `/data`, dan `/maps` dilindungi oleh middleware yang memerlukan autentikasi.

## 📊 API Endpoints

### Export Data
- `GET /api/data/export?format=csv` - Export CSV
- `GET /api/data/export?format=excel` - Export Excel

### Import Data
- `POST /api/data/import` - Import CSV/Excel files

## 🎨 Branding

### Logo
Logo VisitGuard menggunakan gambar dari file yang diupload:
- Lokasi: `/public/images/visitguard-logo.png`
- Desain: Perisai, daun anggur, dan lensa kamera

### Mitra
- DP3K Kota Depok
- Walikota Depok

### Kontak
- Email: Haikal Kautsar
- Alamat: STT Terpadu Nurul Fikri
- Social Media: Instagram, LinkedIn, Facebook, Twitter

## 🌐 Fitur Responsive

- Mobile-first design
- Breakpoints: sm, md, lg, xl
- Touch-friendly interactions
- Optimized untuk semua device

## 🔒 Keamanan

- Session-based authentication
- Protected routes
- Input validation
- XSS protection
- CSRF protection

## 📈 Performance

- Next.js 15 App Router
- Dynamic imports untuk maps
- Optimized images
- Lazy loading components
- Efficient re-renders

## 🤝 Kontribusi

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

Haikal Kautsar
- Email: haikal.kautsar@example.com
- Instagram: @kiuk2002
- LinkedIn: Haikal Kautsar Kiuk

---

© 2024 VisitGuard. Developed with ❤️ for STT Terpadu Nurul Fikri