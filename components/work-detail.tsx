import Image from "next/image";
import { BoardLightbox } from "@/components/board-lightbox";
import { LaptopFrame, PhoneFrame } from "@/components/device-frame";
import { DESIGN_STUDIES, PARKHUB_NOTE, PUBLIC_PRODUCTS, TURBO, type BoardShot } from "@/lib/public-work";
import { getWork } from "@/lib/work-catalog";

const WORX_LABELS = ["Product", "API platform", "APEX to React", "Backend Mirror", "SSO and local dev"];

function frameClass(tone: "green" | "blue" | undefined) {
  return tone === "blue"
    ? "border border-[rgb(112_184_255/0.4)] bg-black p-2"
    : "border border-[rgb(61_214_140/0.4)] bg-black p-2";
}

function BoardFrame({ board, tone }: { board: BoardShot; tone?: "green" | "blue" }) {
  const frames = [board, ...(board.details ?? [])];
  return (
    <div className="mt-6 space-y-4">
      {frames.map((frame) => (
        <BoardLightbox key={frame.src} board={{ ...frame, details: frame === board ? board.details : undefined }}>
          <div className={frameClass(tone)}>
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
  const entry = getWork(slug);
  const tone = entry?.tone;
  const product = PUBLIC_PRODUCTS.find((item) => item.id === slug);
  if (product?.desktop) {
    const blue = product.id === "lucent-wash";
    return (
      <article>
        <p className="font-mono text-xs tracking-[0.16em] text-muted-foreground">{product.index}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">{product.name}</h1>
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
          <a
            href={product.href}
            className={`mt-5 inline-block text-sm font-medium underline underline-offset-4 ${blue ? "text-blue decoration-blue/40" : "text-brand decoration-brand/40"}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {product.hrefLabel}
          </a>
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
      </article>
    );
  }

  if (product) {
    return (
      <article>
        <p className="font-mono text-xs tracking-[0.16em] text-muted-foreground">{product.index} · text only</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">{product.name}</h1>
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
      </article>
    );
  }

  const client = TURBO.clients.find((item) => item.id === slug);
  if (client) {
    return (
      <article>
        <div className="flex items-center gap-3">
          <Image src={client.logo} alt="" width={36} height={36} className="size-9 bg-white object-contain p-1" />
          <p className="font-mono text-xs tracking-[0.16em] text-muted-foreground">via Turbo Design</p>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">{client.label}</h1>
        <p className="mt-3 text-sm text-foreground">{client.title}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{client.dates}</p>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-foreground">{client.summary}</p>
        <div className="mt-3 max-w-prose space-y-2 text-sm leading-relaxed text-muted-foreground">
          {client.supporting.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="mt-4 font-mono text-xs text-muted-foreground">{TURBO.tools}</p>
        {client.board ? <BoardFrame board={client.board} tone={tone} /> : null}
      </article>
    );
  }

  const study = DESIGN_STUDIES.find((item) => item.id === slug);
  if (study) {
    return (
      <article>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">{study.title}</h1>
        <p className="mt-2 text-xs text-muted-foreground">{study.meta}</p>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-foreground">{study.summary}</p>
        {study.image ? (
          <div className="mt-6">
            <BoardLightbox board={study.image}>
              <div className={frameClass(tone)}>
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
      </article>
    );
  }

  if (slug === "parkhub") {
    return (
      <article>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">{PARKHUB_NOTE.title}</h1>
        <p className="mt-2 text-xs text-muted-foreground">{PARKHUB_NOTE.meta}</p>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-foreground">{PARKHUB_NOTE.summary}</p>
      </article>
    );
  }

  return null;
}
