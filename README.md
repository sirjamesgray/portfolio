# Jamie Gray - Portfolio

A modern portfolio and client management site built with Next.js 16, featuring interactive UI components, fluid animations, and Supabase authentication.

## Tech Stack

### Core Framework
- **[Next.js 16](https://nextjs.org)** - React framework with App Router and Turbopack
- **[React 19](https://react.dev)** - UI library
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[Tailwind CSS v4](https://tailwindcss.com)** - Utility-first CSS framework

### Authentication & Backend
- **[@supabase/ssr](https://supabase.com/docs/guides/auth/server-side)** - Server-side Supabase auth
- **[@supabase/supabase-js](https://supabase.com/docs/reference/javascript)** - Supabase client library

### UI Components

#### Magic UI Components
From [magicui.design](https://magicui.design):
- `shimmer-button` - Animated button with shimmer effect
- `blur-fade` - Fade-in animation with blur effect
- `bento-grid` - Responsive grid layout for cards
- `marquee` - Infinite scrolling marquee
- `dot-pattern` - Decorative dot pattern background
- `sparkles-text` - Text with sparkle animations
- `animated-gradient-text` - Gradient text with animation
- `ripple` - Ripple effect component
- `pulsating-button` - Button with pulse animation
- `interactive-hover-button` - Button with hover effects
- `grid-pattern` - Grid pattern background

#### shadcn/ui Components
From [ui.shadcn.com](https://ui.shadcn.com):
- `button` - Base button component
- `switch` - Toggle switch
- `slider` - Range slider
- `checkbox` - Checkbox input
- `badge` - Status badge

### Animation & Effects
- **[Framer Motion](https://www.framer.com/motion)** - Animation library
- **[smokey-fluid-cursor](https://github.com/faraasat/smokey-fluid-cursor)** - Fluid smoke effect following cursor
- **[Lucide React](https://lucide.dev)** - Icon library

### Theming
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Dark/light mode with system preference detection

## Custom Components

### `CursorGrid`
Interactive grid background with sparkle effects at intersections. The grid and sparkles brighten as the cursor approaches.

Location: `components/cursor-grid.tsx`

### `FluidCursor`
Purple-themed smoky fluid effect that follows the cursor. Only renders on devices with fine pointer (mouse/trackpad).

Location: `components/fluid-cursor.tsx`

### `ExperienceTimeline`
Vertical timeline showing work experience with:
- Alternating left/right cards on desktop
- Date range highlighting on hover
- Animated connecting lines
- Pulsing indicator for current role

Location: `components/experience-timeline.tsx`

### `UIShowcase`
Horizontally scrollable showcase of interactive UI components with auto-triggering animations:
- Toggle switches (notifications, WiFi, dark mode)
- Sliders (performance, volume)
- Progress indicators (download, sync)
- Buttons with state changes
- Badges with cycling highlights
- Like button with counter
- Checkboxes
- User status indicators

Location: `components/ui-showcase.tsx`

### `ThemeToggle`
Animated theme toggle button that cycles through light/dark/system modes.

Location: `components/theme-toggle.tsx`

## Project Structure

```
├── app/
│   ├── page.tsx              # Main landing page
│   ├── login/page.tsx        # OAuth login (GitHub, Google)
│   ├── auth/callback/route.ts # OAuth callback handler
│   └── layout.tsx            # Root layout with providers
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── cursor-grid.tsx       # Interactive grid background
│   ├── fluid-cursor.tsx      # Smoky cursor effect
│   ├── experience-timeline.tsx
│   ├── ui-showcase.tsx
│   ├── theme-toggle.tsx
│   └── theme-provider.tsx
├── lib/
│   ├── constants.ts          # Site configuration
│   ├── utils.ts              # Utility functions (cn)
│   └── supabase/
│       ├── client.ts         # Browser Supabase client
│       ├── server.ts         # Server Supabase client
│       └── middleware.ts     # Session handling
└── middleware.ts             # Next.js middleware for auth
```

## Getting Started

### Prerequisites
- Node.js 20.9.0+ or Bun
- Supabase project (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/sirjamesgray/portfolio.git
cd portfolio

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Development

```bash
# Run with Bun runtime (recommended for Node.js < 20.9.0)
bun --bun run dev --port 3001

# Or with Node.js 20.9.0+
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the site.

### Build

```bash
bun run build
```

## Deployment

The site is deployed on [Vercel](https://vercel.com). Push to `main` to trigger automatic deployments.

Remember to add environment variables in Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Configuration

Site-wide configuration is centralized in `lib/constants.ts`:

```typescript
export const SITE_CONFIG = {
  name: "Jamie Gray",
  title: "Product Engineer",
  email: "contact@jamiegray.net",
  description: "...",
} as const;
```

## License

MIT
