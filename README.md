# Company Compass

## Overview

Company Compass is a web application designed to help you manage and explore a directory of companies. It provides an intuitive interface to store, search, and organize company information in a structured way.

### What You Can Do

- **Store Company Information**: Keep track of company details including name, industry, location, size, and website
- **Search and Filter**: Quickly find companies by name, industry, or location
- **Sort Data**: Organize companies alphabetically or by different attributes
- **Visual Views**: See your companies in both table and Kanban board formats
- **Manage Records**: Add new companies, update existing ones, and remove entries as needed
- **Handle Large Lists**: Navigate through extensive company directories with pagination

## How It Works

### For Users
1. **View the Directory**: Start with a table showing all companies and their key details
2. **Search Companies**: Use the search bar to find companies by name
3. **Filter Results**: Narrow down the list by selecting specific industries or locations
4. **Sort Information**: Click column headers to sort companies by name, industry, location, or size
5. **Switch Views**: Toggle between table view and Kanban view organized by industry
6. **Add Companies**: Use the create form to add new companies to your directory
7. **Edit Companies**: Update company information through simple edit forms
8. **Remove Companies**: Delete companies with confirmation dialogs
9. **Browse Pages**: Use pagination controls to navigate through large datasets

### Technical Workflow
- The React frontend communicates with a Node.js backend API
- Data is stored in a MongoDB database
- Changes are saved and retrieved in real-time
- The application works responsively across different devices

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the ISC License.
```
