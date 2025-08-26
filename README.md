# Data Tracker App

A comprehensive Next.js 15 application with TypeScript for tracking and managing data entries. Built with modern web technologies including Prisma, PostgreSQL, NextAuth.js, and shadcn/ui components.

## Features

- 🔐 **Authentication System** - NextAuth.js with credentials provider
- 📊 **Data Management** - Create, view, and track data entries
- 🎨 **Modern UI** - shadcn/ui components with dark theme
- 🗄️ **Database** - PostgreSQL with Prisma ORM
- 🐳 **Docker Support** - Containerized PostgreSQL database
- 📱 **Responsive Design** - Mobile-friendly interface
- 🔒 **Type Safety** - Full TypeScript implementation

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5 (beta)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Containerization**: Docker & Docker Compose

## Project Structure

```
data-tracker-app/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── data-entry/page.tsx
│   │   │   ├── history/page.tsx
│   │   │   └── layout.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   └── login-form.tsx
│   │   ├── ui/ (shadcn components)
│   │   └── navigation.tsx
│   └── lib/
│       ├── auth.ts
│       ├── db.ts
│       ├── types.ts
│       └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── docker-compose.yml
├── .env.local
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm or yarn

### Installation

1. **Clone and navigate to the project**:

   ```bash
   cd data-tracker-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env.local
   ```

   The `.env.local` file is already configured for local development.

4. **Start the complete development environment**:
   ```bash
   npm run dev:full
   ```
   This command will:
   - Start PostgreSQL database in Docker
   - Run Prisma migrations
   - Seed the database with test data
   - Start the Next.js development server

### Manual Setup (Alternative)

If you prefer to run commands individually:

1. **Start the database**:

   ```bash
   npm run db:start
   ```

2. **Run database migrations**:

   ```bash
   npm run db:migrate
   ```

3. **Seed the database**:

   ```bash
   npm run db:seed
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:start` - Start PostgreSQL container
- `npm run db:stop` - Stop PostgreSQL container
- `npm run db:reset` - Reset database (removes all data)
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:seed` - Seed database with test data
- `npm run db:studio` - Open Prisma Studio
- `npm run dev:full` - Complete development setup

## Test Accounts

The seed script creates the following test accounts:

- **Admin User**:

  - Email: `admin@example.com`
  - Password: `password123`
  - Role: ADMIN

- **Test Users**:
  - Email: `user1@example.com` / Password: `password123`
  - Email: `user2@example.com` / Password: `password123`
  - Role: USER

## Database Schema

### User Model

- `id` - Unique identifier (cuid)
- `email` - User email (unique)
- `name` - User display name
- `password` - Hashed password
- `role` - USER or ADMIN
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### DataEntry Model

- `id` - Unique identifier (cuid)
- `userId` - Foreign key to User
- `value1` - First tracking value (Float)
- `value2` - Second tracking value (Float)
- `value3` - Third tracking value (Float)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Application Routes

- `/` - Redirects to login
- `/login` - Authentication page
- `/dashboard` - Main dashboard with statistics
- `/data-entry` - Form to add new data entries
- `/history` - View all data entries in a table

## Development

### Database Management

- **View data**: `npm run db:studio` opens Prisma Studio
- **Reset database**: `npm run db:reset` (removes all data)
- **Manual migrations**: Edit `prisma/schema.prisma` then run `npm run db:migrate`

### Adding New Components

This project uses shadcn/ui. To add new components:

```bash
npx shadcn@latest add [component-name]
```

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct database connection (same as DATABASE_URL for local dev)
- `NEXTAUTH_SECRET` - Secret for NextAuth.js sessions
- `NEXTAUTH_URL` - Application URL for NextAuth.js

## Production Deployment

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Set up production database** and update environment variables

3. **Run migrations**:

   ```bash
   npx prisma migrate deploy
   ```

4. **Start production server**:
   ```bash
   npm run start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
