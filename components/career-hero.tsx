import { LaptopFrame, PhoneFrame } from "@/components/device-frame";
import { PUBLIC_PRODUCTS } from "@/lib/public-work";

/**
 * Desktop hero stage.
 * The Lucent phone sits on the lower corner of the WeWrite laptop.
 * Both devices stay flat. No tilt and no scroll parallax.
 */
export function CareerHeroStage() {
  const wewrite = PUBLIC_PRODUCTS[0];
  const lucent = PUBLIC_PRODUCTS[1];
  if (!wewrite.desktop || !lucent.mobile) return null;

  return (
    <div className="relative mx-auto w-full max-w-[920px] pb-10 pr-6 pt-6">
      <LaptopFrame
        shot={wewrite.desktop}
        priority
        sizes="(min-width: 1024px) 720px, 90vw"
      />
      <div className="absolute bottom-0 right-[4%] w-[28%] max-w-[210px]">
        <PhoneFrame shot={lucent.mobile} priority sizes="210px" />
      </div>
    </div>
  );
}
