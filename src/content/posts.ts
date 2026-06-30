/* =============================================================================
   Blog content. Add posts here — the index and post pages render from this
   array, so a new entry needs no routing or component work. `body` is an array
   of paragraphs (kept dependency-free; swap for MDX later if you want rich
   formatting).
   ============================================================================= */

export type Post = {
  slug: string;
  title: string;
  date: string; // ISO, e.g. '2026-06-23'
  readingMinutes: number;
  excerpt: string;
  body: string[];
};

export const POSTS: Post[] = [
  {
    slug: 'retrofit-not-replace',
    title: 'Why we retrofit the lab instead of rebuilding it',
    date: '2026-06-23',
    readingMinutes: 4,
    excerpt:
      'Every other self-driving lab asks you to start over. We think the lab you already run is the asset — and the missing piece is memory, not robots.',
    body: [
      'The dominant story about autonomous science is a sealed box: a greenfield robotic cell, bought whole, that runs experiments without you. It photographs well. It also asks a working lab to throw away the instruments, the integrations, and the hard-won habits it already depends on.',
      'We started Contineon from the opposite premise. The lab you run today is the asset. Your instruments work. Your scientists know things no model does. What is missing is not hardware — it is memory, and an autonomy layer that respects the bench.',
      'So Atlas retrofits. It plans a campaign toward your objective, executes the steps it can, and pauses for the steps that still need hands. When it pauses, a scientist returns a result — a TLC read, a CSV, a note — and the run resumes from exactly where it stopped. Correct a tool call once, and that correction becomes signal.',
      'The compounding part is the point. Most labs discard their most expensive knowledge at the end of a campaign. Atlas keeps it: recipes, failure modes, supplier quirks, the lore that lives in people’s heads. The next campaign starts from what the last one learned, in your lab, for your targets.',
      'That is the whole thesis: retrofit, don’t replace. Give the lab a memory, keep the human in the loop, and let every run make the next one smarter.',
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  // Stable, locale-light formatting (avoids hydration / SSR drift).
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[(m ?? 1) - 1]} ${d}, ${y}`;
}
