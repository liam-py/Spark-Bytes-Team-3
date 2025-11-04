# Spark! Bytes

A full-stack web application for sharing and discovering free food opportunities. Built with Next.js (React) frontend and Express.js (TypeScript) backend.

## Project Structure

```
Spark-Bytes-Team-3/
├── client/          # Next.js frontend application
└── server/          # Express.js backend API
```

## Features

- User authentication (login/register)
- JWT-based session management
- User profile management
- Modern UI built with Ant Design and Tailwind CSS

## Tech Stack

### Frontend (Client)
- **Framework**: Next.js 14 (React 18)
- **UI Library**: Ant Design
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Database Client**: Prisma

### Backend (Server)
- **Framework**: Express.js 5
- **Language**: TypeScript
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- SQLite (included with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/liam-py/Spark-Bytes-Team-3.git
cd Spark-Bytes-Team-3
```

2. Set up the backend:
```bash
cd server
npm install
npm run prisma:gen
npm run prisma:migrate
```

3. Set up the frontend:
```bash
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the `server` directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
```

Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
```

### Running the Application

1. Start the backend server (from `server/` directory):
```bash
npm run dev
```
The API will run on `http://localhost:4000`

2. Start the frontend development server (from `client/` directory):
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

## API Endpoints

All endpoints are prefixed with `/auth`:

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email and password
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - Logout (clears session cookie)

## Development

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:gen` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

### Frontend
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

ISC
