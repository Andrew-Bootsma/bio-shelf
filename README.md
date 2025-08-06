# BioShelf - Lab Inventory Management System

A modern laboratory inventory management application for tracking biological materials and supplies.

## 🏗️ Project Structure

This is a monorepo containing both the frontend and backend applications:

```
bio-shelf/
├── frontend/     # React application (Vite + TanStack Router)
├── backend/      # Rails API (coming soon)
└── infra/        # Infrastructure as code (CloudFormation)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Ruby 3.2+ (for Rails backend)
- PostgreSQL 14+ (for Rails backend)

### Development Setup

1. **Install dependencies:**
   ```bash
   # Install root dependencies
   npm install
   
   # Install all dependencies (frontend + backend)
   npm run install:all
   ```

2. **Start development servers:**

   **Option A: Use json-server (current setup)**
   ```bash
   # Terminal 1: Start json-server mock API
   cd frontend
   npm run json-server
   
   # Terminal 2: Start React dev server
   cd frontend
   npm run dev
   ```

   **Option B: Use Rails backend (after setup)**
   ```bash
   # From root directory, starts both servers
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - JSON Server API: http://localhost:4000
   - Rails API: http://localhost:3000 (when configured)

## 📚 Documentation

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🧪 Testing

```bash
# Run frontend tests
npm run test:frontend

# Run backend tests (after Rails setup)
npm run test:backend
```

## 🔧 Available Scripts

From the root directory:

- `npm run dev` - Start both frontend and backend servers
- `npm run dev:frontend` - Start only the frontend
- `npm run dev:backend` - Start only the Rails backend
- `npm run dev:json-server` - Start json-server (mock API)
- `npm run build:frontend` - Build frontend for production
- `npm run test:frontend` - Run frontend tests
- `npm run lint:frontend` - Lint frontend code
- `npm run format:frontend` - Format frontend code

## 📦 Technology Stack

### Frontend
- React 19 with React Compiler
- TanStack Router & Query
- Tailwind CSS
- Vite
- Vitest

### Backend (Planned)
- Ruby on Rails 7.1+
- PostgreSQL
- RSpec

## 📄 License

MIT