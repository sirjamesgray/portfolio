"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Code, Layers, Box } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Player } from "@remotion/player"
import { Suspense, useState, useEffect } from "react"

// Import video components
import { HeroVideo } from "@/remotion/compositions/product-engineer/HeroVideo"
import { ProblemVideo } from "@/remotion/compositions/product-engineer/ProblemVideo"
import { ApproachVideo } from "@/remotion/compositions/product-engineer/ApproachVideo"
import { UIShowcaseVideo } from "@/remotion/compositions/product-engineer/UIShowcaseVideo"
import { CTAVideo } from "@/remotion/compositions/product-engineer/CTAVideo"
import { DeleteFigmaVideo } from "@/remotion/compositions/product-engineer/DeleteFigmaVideo"
import { AbsoluteFill } from "remotion"

// Import reusable components
import { AnimatedParticles } from "@/remotion/components/AnimatedParticles"
import { FloatingOrbs } from "@/remotion/components/FloatingOrbs"
import { CornerGlow } from "@/remotion/components/CornerGlow"
import { SpinningLogo } from "@/remotion/components/SpinningLogo"
import { StaticLogo } from "@/remotion/components/StaticLogo"

const productEngineerVideos = [
  {
    id: "PE-Hero",
    title: "Hero Section",
    section: "Hero",
    description: "Animated introduction with name, tagline, and floating particles",
    category: "Product Engineer",
    horizontal: {
      component: HeroVideo,
      props: { orientation: "horizontal" as const },
      duration: 150,
      dimensions: "1920x1080",
    },
    vertical: {
      component: HeroVideo,
      props: { orientation: "vertical" as const },
      duration: 150,
      dimensions: "1080x1920",
    },
  },
  {
    id: "PE-Problem",
    title: "The Problem",
    section: "Problem",
    description: "6 animated problem cards showing design-to-code inefficiencies",
    category: "Product Engineer",
    horizontal: {
      component: ProblemVideo,
      props: { orientation: "horizontal" as const },
      duration: 180,
      dimensions: "1920x1080",
    },
    vertical: {
      component: ProblemVideo,
      props: { orientation: "vertical" as const },
      duration: 180,
      dimensions: "1080x1920",
    },
  },
  {
    id: "PE-Approach",
    title: "My Approach",
    section: "Approach",
    description: "6 animated approach cards showing how Jamie solves the problem",
    category: "Product Engineer",
    horizontal: {
      component: ApproachVideo,
      props: { orientation: "horizontal" as const },
      duration: 180,
      dimensions: "1920x1080",
    },
    vertical: {
      component: ApproachVideo,
      props: { orientation: "vertical" as const },
      duration: 180,
      dimensions: "1080x1920",
    },
  },
  {
    id: "PE-UIShowcase",
    title: "UI Showcase",
    section: "Showcase",
    description: "Theme switching demonstration with Paper and Dark themes",
    category: "Product Engineer",
    horizontal: {
      component: UIShowcaseVideo,
      props: { orientation: "horizontal" as const },
      duration: 150,
      dimensions: "1920x1080",
    },
    vertical: {
      component: UIShowcaseVideo,
      props: { orientation: "vertical" as const },
      duration: 150,
      dimensions: "1080x1920",
    },
  },
  {
    id: "PE-CTA",
    title: "Call to Action",
    section: "Contact",
    description: "Final CTA with pulsing button and tagline",
    category: "Product Engineer",
    horizontal: {
      component: CTAVideo,
      props: { orientation: "horizontal" as const },
      duration: 180,
      dimensions: "1920x1080",
    },
    vertical: {
      component: CTAVideo,
      props: { orientation: "vertical" as const },
      duration: 180,
      dimensions: "1080x1920",
    },
  },
  {
    id: "PE-DeleteFigma",
    title: "Delete Figma",
    section: "DeleteFigma",
    description: "Designers should code with AI agents instead of drawing mockups - punchy viral video",
    category: "Product Engineer",
    horizontal: {
      component: DeleteFigmaVideo,
      props: { orientation: "horizontal" as const },
      duration: 300,
      dimensions: "1920x1080",
    },
    vertical: {
      component: DeleteFigmaVideo,
      props: { orientation: "vertical" as const },
      duration: 300,
      dimensions: "1080x1920",
    },
  },
]

