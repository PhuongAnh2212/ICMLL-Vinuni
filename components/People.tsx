"use client";

import { useState } from "react";
import { Title } from "./Sections";

type Person = {
  name: string;
  role: string;
  unit: string;
  bio: string;
  interests: string[];
  photo?: string;
  pos: React.CSSProperties;
};

const BIO = "Short biography goes here — background, current focus and selected achievements. Replace this placeholder with the member's own words.";
const LINKS = ["Email", "Google Scholar", "GitHub", "LinkedIn"]; // TODO: per-person URLs

// Drop portraits in /public/people and set `photo: "/people/xxx.jpg"`.
const PEOPLE: Person[] = [
  { name: "Zengchang Qin", role: "Principal Investigator", unit: "", bio: BIO, interests: ["Machine Learning", "Medical AI", "Multimodal AI"], pos: { right: 0, top: 0, width: "34%" } },
  { name: "Hoang Long, Nguyen", role: "Master Student, Computer Science", unit: "CECS", bio: BIO, interests: ["Computer Vision", "Deep Learning"], pos: { left: "8%", top: "22%", width: "20%" } },
  { name: "Doan Phuong Anh, Pham", role: "Master Student, Computer Science", unit: "CAIR", bio: BIO, interests: ["Multimodal AI", "NLP"], pos: { right: "8%", top: "42%", width: "22%" } },
  { name: "Van Duy Anh, Nguyen", role: "Undergrad Student, Business", unit: "CECS", bio: BIO, interests: ["AI for Business", "Data Analytics"], pos: { left: "-4%", top: "62%", width: "23%" } },
];

const initials = (n: string) =>
  n.replace(",", "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("");

export default function People() {
  const [hot, setHot] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (i: number) => setOpen((o) => (o === i ? null : i));

  return (
    <section id="people" className="section people">
      <div className="people-head">
        <Title lines={["People"]} />
        <p data-reveal="up">
          We explore the foundations and applications of artificial intelligence and machine learning, with a
          particular interest in how intelligent systems learn, reason, interact, and behave in complex
          environments.
        </p>
      </div>

      <div className="people-body">
        <ul className="plist" onPointerLeave={() => setHot(null)}>
          {PEOPLE.map((p, i) => (
            <li key={p.name} data-reveal="up" className={open === i ? "open" : ""}>
              <button
                type="button"
                className={`prow${hot === i || open === i ? " hot" : ""}`}
                aria-expanded={open === i}
                aria-controls={`profile-${i}`}
                onClick={() => toggle(i)}
                onPointerEnter={() => setHot(i)}
              >
                <span className="prow-text">
                  <span className="pname">{p.name}</span>
                  <span className="prole">
                    {p.role}
                    {p.unit && (
                      <>
                        <br />
                        {p.unit}
                      </>
                    )}
                  </span>
                </span>
                <span className="plus" aria-hidden>+</span>
              </button>

              <div id={`profile-${i}`} className="pprofile" role="region" aria-label={`${p.name} profile`}>
                <div className="pprofile-in">
                  <p className="pbio">{p.bio}</p>
                  <div className="ptags">
                    {p.interests.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <div className="plinks">
                    {LINKS.map((l) => (
                      <a key={l} href="#people" onClick={(e) => e.preventDefault()}>
                        {l} <span aria-hidden>↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className={`photos${hot !== null ? " dim" : ""}`}>
          {PEOPLE.map((p, i) => (
            <div key={p.name} className="photo-pos" style={p.pos}>
              <div
                className={`photo${hot === i || open === i ? " hot" : ""}`}
                onClick={() => toggle(i)}
                onPointerEnter={() => setHot(i)}
                onPointerLeave={() => setHot(null)}
              >
                {p.photo ? <img src={p.photo} alt={p.name} /> : <span>{initials(p.name)}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
