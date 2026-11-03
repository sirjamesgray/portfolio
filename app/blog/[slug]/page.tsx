import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
  return {
    title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}`, types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: "Jamie Gray Blog" }] } },
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: { title, description: post.description, url: `/blog/${post.slug}`, type: "article", publishedTime: post.date, authors: ["Jamie Gray"], tags: post.tags },
    twitter: { card: "summary_large_image", title, description: post.description },
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
        <div className={styles.prose} dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </CareerShell>
  );
}
