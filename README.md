# Company Compass

## Overview

Company Compass is a comprehensive web application designed to help organizations manage and explore their company directory. Whether you're tracking potential business partners, maintaining a network of industry contacts, or organizing corporate relationships, this tool provides an intuitive way to store, search, and visualize company information.

### What Makes Company Compass Special

Instead of scattered spreadsheets or disconnected CRM systems, Company Compass offers a centralized, user-friendly platform where you can:

- **Build a Complete Company Profile**: Store essential details like industry, location, company size, and website links for each organization
- **Discover Patterns**: Use advanced filtering and sorting to identify trends across industries, locations, and company sizes
- **Visualize Your Network**: Switch between table and Kanban views to see your company relationships from different perspectives
- **Stay Organized**: Pagination and search features ensure you can quickly find information even with large datasets

## How It Works

### For Users
1. **Browse Companies**: Start by viewing the main directory in a clean table format, showing all companies at a glance
2. **Find What You Need**: Use the search bar to look for specific company names, or filter by industry (like Technology or Healthcare) and location (such as San Francisco or New York)
3. **Sort and Organize**: Click column headers to sort companies alphabetically, by industry, location, or size
4. **Visual Exploration**: Switch to Kanban view to see companies organized by industry columns, perfect for spotting clusters or gaps in your network
5. **Manage Records**: Add new companies, edit existing ones, or remove outdated entries with simple forms and confirmation dialogs
6. **Navigate Easily**: Use pagination to handle large lists, and responsive design works seamlessly on desktop and mobile

### Under the Hood
The application uses a modern full-stack architecture:
- **Frontend**: A responsive React app that communicates with a REST API
- **Backend**: A Node.js server that handles data requests and serves company information
- **Database**: MongoDB stores company records with flexible schemas
- **Real-time Updates**: Changes are reflected immediately across the application

## Features

- **Company Management**: Create, read, update, and delete company records
- **Advanced Filtering & Search**: Filter by industry and location, search by company name
- **Sorting**: Sort companies by name, industry, location, or size
- **Pagination**: Navigate through large datasets efficiently
- **Kanban View**: Visualize companies in a kanban board layout organized by industry
- **Responsive Design**: Modern UI built with Tailwind CSS and Shadcn/ui components
- **Real-time Data**: Powered by MongoDB and RESTful APIs

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for client-side routing
- **TanStack Query** for server state management
- **Shadcn/ui** component library
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **Node.js** with Express framework
- **MongoDB** with Mongoose ODM
- **CORS** for cross-origin requests
- **RESTful API** design

## Project Structure

```
company-compass/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and API functions
│   │   └── types/         # TypeScript type definitions
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Backend Node.js application
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API route handlers
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd company-compass
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```
   
   Create a `.env` file in the server directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/company-compass
   PORT=5000
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```

3. **Alternative: Run both servers concurrently**
   ```bash
   cd client
   npm run dev:full
   ```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | Get all companies |
| GET | `/api/companies/:id` | Get company by ID |
| POST | `/api/companies` | Create new company |
| PUT | `/api/companies/:id` | Update company |
| DELETE | `/api/companies/:id` | Delete company |

## Available Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run server` - Start backend server

### Server
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Company Data Structure

```typescript
interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  size: string;
  website: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Supported Industries
- Technology
- Finance
- Healthcare
- Education
- Retail
- Manufacturing
- Energy
- Media
- Automotive
- Logistics
- Travel

## Supported Locations
- San Francisco
- New York
- Boston
- Austin
- Chicago
- Detroit
- Seattle
- Denver
- Los Angeles
- Miami
- Orlando

## Supported Company Sizes
- 1-50
- 50-100
- 100-500
- 500-1000
- 1000-5000
- 5000+

