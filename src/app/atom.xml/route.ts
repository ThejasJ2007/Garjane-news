import { NextResponse } from 'next/server';
import { getLatestArticles } from '@/lib/data';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://garjanenews.com';

  let articles: Awaited<ReturnType<typeof getLatestArticles>> = [];
  try {
    articles = await getLatestArticles(50);
  } catch {
    articles = [];
  }

  const siteTitle = 'Garjane News Nelamangala';
  const siteDescription =
    'Your trusted source for local news in Nelamangala and surrounding areas. Breaking news, politics, sports, entertainment, and more in Kannada and English.';
  const updated = articles[0]?.publishedAt
    ? new Date(articles[0].publishedAt).toISOString()
    : new Date().toISOString();

  const entries = articles
    .map((article) => {
      const articleUrl = `${baseUrl}/article/${article.slug}`;
      const published = article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : new Date().toISOString();
      const updatedTime = article.updatedAt
        ? new Date(article.updatedAt).toISOString()
        : published;
      const summary =
        article.summaryKn || article.summary || article.excerptKn || article.excerpt || '';
      const authorName = article.author?.name || 'Garjane News Desk';

      const categories = [
        article.category ? `<category term="${escapeXml(article.category.name)}" label="${escapeXml(article.category.nameKn || article.category.name)}" />` : '',
        ...(article.tags || []).map((t) => `<category term="${escapeXml(t.tag.name)}" />`),
      ]
        .filter(Boolean)
        .join('\n      ');

      return `  <entry>
    <id>${articleUrl}</id>
    <title>${escapeXml(article.headlineKn || article.headline)}</title>
    <link rel="alternate" type="text/html" href="${articleUrl}" />
    <published>${published}</published>
    <updated>${updatedTime}</updated>
    <author>
      <name>${escapeXml(authorName)}</name>
    </author>
    <summary type="text">${escapeXml(summary)}</summary>
    ${categories ? `${categories}` : ''}
  </entry>`;
    })
    .join('\n');

  const atomFeed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="kn-IN">
  <id>${baseUrl}/</id>
  <title>${escapeXml(siteTitle)}</title>
  <subtitle>${escapeXml(siteDescription)}</subtitle>
  <link rel="self" type="application/atom+xml" href="${baseUrl}/atom.xml" />
  <link rel="alternate" type="text/html" href="${baseUrl}" />
  <updated>${updated}</updated>
  <logo>${baseUrl}/icon-192.png</logo>
  <icon>${baseUrl}/favicon.svg</icon>
${entries}
</feed>`;

  return new NextResponse(atomFeed, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
