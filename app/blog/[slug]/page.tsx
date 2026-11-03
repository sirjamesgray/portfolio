import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { BlogFigure } from "@/components/blog-figure";
import { CareerShell } from "@/components/career-shell";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import styles from "../blog.module.css";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const title = `${post.title} | Jamie Gray`;
  const images = post.cover ? [{ url: post.cover.src, width: post.cover.width, height: post.cover.height, alt: post.cover.alt }] : undefined;
  return {
    title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}`, types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: "Jamie Gray Blog" }] } },
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: { title, description: post.description, url: `/blog/${post.slug}`, type: "article", publishedTime: post.date, authors: ["Jamie Gray"], tags: post.tags, ...(images ? { images } : {}) },
    twitter: { card: "summary_large_image", title, description: post.description, ...(images ? { images: [images[0].url] } : {}) },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <CareerShell width="max-w-3xl">
      <article>
        <Link href="/blog" className={styles.link}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All posts
        </Link>
        <div className={`${styles.meta} mt-4`}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.minutes} min read</span>
          {post.draft ? <span className={styles.badge}>Draft</span> : null}
        </div>
        <h1 className={styles.postTitle}>{post.title}</h1>
        {post.description ? <p className={styles.lede}>{post.description}</p> : null}
        {post.draft ? <p className={styles.notice}>Draft: this post holds example placeholder text. It is not final.</p> : null}
        {post.cover ? (
          <Image src={post.cover.src} alt={post.cover.alt} width={post.cover.width} height={post.cover.height} priority sizes="(max-width: 768px) 100vw, 720px" className={styles.cover} />
        ) : null}
        <div className={styles.prose}>
          {post.blocks.map((block, i) =>
            block.type === "html" ? (
              <div key={i} className={styles.proseChunk} dangerouslySetInnerHTML={{ __html: block.html }} />
            ) : (
              <BlogFigure key={i} src={block.src} alt={block.alt} caption={block.caption} width={block.width} height={block.height} />
            ),
          )}
        </div>
      </article>
    </CareerShell>
  );
}
