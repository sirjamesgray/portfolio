# Remotion Video Templates

Professional marketing videos created programmatically with React and Remotion.

## 🎬 Available Templates

### Brand & Identity
- **LogoReveal** (8s) - Animated logo reveal with particle effects, glow, and shine overlay
  - Perfect for: Social media intros, brand announcements
  - Customizable: Brand name, subtitle, accent color

### Conversion & Sales
- **CallToAction** (8s) - Compelling CTA with pulsing button, animated stats, and urgency indicators
  - Perfect for: Landing pages, social media ads, email campaigns
  - Features: Live stats counter, particle animations, glow effects

### Portfolio & Work
- **PortfolioShowcase** (21s) - Multi-project showcase with animated project cards
  - Perfect for: Portfolio presentations, case studies
  - Displays: Project title, description, tech stack with smooth transitions

### Social Proof
- **TestimonialVideo** (21s) - Client testimonials with star ratings and elegant animations
  - Perfect for: Trust building, social proof campaigns
  - Features: Animated star ratings, quote styling, client attribution

### Product Features
- **FeatureHighlight** (21s) - Feature showcase with icons, descriptions, and benefit lists
  - Perfect for: Product launches, feature announcements
  - Displays: Icon, title, description, checkmark benefit list

### Quick Marketing
- **MarketingHero** (10s) - Eye-catching hero with animated title and rotating gradient
- **FeatureShowcase** (15s) - Simple feature list with glass-morphism effects
- **ProductDemo** (20s) - Browser mockup with floating background elements

## 🚀 Quick Start

### Launch Remotion Studio (Preview & Edit)
```bash
npx remotion studio remotion/index.ts
```

### Render a Single Video
```bash
npx remotion render remotion/index.ts LogoReveal output.mp4
```

### Render Specific Frame as Image
```bash
npx remotion still remotion/index.ts CallToAction output.png --frame=120
```

## 📐 Video Specifications

- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Format**: MP4 (H.264)
- **Codec**: H.264 (configurable in remotion.config.ts)

### Social Media Formats

The project includes pre-configured compositions for social media:

- **Instagram Square**: 1080x1080 (InstagramSquare-CTA)
- **Instagram Story**: 1080x1920 (InstagramStory-LogoReveal)

## 🎨 Customization

### Editing Default Props

Open `remotion/Root.tsx` and modify the `defaultProps` for any composition:

```tsx
<Composition
  id="LogoReveal"
  component={LogoReveal}
  durationInFrames={240}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    brandName: "Your Brand",
    subtitle: "Your Tagline",
    accentColor: "#667eea",
  }}
/>
```

### Creating Custom Variations

Use the `--props` flag to override defaults:

```bash
npx remotion render remotion/index.ts LogoReveal output.mp4 \
  --props='{"brandName":"Acme Corp","accentColor":"#ff0000"}'
```

## 🎯 Use Cases

### Landing Pages
1. **LogoReveal** - Intro animation
2. **FeatureHighlight** - Showcase features
3. **TestimonialVideo** - Build trust
4. **CallToAction** - Drive conversions

### Social Media
- **Instagram Feed**: Use InstagramSquare-CTA (1080x1080)
- **Instagram Stories**: Use InstagramStory-LogoReveal (1080x1920)
- **Twitter/X**: Use standard 1920x1080 templates
- **LinkedIn**: Use PortfolioShowcase or TestimonialVideo

### Email Campaigns
- Embed **CallToAction** as video or GIF
- Use **FeatureHighlight** for product updates

## ⚙️ Configuration

### Performance Settings (remotion.config.ts)

```typescript
Config.setConcurrency(4) // Parallel rendering
Config.setDelayRenderTimeoutInMilliseconds(30000) // 30s timeout
Config.setCodec("h264") // Video codec
```

### Rendering Options

```bash
# High quality
npx remotion render remotion/index.ts LogoReveal out.mp4 --quality=100

# Fast preview
npx remotion render remotion/index.ts LogoReveal out.mp4 --quality=50

# Custom frame range
npx remotion render remotion/index.ts LogoReveal out.mp4 --frames=0-60
```

## 📦 File Structure

```
remotion/
├── index.ts                 # Entry point, registers root
├── Root.tsx                 # Composition registry
├── README.md               # This file
└── compositions/
    ├── LogoReveal.tsx
    ├── CallToAction.tsx
    ├── PortfolioShowcase.tsx
    ├── TestimonialVideo.tsx
    ├── FeatureHighlight.tsx
    ├── MarketingHero.tsx
    ├── FeatureShowcase.tsx
    └── ProductDemo.tsx
```

## 🎓 Tips & Best Practices

1. **Keep it Short**: Aim for 8-20 seconds for social media
2. **Brand Consistency**: Use your brand colors in `accentColor` prop
3. **Test Animations**: Use Remotion Studio to preview before rendering
4. **Optimize Props**: Customize `defaultProps` for your brand
5. **Multiple Formats**: Render different sizes for different platforms

## 🔧 Troubleshooting

### Video won't render
- Check that all required props are provided
- Ensure FFmpeg is installed: `ffmpeg -version`

### Slow rendering
- Reduce `Config.setConcurrency()` if system is overloaded
- Use `--quality=50` for faster previews

### Memory issues
- Reduce video duration or resolution
- Close Remotion Studio when rendering

## 📚 Learn More

- [Remotion Documentation](https://www.remotion.dev/docs/)
- [Next.js Integration](https://next.remotion.dev/)
- [Remotion on AWS Lambda](https://www.remotion.dev/docs/lambda)

## 🚀 Next Steps

1. Visit `/dashboard/admin/videos` to see all available templates
2. Launch Remotion Studio to preview videos
3. Customize props in `Root.tsx` for your brand
4. Render your first marketing video!
