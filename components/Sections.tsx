import Link from "next/link";
import Socials from "./Socials";
import { ARTICLES } from "@/lib/news";

export function Title({ lines, xl = false }: { lines: string[]; xl?: boolean }) {
  return (
    <h2 className={`h2${xl ? " h2-xl" : ""}`} data-reveal="title">
      <span className="title-block">
        {lines.map((l) => (
          <span key={l} className="title-text">{l}</span>
        ))}
      </span>
    </h2>
  );
}

// ---------------------------------------------------------------- About
export function About() {
  return (
    <section id="about" className="section">
      <Title lines={["About"]} />
      <div className="about-grid">
        <p className="lead" data-reveal="up">
          ICML Lab is a research group led by Prof. Zengchang Qin at VinUniversity.
        </p>
        <div className="card about-card" data-reveal="up">
          <p>
            We explore the foundations and applications of artificial intelligence and machine learning, with a
            particular interest in how intelligent systems learn, reason, interact, and behave in complex
            environments.
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- News
export function News() {
  return (
    <section id="news" className="section">
      <Title lines={["News"]} />
      <ul className="news">
        {ARTICLES.map((a) => (
          <li key={a.slug} data-reveal="up">
            <Link href={`/news/${a.slug}`} className="news-row">
              <time>{a.date}</time>
              <span className="news-title">{a.headline}</span>
              <span className="tag">{a.tag}</span>
              <span className="arrow" aria-hidden>↗</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// -------------------------------------------------------------- Footer
export function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-top">
        <p className="footer-name" data-reveal="up">
          ICML
          <br />
          Lab<sup>©</sup>
        </p>
        <div className="footer-cols" data-reveal="up">
          <p>
            Intelligent Computing &amp; Machine Learning Lab — a research group led by Prof. Zengchang Qin at
            VinUniversity.
          </p>
          <p>
            Foundations and applications of AI and machine learning, and how intelligent systems learn, reason,
            interact and behave.
          </p>
        </div>
      </div>

      <div className="footer-mid" data-reveal="up">
        <p>Get in touch —<br /><a href="mailto:lab@example.edu">lab@example.edu</a></p>
        <Socials className="socials-light" />
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Intelligent Computing &amp; Machine Learning Lab</span>
        <Link href="/#home">Back to top ↑</Link>
      </div>
    </footer>
  );
}
