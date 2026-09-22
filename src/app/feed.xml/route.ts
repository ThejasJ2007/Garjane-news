import { NextResponse } from 'next/server';
import { getLatestArticles } from '@/lib/data';

export const dynamic = 'force-dynamic';

function escapeCdata(text: string): string {
  return text.replace(/]]>/g, ']]&gt;');
}

function imageMimeType(url: string): string {
  const ext = url.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'image/jpeg';
  }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://garjanenews.com';

  let articles = [] as Awaited<ReturnType<typeof getLatestArticles>>;
  try {
    articles = await getLatestArticles(50);
  } catch {
    // Fallback data is already applied inside getLatestArticles; keep a safe default
    articles = [];
  }

  const siteTitle = 'Garjane News Nelamangala';
  const siteDescription =
    'Your trusted source for local news in Nelamangala and surrounding areas. Breaking news, politics, sports, entertainment, and more in Kannada and English.';
  const siteLanguage = 'kn-IN';

  const rssItems = articles
    .map((article) => {
      const articleUrl = `${baseUrl}/article/${article.slug}`;
      const pubDate = article.publishedAt
        ? new Date(article.publishedAt).toUTCString()
        : new Date().toUTCString();

      const description =
        article.summaryKn || article.summary || article.excerptKn || article.excerpt || '';
      const tagNames = (article.tags || []).map((t) => t.tag.name).join(', ');

      return `<item>
      <title><![CDATA[${escapeCdata(article.headlineKn || article.headline)}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description><![CDATA[${escapeCdata(description)}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${article.category ? `<category><![CDATA[${escapeCdata(article.category.name)}]]></category>` : ''}
      ${tagNames ? `<category><![CDATA[${escapeCdata(tagNames)}]]></category>` : ''}
      ${article.featuredImage ? `<enclosure url="${article.featuredImage}" type="${imageMimeType(article.featuredImage)}" />` : ''}
      ${article.author ? `<author>${article.author.name}</author>` : ''}
    </item>`;
    })
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title><![CDATA[${siteTitle}]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[${siteDescription}]]></description>
    <language>${siteLanguage}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/favicon.svg</url>
      <title><![CDATA[${siteTitle}]]></title>
      <link>${baseUrl}</link>
    </image>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
