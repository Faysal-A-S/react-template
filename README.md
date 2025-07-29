# React TypeScript Starter Template

A modern, production-ready React TypeScript starter template with a comprehensive set of tools and best practices.

## 🚀 Features

- **⚡ Vite** - Fast build tool and development server
- **⚛️ React 19** - Latest React with concurrent features
- **📘 TypeScript** - Type safety and better developer experience
- **🎨 Tailwind CSS v4** - Utility-first CSS framework
- **🧭 TanStack Router** - Type-safe routing with file-based routing
- **🔄 TanStack Query** - Powerful data synchronization with queryOptions pattern and Suspense support
- **📋 React Hook Form** - Performant forms with easy validation
- **🎯 Valibot** - Schema validation libraries
- **🔧 Jotai** - Primitive and flexible state management
- **🌙 Next Themes** - Perfect dark mode support
- **🎪 Sonner** - Beautiful toast notifications
- **🎨 Radix UI** - Low-level UI primitives
- **🔍 Lucide React** - Beautiful & consistent icon library
- **🧹 ESLint** - Code linting with React Query rules
- **💅 Prettier** - Code formatting with tab support
- **🔧 TypeScript** - Strict type checking

## 🛠️ Setup

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Use this template**
   ```bash
   # Using GitHub CLI
   gh repo create my-react-app --template JB-Connect-Ltd/react-starter

   # Or clone the repository
   git clone https://github.com/JB-Connect-Ltd/react-starter.git my-react-app
   cd my-react-app
   ```

2. **Install dependencies**
   ```bash
   # npm (installs latest versions)
   npm install

   # or yarn
   yarn install

   # or pnpm
   pnpm install

   # or bun
   bun install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── assets/          # Static assets (images, icons, etc.)
├── routes/          # File-based routing (TanStack Router)
│   ├── __root.tsx   # Root layout component
│   └── index.tsx    # Home page
├── main.tsx         # Application entry point
├── index.css        # Global styles
├── routeTree.gen.ts # Generated route tree (auto-generated)
└── vite-env.d.ts    # Vite type definitions

config files/
├── eslint.config.js    # ESLint configuration
├── prettier.config.js  # Prettier configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies and scripts
```

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run preview      # Preview production build

# Building
npm run build        # Build for production
npm run type-check   # Type checking without emitting

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Utilities
npm run clean        # Clean build artifacts and cache
```

## 🔧 Configuration

### TanStack Query Setup

React Query is pre-configured in `src/main.tsx` with sensible defaults:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes
    },
  },
});
```

#### Query Options Pattern Benefits

This template encourages using `queryOptions` for:
- **Type Safety** - Full TypeScript support with inferred types
- **Reusability** - Share query configurations across components
- **Consistency** - Standardized query definitions
- **Testing** - Easier to mock and test individual queries
- **Prefetching** - Simple integration with router prefetching
- **Suspense Ready** - Works seamlessly with `useSuspenseQuery`

### ESLint Configuration

ESLint is configured with:
- React best practices
- TypeScript rules
- React Query specific rules
- React Hooks rules

### Prettier Configuration

Prettier is configured with:
- Tab indentation (width: 4)
- Single quotes
- Trailing commas
- Semi-colons

### Tailwind CSS

Tailwind CSS v4 is configured with:
- Dark mode support
- Custom animations
- Radix UI integration

## 🏗️ Building Your App

### Adding New Routes

Create new files in the `src/routes/` directory:

```tsx
// src/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return <div>About page</div>
}
```

### Using TanStack Query

#### Query Options Pattern (Recommended)

Use `queryOptions` to define reusable query configurations:

```tsx
// src/api/users.api.ts
import { queryOptions } from '@tanstack/react-query'

// Define query options for better reusability and type safety
export function getUserOptions(userId: string) {
  return queryOptions({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch user')
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function getUsersOptions(filters: UserFilters = {}) {
  return queryOptions({
    queryKey: ['users', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters)
      const response = await fetch(`/api/users?${params}`)
      if (!response.ok) throw new Error('Failed to fetch users')
      return response.json()
    },
  })
}
```

#### Using with Regular Query

```tsx
import { useQuery } from '@tanstack/react-query'
import { getUserOptions } from '../api/users.api'

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery(getUserOptions(userId))

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>Welcome, {data.name}!</div>
}
```

#### Using with Suspense Query

```tsx
import { useSuspenseQuery } from '@tanstack/react-query'
import { getUserOptions } from '../api/users.api'

function UserProfile({ userId }: { userId: string }) {
  // No loading state needed - Suspense boundary handles it
  const { data } = useSuspenseQuery(getUserOptions(userId))
  
  return <div>Welcome, {data.name}!</div>
}

// Wrap with Suspense boundary
function App() {
  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserProfile userId="123" />
    </Suspense>
  )
}
```

### State Management with Jotai

```tsx
import { atom, useAtom } from 'jotai'

const countAtom = atom(0)

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  )
}
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🔄 Keeping Dependencies Updated

To update all dependencies to their latest versions:

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Or for major version updates
npx npm-check-updates -u
npm install
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [TanStack](https://tanstack.com/) - High-quality open-source software
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives

---

**Happy coding! 🎉**
