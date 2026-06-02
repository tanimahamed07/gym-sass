# GymSaaS Frontend

A modern, responsive Next.js 15 frontend for the GymSaaS gym management platform.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **API Client**: Custom fetch-based client

## Features

### Public Pages

1. **Home (/)** - Landing page with:
   - Hero section with CTA
   - Features showcase
   - How it works
   - Pricing preview
   - Testimonials
   - FAQ
   - Footer

2. **Pricing (/pricing)** - Plan comparison:
   - Basic ($29/month)
   - Pro ($79/month) - Most Popular
   - Enterprise (Custom pricing)

3. **About (/about)** - Company information:
   - Company story
   - Mission & values
   - Team members

4. **Contact (/contact)** - Contact form with:
   - Name, email, phone, subject, message
   - Contact information cards

### Authentication

5. **Login (/login)**
   - Email + password form
   - Calls `/api/v1/auth/login`
   - Stores access token in memory
   - Refresh token in httpOnly cookie (backend)
   - Redirects to `/dashboard` on success

6. **Register (/register)**
   - Gym registration form:
     - Gym Name \*
     - Gym Address
     - Owner Name \*
     - Email \*
     - Password \* (min 8 chars)
     - Confirm Password \*
     - Phone \*
   - Calls `/api/v1/auth/register`
   - Auto-login after registration
   - Redirects to `/dashboard` on success

### Protected Pages

7. **Dashboard (/dashboard)**
   - Protected route (requires auth)
   - Overview stats (members, classes, revenue, growth)
   - Getting started guide
   - Logout functionality

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, or pnpm
- Backend API running on `http://localhost:5001`

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your backend API URL

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

## Project Structure

```
frontend/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── pricing/           # Pricing page
│   ├── contact/           # Contact page
│   ├── login/             # Login page
│   ├── register/          # Register page
│   └── dashboard/         # Dashboard (protected)
├── components/            # React components
│   ├── layout/           # Header, Footer
│   ├── home/             # Home page sections
│   ├── auth/             # Login/Register forms
│   ├── pricing/          # Pricing table
│   ├── contact/          # Contact form
│   └── ui/               # Shadcn UI components
├── lib/                  # Utilities
│   ├── api.ts            # API client
│   └── utils.ts          # Utility functions
├── types/                # TypeScript types
│   └── auth.ts           # Auth types
└── public/               # Static assets
```

## API Integration

### Authentication Flow

1. **Registration**:

   ```typescript
   POST /auth/register
   Body: { gymName, gymAddress?, ownerName, email, password, phone }
   Response: { user, tokens: { accessToken, refreshToken } }
   ```

2. **Login**:

   ```typescript
   POST /auth/login
   Body: { email, password }
   Response: { user, tokens: { accessToken, refreshToken } }
   ```

3. **Token Storage**:
   - Access Token: Stored in memory (ApiClient class)
   - Refresh Token: httpOnly cookie (set by backend)
   - User Info: localStorage (optional, for UI display)

4. **Protected Requests**:

   ```typescript
   apiClient.setAccessToken(token);
   apiClient.getProfile(); // Includes Authorization header
   ```

5. **Logout**:
   ```typescript
   POST / auth / logout;
   // Clears access token and invalidates refresh token
   ```

## Features

### Responsive Design

- Mobile-first approach
- Hamburger menu on mobile
- Touch-friendly components
- Responsive grid layouts

### User Experience

- Loading states with spinners
- Error handling with user-friendly messages
- Form validation
- Success feedback
- Smooth page transitions

### Security

- Access tokens in memory only
- Refresh tokens in httpOnly cookies
- Protected route checks
- CORS enabled with credentials
- Input validation

## Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Customization

### Styling

- Colors: Edit `app/globals.css` for theme colors
- Components: Shadcn UI components in `components/ui/`
- Tailwind: Configure in `tailwind.config.ts`

### API URL

- Development: `http://localhost:5001/api/v1`
- Production: Update in `.env.local`

## Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy to Vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT

## Support

For support, email support@gymsaas.com or visit /contact
