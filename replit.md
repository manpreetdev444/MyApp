# Overview

WedSimplify is a wedding vendor platform that connects couples planning their weddings with vendors offering wedding services. The platform provides a comprehensive solution with dual user roles: couples who can search, compare, and book vendors, and vendors who can showcase their services, manage bookings, and communicate with potential clients. The application includes features like vendor browsing, portfolio management, budget tracking, wedding timeline planning, inquiry management, and integrated payment processing.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React and TypeScript using Vite as the build tool. The application follows a component-based architecture with:
- **Routing**: Uses Wouter for client-side routing with role-based page access
- **State Management**: React Query for server state management and React hooks for local state
- **UI Framework**: Custom component library built on Radix UI primitives with Tailwind CSS for styling
- **Design System**: Implements a wedding-themed design with custom color palette (rose-gold, dusty-blue, champagne, etc.)
- **Form Handling**: React Hook Form with Zod schema validation

The frontend structure separates concerns with dedicated directories for components, pages, hooks, and utilities. The application supports different dashboards based on user roles (couple vs vendor).

## Backend Architecture
The backend follows an Express.js REST API pattern with:
- **Server Framework**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints organized by feature domains

The server implements middleware for logging, error handling, and authentication checks. Route handlers are organized to support both couple and vendor workflows.

## Database Design
Uses PostgreSQL with Drizzle ORM featuring:
- **User Management**: Central users table with role-based access (couple/vendor)
- **Relational Structure**: Separate tables for couples, vendors, packages, portfolio items, inquiries, budget items, and timeline items
- **Data Integrity**: Foreign key relationships and proper constraints
- **Schema Management**: Type-safe schema definitions shared between frontend and backend

## Authentication System
Implements Replit Auth with:
- **OpenID Connect**: Integration with Replit's identity provider
- **Session-based Auth**: Secure session management with PostgreSQL storage
- **Role-based Access**: Distinguishes between couple and vendor users
- **Profile Setup**: Post-authentication profile completion flow

## File Upload System
Integrates Google Cloud Storage with:
- **Object Storage**: Google Cloud Storage for portfolio images and documents
- **Upload Management**: Uppy.js for client-side file upload with progress tracking
- **Access Control**: Custom ACL system for managing file permissions
- **Direct Upload**: Presigned URL pattern for efficient file transfers

## Payment Integration
Stripe integration for:
- **Payment Processing**: Secure deposit collection for vendor bookings
- **React Components**: Stripe React components for payment forms
- **Webhook Support**: Server-side webhook handling for payment events

## External Dependencies

- **Database**: Neon PostgreSQL (serverless PostgreSQL provider)
- **Authentication**: Replit Auth (OpenID Connect provider)
- **File Storage**: Google Cloud Storage for media and document storage
- **Payment Processing**: Stripe for secure payment transactions
- **Email Service**: Potential integration for inquiry notifications
- **Frontend UI**: Radix UI component library for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **Build Tools**: Vite for fast development and optimized production builds
- **File Upload**: Uppy.js for enhanced file upload experience
- **Validation**: Zod for runtime type checking and schema validation