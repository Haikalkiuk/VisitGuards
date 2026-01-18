# Prompt: VisitGuard - IoT Monitoring System for Agricultural Security

## Role & Context
You are an expert full-stack developer specializing in Next.js 15, TypeScript, and modern web technologies. You need to create a comprehensive IoT monitoring platform called "VisitGuard" for grape leaf detection and agricultural security in partnership with the Depok city government.

## Project Requirements

### 1. **Core Framework & Technology Stack**
- **Framework**: Next.js 15 with App Router (REQUIRED - cannot be changed)
- **Language**: TypeScript 5 (REQUIRED - cannot be changed)
- **Styling**: Tailwind CSS 4 with shadcn/ui component library
- **Database**: Prisma ORM with SQLite client
- **UI Components**: Complete shadcn/ui component set (New York style) with Lucide icons
- **Authentication**: Cookie-based session management with middleware protection
- **State Management**: Zustand for client state, LocalStorage for data synchronization

### 2. **Project Structure & Pages**

#### **Landing Page (/)**
- Hero section with VisitGuard branding and government partnership showcase
- Features section highlighting IoT monitoring, data analytics, and mapping
- Partners section displaying DP3K Depok and Walikota Depok collaboration
- Benefits section with agricultural productivity improvements
- Call-to-action buttons linking to authentication and demo

#### **Authentication Page (/auth)**
- Login and registration forms with validation
- Cookie-based session management
- Redirect functionality after successful login
- Mobile-responsive design
- Error handling and user feedback

#### **IoT Monitor Page (/monitor) - PROTECTED**
- **10 Camera Grid**: Display 10 monitoring points (A-1 through E-2)
- **Live Monitoring**: Simulated camera feeds with status indicators
- **Manual Capture**: Real-time photo capture functionality outside automatic schedule
- **Camera Details**: Modal popup with detailed information for each camera
- **Data Sync**: Automatic synchronization with Data Daun page
- **Status Management**: Active/inactive/maintenance states for each camera

#### **Data Daun Page (/data) - PROTECTED**
- **Comprehensive Analytics**: Tables and charts for leaf development data
- **Data Export**: CSV and Excel download functionality
- **Filtering System**: Date range, location, and status filters
- **Action Buttons**: View details, download reports, bulk operations
- **Data Visualization**: Growth trends and statistical analysis
- **Real-time Updates**: Synchronized with IoT Monitor data

#### **Maps Page (/maps) - PROTECTED**
- **Interactive Leaflet Maps**: Display monitoring locations at STT Terpadu Nurul Fikri
- **Dynamic Markers**: Color-coded based on sensor status (green=active, yellow=warning, red=inactive)
- **Navigation Integration**: Click to zoom and center on specific monitoring points
- **Point Details**: Popup with comprehensive location and sensor information
- **Analytics Link**: Direct navigation to Data Daun with location filtering
- **Real-time Status**: Live updates from monitoring system

### 3. **Authentication & Security**

#### **Middleware Protection**
- File: `middleware.ts`
- Protected routes: `/monitor`, `/data`, `/maps`
- Public routes: `/`, `/auth`
- Cookie-based session validation
- Automatic redirect to `/auth` for unauthenticated access

#### **Client-side Protection**
- Component: `AuthGuard`
- Double-layer security with middleware
- Loading states during authentication check
- Graceful fallbacks for error scenarios

### 4. **Data Management & Synchronization**

#### **Shared Data Structure**
- File: `src/lib/monitoring-data.ts`
- 10 monitoring points with consistent naming (A-1, A-2, B-1, B-2, C-1, C-2, D-1, D-2, E-1, E-2)
- Real-time status updates
- Cross-component data synchronization

#### **Data Sync Utilities**
- File: `src/lib/data-sync.ts`
- LocalStorage integration for persistence
- Real-time updates between IoT Monitor and Data Daun
- Automatic data refresh and conflict resolution

### 5. **UI/UX Design Standards**

