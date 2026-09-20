import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Motion from "@/components/Motion";
import Ready from "@/components/Ready";
import { Footer } from "@/components/Sections";
import { ARTICLES, getArticle } from "@/lib/news";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getArticle((await params).slug);
  return a ? { title: `${a.headline} — ICMLL`, description: a.body[0] } : {};
}

export default async function NewsArticle({ params }: Props) {
  const a = getArticle((await params).slug);
  if (!a) notFound();

  return (
    <div className="page page-grey">
      <Ready />
      <Nav current="news" />

      <main className="post">
        <Link href="/#news" className="post-back">← News</Link>
        <time className="post-date">{a.date}</time>
        <h1 className="post-title">
          <span>{a.headline}</span>
        </h1>
        <div className="post-body">
          {a.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </main>

      <Footer />
      <Motion />
    </div>
  );
}