export default function VideosPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Videos</h1>
          <p className="text-muted-foreground mt-2">
            Product Engineer landing page section videos with auto-play previews
          </p>
        </div>
        <Button variant="outline" onClick={() => {
          window.open(`${window.location.origin}`, '_blank')
        }}>
          <Code className="h-4 w-4 mr-2" />
          Launch Remotion Studio
        </Button>
      </div>

      {/* Tabs for Compositions and Components */}
      <Tabs defaultValue="compositions" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="compositions" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Compositions
          </TabsTrigger>
          <TabsTrigger value="components" className="flex items-center gap-2">
            <Box className="h-4 w-4" />
            Components
          </TabsTrigger>
        </TabsList>

        {/* Compositions Tab */}
        <TabsContent value="compositions" className="space-y-8">
          {/* Getting Started Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Product Engineer Landing Page Videos
              </CardTitle>
              <CardDescription>
                Each section has both horizontal (16:9) and vertical (9:16) versions for different platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-semibold">Commands</h3>
                  <div className="space-y-1 text-sm">
                    <div className="bg-muted p-3 rounded font-mono text-xs">
                      npx remotion studio remotion/index.ts
                    </div>
                    <p className="text-muted-foreground">Launch Remotion Studio to preview all videos</p>
                  </div>
                  <div className="space-y-1 text-sm mt-4">
                    <div className="bg-muted p-3 rounded font-mono text-xs">
                      npx remotion render remotion/index.ts PE-Hero-Horizontal out.mp4
                    </div>
                    <p className="text-muted-foreground">Render a specific video composition</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Video Formats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Horizontal:</span>
                      <span className="font-mono">1920x1080 (16:9)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vertical:</span>
                      <span className="font-mono">1080x1920 (9:16)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frame Rate:</span>
                      <span className="font-mono">30 fps</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Templates Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Available Videos</h2>
            <div className="space-y-8">
              {productEngineerVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{video.title}</CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{video.category}</Badge>
                          <Badge variant="secondary">{video.section}</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{video.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Horizontal Version */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">Horizontal (16:9)</h4>
                          <Badge variant="outline" className="text-xs">{video.horizontal.dimensions}</Badge>
                        </div>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading...</div>}>
                            <Player
                              component={video.horizontal.component}
                              inputProps={video.horizontal.props}
                              durationInFrames={video.horizontal.duration}
                              fps={30}
                              compositionWidth={1920}
                              compositionHeight={1080}
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                              controls
                              loop
                              autoPlay
                            />
                          </Suspense>
                        </div>
                        <div className="bg-muted p-2 rounded font-mono text-xs">
                          npx remotion render remotion/index.ts PE-{video.section}-Horizontal {video.id}-h.mp4
                        </div>
                      </div>

                      {/* Vertical Version */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">Vertical (9:16)</h4>
                          <Badge variant="outline" className="text-xs">{video.vertical.dimensions}</Badge>
                        </div>
                        <div className="aspect-[9/16] bg-black rounded-lg overflow-hidden mx-auto max-w-[300px]">
                          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading...</div>}>
                            <Player
                              component={video.vertical.component}
                              inputProps={video.vertical.props}
                              durationInFrames={video.vertical.duration}
                              fps={30}
                              compositionWidth={1080}
                              compositionHeight={1920}
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                              controls
                              loop
                              autoPlay
                            />
                          </Suspense>
                        </div>
                        <div className="bg-muted p-2 rounded font-mono text-xs">
                          npx remotion render remotion/index.ts PE-{video.section}-Vertical {video.id}-v.mp4
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <Card>
            <CardHeader>
              <CardTitle>Tips for QA</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>All videos auto-play and loop for easy QA review</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Use controls to pause, scrub, or replay specific sections</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Horizontal videos are optimized for YouTube, Twitter, LinkedIn</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Vertical videos are optimized for Instagram Stories, TikTok, Reels</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Each video matches the content and design of the corresponding landing page section</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-8">
          {/* Reusable Video Components Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Reusable Video Components</h2>
            <p className="text-muted-foreground mb-6">
              Shared visual elements used across all videos for consistency and easier maintenance
            </p>

            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
              {/* AnimatedParticles */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AnimatedParticles</CardTitle>
                  <CardDescription>Floating particle system with orbital motion</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-square bg-black rounded-lg overflow-hidden">
                    {isClient ? (
                      <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading...</div>}>
                        <Player
                          component={() => (
                            <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
                              <AnimatedParticles count={20} />
                            </AbsoluteFill>
                          )}
                          durationInFrames={300}
                          fps={30}
                          compositionWidth={400}
                          compositionHeight={400}
                          style={{ width: "100%", height: "100%" }}
                          loop
                          autoPlay
                        />
                      </Suspense>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">Loading...</div>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold">Props:</div>
                    <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                      <div>count?: number (default: 30)</div>
                      <div>color?: string (default: #10b981)</div>
                      <div>minDistance?: number (default: 200)</div>
                      <div>maxDistance?: number (default: 400)</div>
                      <div>opacity?: number (default: 0.4)</div>
                    </div>
                    <div className="text-muted-foreground text-xs pt-2">
                      Used in: All videos for dynamic background motion
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FloatingOrbs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">FloatingOrbs</CardTitle>
                  <CardDescription>Large blurred floating background orbs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-square bg-black rounded-lg overflow-hidden">
                    {isClient ? (
                      <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading...</div>}>
                        <Player
                          component={() => (
                            <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
                              <FloatingOrbs />
                            </AbsoluteFill>
                          )}
                          durationInFrames={300}
                          fps={30}
                          compositionWidth={400}
                          compositionHeight={400}
                          style={{ width: "100%", height: "100%" }}
                          loop
                          autoPlay
                        />
                      </Suspense>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">Loading...</div>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold">Props:</div>
                    <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                      <div>color1?: string (default: #667eea)</div>
                      <div>color2?: string (default: #764ba2)</div>
                      <div>color3?: string (default: #667eea)</div>
                    </div>
                    <div className="text-muted-foreground text-xs pt-2">
                      Creates soft, ambient background atmosphere
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CornerGlow */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CornerGlow</CardTitle>
                  <CardDescription>Radial gradient glow effects in corners</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-square bg-black rounded-lg overflow-hidden">
                    {isClient ? (
                      <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading...</div>}>
                        <Player
                          component={() => (
                            <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
                              <CornerGlow />
                            </AbsoluteFill>
                          )}
                          durationInFrames={300}
                          fps={30}
                          compositionWidth={400}
                          compositionHeight={400}
                          style={{ width: "100%", height: "100%" }}
                          loop
                          autoPlay
                        />
                      </Suspense>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">Loading...</div>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold">Props:</div>
                    <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                      <div>color?: string (default: #10b981)</div>
                      <div>opacity?: number (default: 0.5)</div>
                    </div>
                    <div className="text-muted-foreground text-xs pt-2">
                      Used in: All videos for corner accent lighting
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SpinningLogo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SpinningLogo</CardTitle>
                  <CardDescription>3D wireframe cube with rotating JG logo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-square bg-black rounded-lg overflow-hidden">
                    {isClient ? (
                      <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading...</div>}>
                        <Player
                          component={() => (
                            <AbsoluteFill style={{ backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <SpinningLogo size={120} />
                            </AbsoluteFill>
                          )}
                          durationInFrames={300}
                          fps={30}
                          compositionWidth={400}
                          compositionHeight={400}
                          style={{ width: "100%", height: "100%" }}
                          loop
                          autoPlay
                        />
                      </Suspense>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">Loading...</div>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold">Props:</div>
                    <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                      <div>size?: number (default: 80)</div>
                      <div>color?: string (default: #10b981)</div>
                      <div>opacity?: number (default: 1)</div>
                    </div>
                    <div className="text-muted-foreground text-xs pt-2">
                      Used in: All videos in bottom right corner for branding
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* StaticLogo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">StaticLogo</CardTitle>
                  <CardDescription>Non-animated version of the logo with border</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-square bg-black rounded-lg overflow-hidden">
                    {isClient ? (
                      <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading...</div>}>
                        <Player
                          component={() => (
                            <AbsoluteFill style={{ backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <StaticLogo size={120} />
                            </AbsoluteFill>
                          )}
                          durationInFrames={300}
                          fps={30}
                          compositionWidth={400}
                          compositionHeight={400}
                          style={{ width: "100%", height: "100%" }}
                          loop
                          autoPlay
                        />
                      </Suspense>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">Loading...</div>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold">Props:</div>
                    <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                      <div>size?: number (default: 80)</div>
                      <div>color?: string (default: #10b981)</div>
                      <div>opacity?: number (default: 1)</div>
                    </div>
                    <div className="text-muted-foreground text-xs pt-2">
                      Available for use in videos when rotation is not desired
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Component File Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-mono">
                  <div className="bg-muted p-3 rounded text-xs">
                    remotion/components/AnimatedParticles.tsx
                  </div>
                  <div className="bg-muted p-3 rounded text-xs">
                    remotion/components/FloatingOrbs.tsx
                  </div>
                  <div className="bg-muted p-3 rounded text-xs">
                    remotion/components/CornerGlow.tsx
                  </div>
                  <div className="bg-muted p-3 rounded text-xs">
                    remotion/components/SpinningLogo.tsx
                  </div>
                  <div className="bg-muted p-3 rounded text-xs">
                    remotion/components/StaticLogo.tsx
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mt-4">
                  These components are imported and used in all Product Engineer videos to maintain visual consistency and reduce code duplication. The SpinningLogo appears in the bottom right corner of every video for branding.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
