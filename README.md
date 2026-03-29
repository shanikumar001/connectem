# ConnectEm

Full-stack app with React (Vite) frontend and Node.js backend.

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```

### Backend

```bash
cd backend
npm install
npm run dev  # or node server.js
```

## Features

- Auth & Profile management
- Request access workflows
- Responsive UI with Tailwind/Shadcn

ConnectEm: Professional Mentorship & Business Networking Platform
ConnectEm is a modern, full-stack mentorship platform designed to bridge the gap between industry experts and growing organizations. Built with a focus on premium aesthetics and seamless user onboarding, it provides a structured environment for professional growth and strategic partnerships.

🚀 Features

1. Intelligent Onboarding & Dynamic Profiling
   Enforced Completion: New users are guided through a mandatory profile setup process before accessing the platform.
   Role-Specific Forms:
   Mentors: Tailored sections for expertise, technical skills, years of experience, professional bio, and availability.
   Companies: Specialized fields for company size, industry, specific mentor requirements, and contact leads.
   Clean Management: A structured profile page allows users to view and update their public presence with ease.
2. Powerful Administrative Control
   Centralized Dashboard: Admins have a high-level overview of the entire community, categorized by Mentors and Companies.
   System Moderation: Capabilities to approve new members, edit profile details, and manage user accounts (deletion/suspension).
   Secure Seeding: Built-in admin account initialization through environment variables for secure first-time setup.
3. Premium UI/UX Implementation
   Modern Aesthetics: A borderless, soft-layered interface inspired by top-tier SaaS platforms (like Vercel and Linear).
   Responsive Design: Fully optimized for Desktop, Tablet, and Mobile experiences.
   Interactive Elements: Smooth transitions and micro-animations powered by Framer Motion.
   🛠️ Tech Stack
   Frontend
   Framework: React 19 (Vite)
   Language: TypeScript
   Routing: TanStack Router (Type-safe routing)
   State & Data: TanStack Query (React Query) & Zustand
   Styling: Tailwind CSS & Radix UI (Headless components)
   Icons: Lucide React
   Backend
   Runtime: Node.js (Express)
   Database: MongoDB with Mongoose ODM
   Security: JWT (JSON Web Tokens), Bcrypt hashing, Helmet.js
   Middleware: Cookie-parser, CORS, Rate-limiting
