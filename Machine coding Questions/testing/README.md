# Placement Journey - YouTube Channel Website

A modern, responsive 4-page React website for the "Placement Journey" YouTube channel with comprehensive placement preparation resources.

## 🌟 Features

### Pages
- **Home**: Hero section with CTA, statistics, and recent video thumbnails
- **Lectures**: Searchable grid of video lectures with category filters (DSA, OS, DBMS, System Design)
- **Notes**: Searchable library with PDF resources and category-based filtering
- **About/Contact**: Creator's journey story and contact form

### UI/UX Features
- **Dark Mode Toggle**: Beautiful dark/light theme with persistent storage
- **Glassmorphism Design**: Modern frosted glass effect on navbar with blur and transparency
- **Responsive Layout**: Mobile-first design that works seamlessly on all devices
- **Smooth Animations**: Framer Motion animations for enhanced interactivity
- **Premium Aesthetics**: Indigo/purple gradient color scheme with modern rounded corners
- **Search & Filter**: Real-time search and multi-category filtering

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Hooks

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Fixed navbar with glassmorphism & mobile menu
│   ├── Footer.tsx          # Responsive footer with links
│   ├── LectureCard.tsx     # Video card component
│   ├── NoteCard.tsx        # Study notes card component
│   └── index.ts
├── pages/
│   ├── Home.tsx            # Hero, stats, recent lectures
│   ├── Lectures.tsx        # Filterable lecture grid
│   ├── Notes.tsx           # Searchable notes library
│   ├── About.tsx           # Creator story and contact form
│   └── index.ts
├── data/
│   ├── lectures.ts         # Sample lecture data
│   └── notes.ts            # Sample notes data
├── types/
│   └── index.ts            # TypeScript interfaces
├── App.tsx                 # Main app with routing
├── main.tsx                # Entry point
└── index.css               # Tailwind & custom styles
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Dev server: `http://localhost:5173/`

## 🎨 Design Features

- **Indigo/Purple Gradients**: Modern color scheme throughout
- **Glassmorphism Navbar**: Fixed navbar with blur and transparency effects
- **Smooth Animations**: Framer Motion transitions on cards and navigation
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Mobile Responsive**: Optimized for all screen sizes

## ✨ Components

### Navbar
- Fixed positioning with glassmorphism
- Mobile hamburger menu
- Dark mode toggle
- Smooth animations

### LectureCard
- YouTube thumbnail preview
- "New" badge for recent videos
- Play button overlay
- Category tags

### NoteCard  
- Download button
- Page count display
- Category badges

### Search & Filter
- Real-time search
- Multi-select categories
- No results fallback

## 🌙 Dark Mode

- Toggle between dark and light themes
- Preference saved in localStorage
- Class-based implementation
- Smooth transitions

## 📊 Included Demo Data

- 6 sample lectures (DSA, OS, DBMS, System Design)
- 8 sample notes (DSA, C++, Java, OS, DBMS, SQL, Python, System Design)
- Statistics and social proof elements

## 🔧 Configuration

- `tailwind.config.js` - Custom colors and utilities
- `postcss.config.js` - PostCSS plugins
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript settings

## 📝 Customization

1. **Update Data**: Edit `src/data/` files
2. **Change Colors**: Modify `tailwind.config.js`
3. **Add Pages**: Create in `src/pages/` and add route in `App.tsx`
4. **Update Navigation**: Edit `src/components/Navbar.tsx`

## 🎯 Ready for Backend Integration

- PDF note downloads
- User authentication
- Comments/discussions
- Progress tracking
- Analytics dashboard

---

**Made with ❤️ for aspiring engineers
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
