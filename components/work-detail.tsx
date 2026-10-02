import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { BoardLightbox } from "@/components/board-lightbox";
import { CareerButton } from "@/components/career-button";
import { LaptopFrame, PhoneFrame } from "@/components/device-frame";
import { HireCta } from "@/components/hire-cta";
import { SectionHead } from "@/components/section-head";
import { DESIGN_STUDIES, PARKHUB_NOTE, PUBLIC_PRODUCTS, TURBO, type BoardShot } from "@/lib/public-work";

const WORX_LABELS = ["Product", "API platform", "APEX to React", "Backend Mirror", "SSO and local dev"];

function frameClass() {
  return "border border-border bg-black p-2";
}

function BoardFrame({ board }: { board: BoardShot }) {
  const frames = [board, ...(board.details ?? [])];
  return (
    <div className="mt-6 space-y-4">
      {frames.map((frame) => (
        <BoardLightbox key={frame.src} board={{ ...frame, details: frame === board ? board.details : undefined }}>
          <div className={frameClass()}>
            <Image
              src={frame.src}
              alt={frame.alt}
              width={frame.width}
              height={frame.height}
              sizes="(min-width: 1024px) 960px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </BoardLightbox>
      ))}
    </div>
  );
}

export function WorkDetail({ slug }: { slug: string }) {
  const product = PUBLIC_PRODUCTS.find((item) => item.id === slug);
  if (product?.desktop) {
    const blue = product.id === "lucent-wash";
    return (
      <article>
        <SectionHead index={product.index} title={product.name} as="h1" />
        <p className="mt-3 text-sm text-foreground">{product.role}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {product.place} · {product.dates}
        </p>
        {product.earns ? (
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-foreground">
            <span className={`font-mono text-xs ${blue ? "text-blue" : "text-brand"}`}>Who earns · </span>
            {product.earns}
          </p>
        ) : null}
        <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-foreground">{product.summary}</p>
        <ul className="mt-5 max-w-prose space-y-2 text-sm leading-relaxed text-foreground">
          {product.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        {product.href ? (
          <div className="mt-5">
            <CareerButton variant="secondary" icon={ExternalLink} href={product.href} target="_blank" rel="noopener noreferrer">
              {product.hrefLabel}
            </CareerButton>
          </div>
        ) : null}
        <div className="relative mt-8 pb-4 lg:pb-16">
          <div className="w-full lg:w-[65%]">
            <LaptopFrame shot={product.desktop} priority />
          </div>
          {product.mobile ? (
            <div className="mx-auto mt-6 w-[42%] max-w-[200px] lg:absolute lg:bottom-0 lg:left-[58%] lg:mx-0 lg:mt-0 lg:w-[27%]">
              <PhoneFrame shot={product.mobile} priority />
            </div>
          ) : null}
        </div>
        <div className="mt-8">
          <HireCta />
        </div>
      </article>
    );
  }

  if (product) {
    return (
      <article>
        <SectionHead index={product.index} title={product.name} as="h1" />
        <ul className="mt-3 space-y-1 text-sm text-foreground">
          {product.titles?.map((title) => (
            <li key={title}>{title}</li>
          ))}
        </ul>
        <p className="mt-1 text-sm text-muted-foreground">{product.place}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{product.dates}</p>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-foreground">{product.summary}</p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2">
          {product.points.map((point, index) => (
            <li key={point} className="border border-border bg-black p-4">
              <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">0{index + 1}</p>
              <p className="mt-2 text-sm font-medium text-foreground">{WORX_LABELS[index]}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{point}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <HireCta />
        </div>
      </article>
    );
  }

  const client = TURBO.clients.find((item) => item.id === slug);
  if (client) {
    return (
      <article>
        <div className="flex items-center gap-3">
          <Image src={client.logo} alt="" width={36} height={36} className="size-9 border border-border bg-black object-contain p-1" />
        </div>
        <div className="mt-4">
          <SectionHead index="01" title={client.label} as="h1" />
        </div>
        <p className="mt-3 text-sm text-foreground">{client.title}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{client.dates}</p>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-foreground">{client.summary}</p>
        <div className="mt-3 max-w-prose space-y-2 text-sm leading-relaxed text-muted-foreground">
          {client.supporting.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="mt-4 font-mono text-xs text-muted-foreground">{TURBO.tools}</p>
        {client.board ? <BoardFrame board={client.board} /> : null}
        <div className="mt-8">
          <HireCta />
        </div>
      </article>
    );
  }

  const study = DESIGN_STUDIES.find((item) => item.id === slug);
  if (study) {
    return (
      <article>
        <SectionHead index="01" title={study.title} as="h1" />
        <p className="mt-2 text-xs text-muted-foreground">{study.meta}</p>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-foreground">{study.summary}</p>
        {study.image ? (
          <div className="mt-6">
            <BoardLightbox board={study.image}>
              <div className={frameClass()}>
                <Image
                  src={study.image.src}
                  alt={study.image.alt}
                  width={study.image.width}
                  height={study.image.height}
                  sizes="(min-width: 1024px) 960px, 100vw"
                  className="h-auto w-full"
                />
              </div>
            </BoardLightbox>
          </div>
        ) : null}
        <div className="mt-8">
          <HireCta />
        </div>
      </article>
    );
  }

  if (slug === "parkhub") {
    return (
      <article>
        <SectionHead index="01" title={PARKHUB_NOTE.title} as="h1" />
        <p className="mt-2 text-xs text-muted-foreground">{PARKHUB_NOTE.meta}</p>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-foreground">{PARKHUB_NOTE.summary}</p>
        <div className="mt-8">
          <HireCta />
        </div>
      </article>
    );
  }

  return null;
}
