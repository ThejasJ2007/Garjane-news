import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleDetail } from '@/components/articles/ArticleDetail';
import { getArticleBySlug, getRelatedArticles, getPreviousNextArticle, getAdvertisements } from '@/lib/data';

export const dynamic = 'force-dynamic';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  return {
    title: article.headlineKn || article.headline,
    description: article.seoDescription || article.summaryKn || article.summary || article.excerptKn || article.excerpt || undefined,
    keywords: article.seoKeywords,
    openGraph: {
      title: article.headlineKn || article.headline,
      description: article.seoDescription || article.summaryKn || article.summary || article.excerptKn || article.excerpt || undefined,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author.name],
      images: article.featuredImage ? [{ url: article.featuredImage, alt: article.featuredImageAlt || article.headline }] : [],
      section: article.category.name,
      tags: article.tags.map(t => t.tag.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.headlineKn || article.headline,
      description: article.seoDescription || article.summaryKn || article.summary || article.excerptKn || article.excerpt || undefined,
      images: article.featuredImage ? [article.featuredImage] : [],
    },
    other: {
      'article:published_time': article.publishedAt?.toISOString() || '',
      'article:modified_time': article.updatedAt.toISOString(),
      'article:author': article.author.name,
      'article:section': article.category.name,
      'article:tag': article.tags.map(t => t.tag.name).join(','),
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [related, prevNextActual, articleTopAds, articleMiddleAds, articleBottomAds] = await Promise.all([
    getRelatedArticles(article.id, article.categoryId, 5),
    getPreviousNextArticle(article.id, article.categoryId, article.publishedAt || new Date()),
    getAdvertisements('article-top'),
    getAdvertisements('article-middle'),
    getAdvertisements('article-bottom'),
  ]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.headlineKn || article.headline,
    description: article.seoDescription || article.summaryKn || article.summary || article.excerptKn || article.excerpt,
    image: article.featuredImage ? [article.featuredImage] : [],
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: `/author/${article.author.id}`,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Garjane News',
      logo: {
        '@type': 'ImageObject',
        url: 'https://garjanenews.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://garjanenews.com/article/${article.slug}`,
    },
    articleSection: article.category.name,
    keywords: article.seoKeywords?.join(', '),
    wordCount: article.content.split(/\s+/).length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="w-full">
        <ArticleDetail
          article={article}
          relatedArticles={related}
          previousArticle={prevNextActual.previous}
          nextArticle={prevNextActual.next}
          advertisements={{
            top: articleTopAds,
            middle: articleMiddleAds,
            bottom: articleBottomAds,
          }}
        />
      </div>
    </>
  );
}