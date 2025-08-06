# BioShelf Frontend

React-based frontend for the BioShelf lab inventory management system.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server with json-server
npm run json-server  # Terminal 1
npm run dev         # Terminal 2

# Run tests
npm test

# Build for production
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/          # API client functions
│   ├── components/   # React components
│   ├── contexts.js   # React contexts
│   ├── hooks/        # Custom React hooks
│   └── routes/       # TanStack Router routes
├── index.html        # Entry HTML file
├── vite.config.js    # Vite configuration
└── db.json          # Mock database for json-server
```

## 🧪 Testing

The project uses Vitest with two testing environments:

- **Node tests** (`.node.test.js`): Run in Happy DOM environment
- **Browser tests** (`.browser.test.js`): Run in real browser with Playwright

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run coverage
```

## 🔧 Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run json-server` - Start mock API server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## 🎨 Key Features

- **Dashboard**: Overview of inventory status
- **Inventory Management**: CRUD operations for materials
- **CSV Import**: Bulk import materials from CSV files
- **Status Tracking**: Automatic low stock and expiry alerts
- **Responsive Design**: Mobile-friendly interface

## 🔗 API Configuration

The frontend is configured to work with either:

1. **json-server** (default for development)
   - Runs on port 4000
   - Uses `db.json` as database

2. **Rails API** (production/future)
   - Configure via `VITE_API_URL` environment variable
   - Proxy configured in `vite.config.js`