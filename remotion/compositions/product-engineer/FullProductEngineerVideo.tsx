import { AbsoluteFill } from "remotion"
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions"
import { slide } from "@remotion/transitions/slide"
import { wipe } from "@remotion/transitions/wipe"
import { fade } from "@remotion/transitions/fade"
import { HeroVideo } from "./HeroVideo"
import { ProblemVideo } from "./ProblemVideo"
import { ApproachVideo } from "./ApproachVideo"
import { UIShowcaseVideo } from "./UIShowcaseVideo"
import { CTAVideo } from "./CTAVideo"
import { DeleteFigmaVideo } from "./DeleteFigmaVideo"

interface FullProductEngineerVideoProps {
  orientation?: "horizontal" | "vertical"
}

export const FullProductEngineerVideo: React.FC<FullProductEngineerVideoProps> = ({
  orientation = "horizontal",
}) => {
  // Transition duration in frames (30 fps = 1 second per 30 frames)
  const transitionDuration = 20 // ~0.67 seconds

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* 1. Hero Section - 150 frames */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <HeroVideo orientation={orientation} />
        </TransitionSeries.Sequence>

        {/* Transition: Slide from right */}
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: transitionDuration,
          })}
        />

        {/* 2. Problem Section - 180 frames */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <ProblemVideo orientation={orientation} />
        </TransitionSeries.Sequence>

        {/* Transition: Wipe from left */}
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* 3. Approach Section - 180 frames */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <ApproachVideo orientation={orientation} />
        </TransitionSeries.Sequence>

        {/* Transition: Fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* 4. UI Showcase Section - 150 frames */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <UIShowcaseVideo orientation={orientation} />
        </TransitionSeries.Sequence>

        {/* Transition: Slide from bottom */}
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: transitionDuration,
          })}
        />

        {/* 5. CTA Section - 180 frames */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <CTAVideo orientation={orientation} />
        </TransitionSeries.Sequence>

        {/* Transition: Wipe from right */}
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* 6. Delete Figma Section - 300 frames */}
        <TransitionSeries.Sequence durationInFrames={300}>
          <DeleteFigmaVideo orientation={orientation} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  )
}

/**
 * Total Duration Calculation:
 *
 * Sequences: 150 + 180 + 180 + 150 + 180 + 300 = 1140 frames
 * Transitions: 5 transitions × 20 frames = 100 frames overlap
 * Total: 1140 - 100 = 1040 frames
 *
 * At 30 fps: 1040 / 30 = 34.67 seconds (~35 seconds)
 *
 * Timeline:
 * 0-150: Hero (5s)
 * 130-310: Problem (6s) - overlaps 20 frames
 * 290-470: Approach (6s) - overlaps 20 frames
 * 450-600: UI Showcase (5s) - overlaps 20 frames
 * 580-760: CTA (6s) - overlaps 20 frames
 * 740-1040: Delete Figma (10s) - overlaps 20 frames
 */
