export type Article = {
  slug: string;
  date: string;
  tag: string;
  headline: string;
  body: string[];
};

const PLACEHOLDER = [
  "Placeholder article text. Replace this with the full story: what happened, who was involved and why it matters for the lab and its community.",
  "A second paragraph gives room for context, quotes from lab members and links to related work, papers or code.",
];

export const ARTICLES: Article[] = [
  {
    slug: "new-masters-students-coming-intake",
    date: "2026.09",
    tag: "Announcement",
    headline: "New Master's students for the coming intake",
    body: [
      "Doan Phuong Anh Pham and Hoang Long Nguyen are the newest members of ICML Lab, joining us as Master's students in Computer Science.",
      "ICML Lab is a research group led by Prof. Zengchang Qin at VinUniversity. We explore the foundations and applications of artificial intelligence and machine learning, with a particular interest in how intelligent systems learn, reason, interact, and behave in complex environments.",
      "Doan Phuong Anh Pham joins through CAIR and Hoang Long Nguyen through CECS. Both will work alongside our PhD students, research engineers and undergraduate researchers, taking part in reading groups, weekly seminars and ongoing projects across the lab.",
      "Over the coming semesters they will develop their own research directions under Prof. Qin's supervision, and we look forward to sharing their progress here.",
      "Please join us in giving them a warm welcome.",
    ],
  },
  {
    slug: "paper-accepted",
    date: "2026.09",
    tag: "Publication",
    headline: "Paper accepted at a top-tier machine learning conference",
    body: PLACEHOLDER,
  },
  {
    slug: "open-positions",
    date: "2026.07",
    tag: "Opening",
    headline: "New PhD and MSc positions open for the coming intake",
    body: PLACEHOLDER,
  },
  {
    slug: "ai-workshop",
    date: "2026.05",
    tag: "Event",
    headline: "Lab members present at an international AI workshop",
    body: PLACEHOLDER,
  },
  {
    slug: "toolkit-release",
    date: "2026.03",
    tag: "Release",
    headline: "Open-source release of our latest research toolkit",
    body: PLACEHOLDER,
  },
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
