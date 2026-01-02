# Aura - React 19 + TypeScript + Vite + Tailwind CSS

A modern React application built with the latest technologies and best practices.

## 🚀 Tech Stack

- **React 19.2.0** - Latest React with improved performance and features
- **TypeScript 5.9.3** - Full type safety and better developer experience
- **Vite 7.3.0** - Lightning-fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework with CSS-based configuration
- **ESLint** - Code quality and consistency

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** - Version 20.19+ or 22.12+ (recommended)
- **npm** - Version 10.0+ or **pnpm** (alternative package manager)

## 🛠️ Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /home/kamals/Documents/Ai\ assignment\ Jan/aura
   ```

2. **Install dependencies:**
   
   Using npm:
   ```bash
   npm install
   ```
   
   Or using pnpm:
   ```bash
   pnpm install
   ```

## 🏃 Running the Application

### Development Mode

Start the development server with hot module replacement (HMR):

Using npm:
```bash
npm run dev
```

Using pnpm:
```bash
pnpm dev
```

The application will be available at: **http://localhost:5173/**

### Build for Production

Create an optimized production build:

```bash
npm run build
```

Or with pnpm:
```bash
pnpm build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

Or with pnpm:
```bash
pnpm preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

Or with pnpm:
```bash
pnpm lint
```

## 📁 Project Structure

```
aura/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, icons, etc.
│   ├── App.tsx         # Main application component
│   ├── App.css         # Component-specific styles
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles with Tailwind imports
├── postcss.config.js   # PostCSS configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Project dependencies and scripts
```

## 🎨 Tailwind CSS Configuration

This project uses **Tailwind CSS v4** with CSS-based configuration. Custom theme values are defined in `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --animate-spin-slow: spin 20s linear infinite;
}
```

## 💡 Code Style Guidelines

This project follows these best practices:

- ✅ **Arrow function syntax** for all components and functions
- ✅ **Proper TypeScript types** - No `any` types allowed
- ✅ **SOLID principles** for components and functions
- ✅ **React 19 best practices** - Using latest features and patterns
- ✅ **Clean and maintainable code** - Readable and well-structured

## 🔧 TypeScript Configuration

The project uses strict TypeScript settings:

- Strict mode enabled
- No unused locals or parameters
- Type-safe imports and exports
- React JSX transform

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🐛 Troubleshooting

### PostCSS/Tailwind Errors

If you encounter PostCSS errors related to Tailwind CSS, ensure you have:
- `@tailwindcss/postcss` installed
- Correct PostCSS configuration in `postcss.config.js`
- Tailwind import in `src/index.css`

### Node Version Issues

If you see Node.js version warnings, upgrade to Node.js 20.19+ or 22.12+:
```bash
nvm install 22.12
nvm use 22.12
```

## 📝 Notes

- The project uses **Vite's Fast Refresh** for instant HMR
- **React StrictMode** is enabled for better development experience
- Custom animations can be added in the `@theme` block in `index.css`

## 🤝 Contributing

When contributing to this project, please follow the established code style guidelines and ensure all TypeScript types are properly defined.

---

Built with ❤️ using React 19, TypeScript, Vite, and Tailwind CSS
