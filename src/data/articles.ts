interface ArticleContent {
  title: string;
  tag: string;
  summary: string;
  sections: { title: string; text: string }[];
  order?: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  cover?: string | null;
  coverAlt?: string | null;
}
const modules = import.meta.glob<{ default: ArticleContent }>('./articles/*.json', { eager: true });
export const articles = Object.entries(modules).map(([path, module]) => ({
  ...module.default, slug: path.split('/').pop()!.replace(/\.json$/, ''),
})).sort((a,b)=>(a.order ?? 1000)-(b.order ?? 1000) || a.slug.localeCompare(b.slug));
