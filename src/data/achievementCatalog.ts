export type ArchiveRecord = {
  result: string;
  title: string;
  year: string;
};

export type AchievementCatalogItem = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  statistic: string;
  records: ArchiveRecord[];
};

export const achievementCatalog: AchievementCatalogItem[] = [
  {
    slug: "robotics",
    number: "01",
    title: "Robotics",
    summary: "Mechanical systems, fast iteration, and international stages from Indonesia to Taiwan.",
    statistic: "63 archive images / 2 results",
    records: [
      { result: "Silver Medalist", title: "International World GreenMech Robotics Contest", year: "2023" },
      { result: "Gold Medalist", title: "National GreenMech Robotics Competition", year: "2023" },
    ],
  },
  {
    slug: "informatics",
    number: "02",
    title: "Informatics",
    summary: "Competitive programming, artificial intelligence, and algorithmic problem solving under pressure.",
    statistic: "50 archive images / 15 results",
    records: [
      { result: "Top 10", title: "hAIppy AIRENA Artificial Intelligence Competition", year: "2025" },
      { result: "2nd Place", title: "Impact 5.0 ITB - Top Informatics Rank", year: "2025" },
      { result: "Absolute Winner", title: "Informatics Indonesia Regional Competition", year: "2025" },
      { result: "Absolute Winner", title: "Informatics Olimpiade Sains Harkadinas", year: "2025" },
      { result: "Absolute Winner", title: "Informatics OSPO & TO UTBK", year: "2025" },
      { result: "Gold Medalist", title: "Informatics Senior High School Olympiad", year: "2024" },
      { result: "1st Runner Up", title: "Falcon Competitive Programming Competition", year: "2024" },
      { result: "2nd Place", title: "Competitive Programming Dinamik-19 UPI", year: "2024" },
      { result: "3rd Place", title: "Competitive Programming P2S1 XXVIII", year: "2025" },
      { result: "1st Place", title: "Computational Logic Competition IFest", year: "2023" },
      { result: "3rd Place", title: "Sutomo 1 Programming Competition CALC", year: "2023" },
      { result: "Gold Medalist", title: "News Junior Olympiad IV Mathematics", year: "2022" },
      { result: "2nd Place", title: "Race of Brains - Zeta Institute", year: "2022" },
      { result: "2nd Place", title: "Race of Brains DISEC 5.0", year: "2022" },
      { result: "1st Place", title: "School of Champions", year: "2024" },
    ],
  },
  {
    slug: "business-idea",
    number: "03",
    title: "Business Idea",
    summary: "Turning research and product thinking into concise, judged proposals with a reason to exist.",
    statistic: "8 archive images / 4 results",
    records: [
      { result: "Silver Medalist", title: "World Invention Competition & Exhibition", year: "2024" },
      { result: "1st Place", title: "Business Idea Competition P2S1 XXVIII", year: "2025" },
      { result: "3rd Place", title: "Business Idea Competition Optimus", year: "2026" },
      { result: "Gold Medalist", title: "CHIPS UNPAR", year: "2024" },
    ],
  },
  {
    slug: "business-simulation",
    number: "04",
    title: "Business Simulation",
    summary: "Team decisions made against live markets: pricing, inventory, finance, and strategy in motion.",
    statistic: "120 archive images / 8 results",
    records: [
      { result: "Indonesia Delegate", title: "International MERMC - Retail Category", year: "2024" },
      { result: "2nd Runner Up", title: "MERMC Indonesian Final", year: "2024" },
      { result: "1st Place", title: "MonsoonSIM Petra League", year: "2025" },
      { result: "1st Runner Up", title: "MonsoonSIM Business Competition", year: "2025" },
      { result: "2nd Runner Up", title: "MonsoonSIM TeenBiz Championship", year: "2025" },
      { result: "2nd Place", title: "Parahyangan Accounting Tournament for High School XII", year: "2025" },
      { result: "1st Runner Up", title: "MonsoonSIM Business Competition - Retail Edition", year: "2025" },
      { result: "Champion", title: "Business Simulation Eka Prasetya Competition", year: "2025" },
    ],
  },
  {
    slug: "public-speaking",
    number: "05",
    title: "Public Speaking",
    summary: "Clear thinking delivered live: composure, structure, audience connection, and confident leadership.",
    statistic: "20 images + 1 video / 2 results",
    records: [
      { result: "Champion", title: "Speak With Confidence Workshop", year: "2024" },
      { result: "1st Runner Up", title: "Speak With Confidence - Basic Level", year: "2024" },
    ],
  },
];
