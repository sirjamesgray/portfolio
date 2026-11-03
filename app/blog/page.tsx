import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Rss } from "lucide-react";
import { CareerShell } from "@/components/career-shell";
import { SectionHead } from "@/components/section-head";
import { draftsVisible, formatDate, getPosts } from "@/lib/blog";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog | Jamie Gray",
  description: "Notes on building software, design to code, and working with AI agents.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: "Jamie Gray Blog" }] } },
  openGraph: { title: "Blog | Jamie Gray", description: "Notes on building software, design to code, and working with AI agents.", url: "/blog", type: "website" },
};

export default function BlogIndex() {
  const posts = getPosts();
  const showDrafts = draftsVisible();
  return (
    <CareerShell width="max-w-3xl">
      <SectionHead index="07" title="Blog" as="h1" />
      <p className={styles.lede}>Notes on building software, moving from design to code, and working with AI agents.</p>
      <Link href="/blog/rss.xml" className={styles.link}>
        <Rss className="h-4 w-4" aria-hidden="true" /> RSS feed
      </Link>
      {showDrafts && posts.some((p) => p.draft) ? (
        <p className={styles.notice}>Preview mode: draft posts are visible here. They stay hidden in production.</p>
      ) : null}
      {posts.length === 0 ? (
        <p className={styles.lede}>New posts are on the way.</p>
      ) : (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className={styles.item}>
                {post.cover ? (
                  <Image src={post.cover.src} alt="" width={post.cover.width} height={post.cover.height} sizes="(max-width: 768px) 100vw, 720px" className={styles.cardCover} />
                ) : null}
                <span className={styles.meta}>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span>{post.minutes} min read</span>
                  {post.draft ? <span className={styles.badge}>Draft</span> : null}
                </span>
                <span className={styles.itemTitle}>{post.title}</span>
                <span className="text-sm text-muted-foreground">{post.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </CareerShell>
  );
}