#### **Visual Design**
- **Color System**: Primary green (#10b981), secondary blue, warning yellow, danger red
- **Typography**: Consistent hierarchy with proper font weights
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Loading States**: Skeleton screens and spinners for async operations
- **Error Handling**: Clear, actionable error messages with toast notifications

#### **Component Standards**
- Use existing shadcn/ui components instead of custom builds
- Card alignment with consistent padding (p-4 or p-6)
- Sticky footer implementation with proper flex layout
- Custom scrollbar styling for long lists
- Hover effects and micro-interactions

### 6. **Technical Implementation Details**

#### **File Structure**
```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/page.tsx         # Authentication
│   ├── monitor/page.tsx      # IoT monitoring (protected)
│   ├── data/page.tsx         # Data analytics (protected)
│   ├── maps/page.tsx         # Interactive maps (protected)
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── layout/               # Header, footer, navigation
│   ├── auth/                 # Authentication components
│   ├── ui/                   # shadcn/ui components
│   ├── charts/               # Data visualization
│   └── data/                 # Data management components
├── lib/
│   ├── db.ts                 # Database client
│   ├── data-sync.ts          # Data synchronization
│   ├── monitoring-data.ts    # Shared data structure
│   └── utils.ts              # Utility functions
└── types/
    └── index.ts              # TypeScript definitions
```

#### **Key Features Implementation**

**Manual Camera Capture:**
- Real-time photo capture functionality
- Outside automatic schedule (every hour during daytime)
- Event-driven capture for important occurrences
- Image storage and metadata management

**Data Export Functionality:**
- Single and bulk download options
- CSV and Excel format support
- Filtered data export
- Progress indicators for large datasets

**Map Integration:**
- Leaflet.js with CDN loading (not npm packages)
- Dynamic marker colors based on sensor status
- Click-to-navigate functionality
- Real-time position updates

### 7. **Development Guidelines**

#### **Error Handling**
- Try-catch blocks for all async operations
- Graceful degradation for failed components
- User-friendly error messages
- Console logging for debugging

#### **Performance Optimization**
- Lazy loading for heavy components
- Image optimization with Next.js Image component
- Efficient state management with Zustand
- Minimal re-renders with proper memoization

#### **Mobile Responsiveness**
- Touch-friendly targets (minimum 44px)
- Proper viewport configuration
- Responsive navigation with mobile menu
- Optimized layouts for small screens

### 8. **Success Criteria**

#### **Functional Requirements**
- ✅ All pages load without errors
- ✅ Authentication system works correctly
- ✅ Protected routes require login
- ✅ Data synchronization between pages
- ✅ Export functionality works
- ✅ Maps display correctly with interactive features
- ✅ Mobile responsive design

#### **Performance Requirements**
- Page load time < 3 seconds
- Smooth transitions and animations
- No console errors
- Proper error boundaries

#### **User Experience Requirements**
- Intuitive navigation
- Clear visual feedback
- Consistent design language
- Accessible interface

### 9. **Development Commands**

```bash
# Start development server
bun run dev

# Run linting
bun run lint

# Database operations
bun run db:push
bun run db:generate
```

### 10. **Important Notes**

- **Port Configuration**: Use port 3005 to avoid conflicts
- **Authentication**: Double-layer protection (middleware + AuthGuard)
- **Data Consistency**: Ensure camera names match across all pages
- **Error Prevention**: Handle all edge cases gracefully
- **Testing**: Verify all functionality before deployment

## Expected Outcome
A fully functional, production-ready IoT monitoring platform that serves agricultural security needs in Depok city, with comprehensive data management, real-time monitoring, and intuitive user interface.

## Development Priority
1. Set up basic project structure and authentication
2. Implement landing page and navigation
3. Create IoT monitoring dashboard
4. Build data analytics with export functionality
5. Integrate interactive maps
6. Add data synchronization
7. Implement responsive design
8. Test and optimize performance

This prompt ensures all aspects of the VisitGuard platform are covered with specific technical requirements, implementation details, and success criteria.