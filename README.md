# WedSimplify 💍

A comprehensive wedding vendor marketplace platform that connects couples planning their weddings with professional vendors offering wedding services.

## 🌟 Features

### For Couples/Consumers
- **Vendor Discovery**: Browse and search wedding vendors by category
- **Vendor Profiles**: View detailed vendor portfolios, ratings, and packages
- **Budget Management**: Track wedding expenses and manage budgets
- **Timeline Planning**: Organize wedding tasks and milestones
- **Inquiry System**: Send inquiries and communicate with vendors
- **Saved Vendors**: Bookmark favorite vendors for later

### For Vendors
- **Business Profiles**: Create comprehensive business profiles
- **Portfolio Management**: Showcase work with image galleries
- **Package Creation**: Define service packages and pricing
- **Inquiry Management**: Receive and respond to client inquiries
- **Dashboard Analytics**: Track business performance

### Platform Features
- **Role-based Authentication**: Secure login with permanent role assignment
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Live updates for inquiries and communications
- **Search & Filtering**: Advanced search capabilities with multiple filters

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Wouter** for lightweight routing
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Query** for server state management
- **React Hook Form** for form handling

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **PostgreSQL** database
- **Replit Auth** for authentication
- **Session-based authentication** with secure storage

### Infrastructure
- **Replit** for development and hosting
- **Neon PostgreSQL** for database hosting
- **Google Cloud Storage** for file uploads

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- Replit account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/manpreetdev444/MyApp.git
   cd MyApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```bash
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   REPL_ID=your_replit_id
   REPLIT_DOMAINS=your_domain.replit.dev
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 📱 Usage

### For Couples
1. **Sign up** and choose "Individual/Couple" role
2. **Complete profile setup** with wedding details
3. **Browse vendors** by category or search
4. **View vendor profiles** and portfolios
5. **Send inquiries** to interested vendors
6. **Manage budget** and timeline in your dashboard

### for Vendors
1. **Sign up** and choose "Vendor" role
2. **Set up business profile** with services and location
3. **Upload portfolio** images and create packages
4. **Receive and respond** to client inquiries
5. **Manage business** through vendor dashboard

## 🗂️ Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and configurations
├── server/                # Express.js backend
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database operations
│   └── replitAuth.ts     # Authentication setup
├── shared/               # Shared code between client and server
│   └── schema.ts        # Database schema definitions
└── package.json         # Project dependencies
```

## 🔐 Authentication

The platform uses Replit Auth for secure authentication with:
- **OpenID Connect** integration
- **Role-based access control** (Vendor vs Consumer)
- **Permanent role assignment** (no role switching)
- **Session-based authentication** with PostgreSQL storage

## 🗃️ Database Schema

The platform includes comprehensive database relationships:
- **Users**: Core user authentication and profiles
- **Vendors**: Business profiles and vendor-specific data
- **Couples**: Wedding-specific information for couples
- **Inquiries**: Communication between couples and vendors
- **Portfolios**: Vendor work showcases
- **Budget & Timeline**: Planning tools for couples

## 🎨 Design System

- **Color Palette**: Wedding-themed colors (rose-gold, dusty-blue, champagne)
- **Typography**: Clean, readable fonts
- **Components**: Consistent UI components built on Radix UI
- **Responsive**: Mobile-first design approach

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open database studio

### Code Style
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Consistent naming** conventions throughout

## 🚀 Deployment

The application is designed to run on Replit with:
- **Automatic deployments** from main branch
- **Environment variable** management
- **Database migrations** handled automatically
- **Session storage** in PostgreSQL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Live Demo**: [Your Replit URL]
- **Repository**: https://github.com/manpreetdev444/MyApp
- **Issues**: https://github.com/manpreetdev444/MyApp/issues

## 👥 Contact

For questions or support, please open an issue or contact the development team.

---

**WedSimplify** - Making wedding planning simple and stress-free! 💒✨