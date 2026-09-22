import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Garjane News database...');

  // 1. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      siteName: 'Garjane News',
      // BRAND RULE: "Garjane News" is never translated — the Kannada field intentionally stores the same Latin-script brand name.
      siteNameKn: 'Garjane News',
      tagline: 'Your Local News, Your Voice',
      taglineKn: 'ನಿಮ್ಮ ಊರಿನ ಸುದ್ದಿ, ನಿಮ್ಮ ಧ್ವನಿ',
      description: 'Garjane News brings the latest breaking news, local updates, and investigative reporting from Nelamangala and Karnataka.',
      descriptionKn: 'ನೆಲಮಂಗಲ ಹಾಗೂ ಕರ್ನಾಟಕದ ಪ್ರಮುಖ, ನಿಖರ ಹಾಗೂ ವಸ್ತುನಿಷ್ಠ ಸುದ್ದಿ ತಾಣ.',
      defaultLanguage: 'kn',
      supportedLanguages: ['kn', 'en'],
      socialLinks: {
        facebook: 'https://facebook.com/garjanenews',
        twitter: 'https://twitter.com/garjanenews',
        instagram: 'https://instagram.com/garjanenews',
        youtube: 'https://www.youtube.com/@GarjaneNews1',
        email: 'v4news@gmail.com',
        phone: '9019987639 / 9743519979',
      },
    },
  });

  // 2. Users
  const adminPasswordHash = await bcrypt.hash('Admin@Garjane2026!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@garjanenews.com' },
    update: {},
    create: {
      email: 'admin@garjanenews.com',
      passwordHash: adminPasswordHash,
      name: 'Garjane Admin',
      role: 'ADMIN',
      bio: 'Chief Administrator & Publisher',
      bioKn: 'ಮುಖ್ಯ ಆಡಳಿತಾಧಿಕಾರಿ',
      location: 'Nelamangala, Bengaluru',
    },
  });

  const reporterPasswordHash = await bcrypt.hash('Reporter@Garjane2026!', 12);
  const reporterUser = await prisma.user.upsert({
    where: { email: 'reporter@garjanenews.com' },
    update: {},
    create: {
      email: 'reporter@garjanenews.com',
      passwordHash: reporterPasswordHash,
      name: 'ರಮೇಶ್ ಗೌಡ',
      role: 'REPORTER',
      bio: 'Senior Ground Reporter, Nelamangala & Bengaluru Rural',
      bioKn: 'ಹಿರಿಯ ವರದಿಗಾರರು, ನೆಲಮಂಗಲ ಮತ್ತು ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ',
      location: 'Nelamangala',
    },
  });

  await prisma.reporter.upsert({
    where: { userId: reporterUser.id },
    update: {},
    create: {
      userId: reporterUser.id,
      beat: 'Local Politics & Infrastructure',
      specialization: ['ನೆಲಮಂಗಲ', 'ರೈತರು', 'ಸಂಚಾರ'],
      isVerified: true,
    },
  });

  // 3. Categories
  const categories = [
    { name: 'Nelamangala', nameKn: 'ನೆಲಮಂಗಲ', slug: 'nelamangala', color: '#DC2626', icon: 'MapPin', displayOrder: 1 },
    { name: 'Karnataka', nameKn: 'ಕರ್ನಾಟಕ', slug: 'karnataka', color: '#D97706', icon: 'Landmark', displayOrder: 2 },
    { name: 'Bengaluru', nameKn: 'ಬೆಂಗಳೂರು', slug: 'bengaluru', color: '#2563EB', icon: 'Building2', displayOrder: 3 },
    { name: 'Politics', nameKn: 'ರಾಜಕೀಯ', slug: 'politics', color: '#7C3AED', icon: 'Vote', displayOrder: 4 },
    { name: 'Crime', nameKn: 'ಅಪರಾಧ', slug: 'crime', color: '#991B1B', icon: 'ShieldAlert', displayOrder: 5 },
    { name: 'Sports', nameKn: 'ಕ್ರೀಡೆ', slug: 'sports', color: '#059669', icon: 'Trophy', displayOrder: 6 },
    { name: 'Cinema', nameKn: 'ಸಿನೆಮಾ', slug: 'entertainment', color: '#DB2777', icon: 'Film', displayOrder: 7 },
    { name: 'Business', nameKn: 'ವ್ಯಾಪಾರ', slug: 'business', color: '#0D9488', icon: 'TrendingUp', displayOrder: 8 },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        nameKn: cat.nameKn,
        slug: cat.slug,
        color: cat.color,
        icon: cat.icon,
        displayOrder: cat.displayOrder,
        isActive: true,
        isFeatured: true,
      },
    });
    categoryMap.set(cat.slug, record.id);
  }

  // 4. Locations
  const locations = [
    { name: 'Nelamangala', nameKn: 'ನೆಲಮಂಗಲ', slug: 'nelamangala', type: 'taluk', displayOrder: 1 },
    { name: 'Bengaluru Rural', nameKn: 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ', slug: 'bengaluru-rural', type: 'district', displayOrder: 2 },
    { name: 'Bengaluru Urban', nameKn: 'ಬೆಂಗಳೂರು ನಗರ', slug: 'bengaluru-urban', type: 'district', displayOrder: 3 },
    { name: 'Tumakuru', nameKn: 'ತುಮಕೂರು', slug: 'tumakuru', type: 'district', displayOrder: 4 },
  ];

  const locationMap = new Map<string, string>();
  for (const loc of locations) {
    const record = await prisma.location.upsert({
      where: { slug: loc.slug },
      update: {},
      create: {
        name: loc.name,
        nameKn: loc.nameKn,
        slug: loc.slug,
        type: loc.type,
        displayOrder: loc.displayOrder,
      },
    });
    locationMap.set(loc.slug, record.id);
  }

  // 5. Tags
  const tagList = [
    { name: 'Nelamangala', nameKn: 'ನೆಲಮಂಗಲ', slug: 'nelamangala' },
    { name: 'Karnataka', nameKn: 'ಕರ್ನಾಟಕ', slug: 'karnataka' },
    { name: 'Expressway', nameKn: 'ಹೆದ್ದಾರಿ', slug: 'expressway' },
    { name: 'Agriculture', nameKn: 'ಕೃಷಿ', slug: 'agriculture' },
  ];
  const tagMap = new Map<string, string>();
  for (const t of tagList) {
    const tagRecord = await prisma.tag.upsert({
      where: { slug: t.slug },
      update: {},
      create: { name: t.name, nameKn: t.nameKn, slug: t.slug },
    });
    tagMap.set(t.slug, tagRecord.id);
  }

  // 6. Menu Items
  const menuItems = [
    { label: 'Home', labelKn: 'ಮುಖಪುಟ', slug: 'home', href: '/', displayOrder: 1 },
    { label: 'Nelamangala', labelKn: 'ನೆಲಮಂಗಲ', slug: 'nelamangala', href: '/category/nelamangala', displayOrder: 2 },
    { label: 'Karnataka', labelKn: 'ಕರ್ನಾಟಕ', slug: 'karnataka', href: '/category/karnataka', displayOrder: 3 },
    { label: 'Politics', labelKn: 'ರಾಜಕೀಯ', slug: 'politics', href: '/category/politics', displayOrder: 4 },
    { label: 'Crime', labelKn: 'ಅಪರಾಧ', slug: 'crime', href: '/category/crime', displayOrder: 5 },
    { label: 'Videos', labelKn: 'ವೀಡಿಯೋಗಳು', slug: 'videos', href: '/video', displayOrder: 6 },
    { label: 'Cinema', labelKn: 'ಸಿನೆಮಾ', slug: 'entertainment', href: '/category/entertainment', displayOrder: 7 },
  ];

  for (const m of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: `menu-${m.slug}` },
      update: {},
      create: {
        id: `menu-${m.slug}`,
        label: m.label,
        labelKn: m.labelKn,
        slug: m.slug,
        href: m.href,
        displayOrder: m.displayOrder,
        isActive: true,
      },
    });
  }

  // 7. Sample Article
  const nelamangalaCatId = categoryMap.get('nelamangala')!;
  const nelamangalaLocId = locationMap.get('nelamangala')!;

  const article = await prisma.article.upsert({
    where: { slug: 'nelamangala-highway-flyover-expansion-approved' },
    update: {},
    create: {
      slug: 'nelamangala-highway-flyover-expansion-approved',
      headline: 'Nelamangala-Tumakuru Expressway Expansion: 6-Lane Elevated Corridor Approved by NHAI',
      headlineKn: 'ನೆಲಮಂಗಲ-ತುಮಕೂರು ಎಕ್ಸ್‌ಪ್ರೆಸ್‌ವೇ ವಿಸ್ತರಣೆ: 6 ಪಥದ ಮೇಲ್ಸೇತುವೆ ಕಾರಿಡಾರ್‌ಗೆ ಕೇಂದ್ರ ಸರ್ಕಾರ ಅನುಮೋದನೆ',
      summary: 'NHAI approves comprehensive plan to ease perpetual traffic choke points at Nelamangala toll gate with new elevated structure.',
      summaryKn: 'ನೆಲಮಂಗಲ ಟೋಲ್ ಬಳಿ ನಿತ್ಯದ ಸಂಚಾರ ದಟ್ಟಣೆಗೆ ಮುಕ್ತಿ ನೀಡಲು ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ ಪ್ರಾಧಿಕಾರದಿಂದ ನೂತನ 6 ಪಥದ ಎಲಿವೇಟೆಡ್ ಕಾರಿಡಾರ್ ನಿರ್ಮಾಣಕ್ಕೆ ಹಸಿರು ನಿಶಾನೆ.',
      content: '<p>ನೆಲಮಂಗಲ: ಬೆಂಗಳೂರು-ತುಮಕೂರು ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ-48 ರ ನೆಲಮಂಗಲ ಜಂಕ್ಷನ್‌ನಲ್ಲಿ ನಿತ್ಯವೂ ಸೃಷ್ಟಿಯಾಗುವ ಸಂಚಾರ ದಟ್ಟಣೆಯನ್ನು ನಿವಾರಿಸಲು ಕೇಂದ್ರ ಹೆದ್ದಾರಿ ಪ್ರಾಧಿಕಾರ (NHAI) ಮಹತ್ವದ ಯೋಜನೆಯನ್ನು ಕೈಗೆತ್ತಿಕೊಂಡಿದೆ.</p>',
      contentKn: '<p>ನೆಲಮಂಗಲ: ಬೆಂಗಳೂರು-ತುಮಕೂರು ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ-48 ರ ನೆಲಮಂಗಲ ಜಂಕ್ಷನ್‌ನಲ್ಲಿ ನಿತ್ಯವೂ ಸೃಷ್ಟಿಯಾಗುವ ಸಂಚಾರ ದಟ್ಟಣೆಯನ್ನು ನಿವಾರಿಸಲು ಕೇಂದ್ರ ಹೆದ್ದಾರಿ ಪ್ರಾಧಿಕಾರ (NHAI) ಮಹತ್ವದ ಯೋಜನೆಯನ್ನು ಕೈಗೆತ್ತಿಕೊಂಡಿದೆ.</p>',
      excerpt: 'NHAI approves comprehensive plan to ease traffic choke points at Nelamangala toll gate.',
      excerptKn: 'ನೆಲಮಂಗಲ ಟೋಲ್ ಬಳಿ ನಿತ್ಯದ ಸಂಚಾರ ದಟ್ಟಣೆಗೆ ಮುಕ್ತಿ ನೀಡಲು ನೂತನ 6 ಪಥದ ಎಲಿವೇಟೆಡ್ ಕಾರಿಡಾರ್.',
      featuredImage: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=1200&auto=format&fit=crop&q=80',
      featuredImageAlt: 'Nelamangala Highway',
      status: 'PUBLISHED',
      breakingLevel: 'BREAKING',
      isFeatured: true,
      isEditorPick: true,
      viewCount: 1540,
      readTime: 3,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: nelamangalaCatId,
      locationId: nelamangalaLocId,
      seoTitle: 'ನೆಲಮಂಗಲ ಹೆದ್ದಾರಿ ವಿಸ್ತರಣೆ',
      seoDescription: 'ನೆಲಮಂಗಲ ಹೆದ್ದಾರಿ ಮೇಲ್ಸೇತುವೆ ಮಂಜೂರು',
      seoKeywords: ['Nelamangala', 'Highway'],
    },
  });

  // 8. Breaking News entry
  await prisma.breakingNews.upsert({
    where: { id: 'seed-breaking-1' },
    update: {},
    create: {
      id: 'seed-breaking-1',
      headline: 'Nelamangala Highway 6-Lane Corridor Approved: Work to Commence Shortly',
      headlineKn: 'ನೆಲಮಂಗಲ-ತುಮಕೂರು ಹೆದ್ದಾರಿ 6 ಪಥದ ಮೇಲ್ಸೇತುವೆ ಕಾಮಗಾರಿಗೆ ಕೇಂದ್ರದ ಅನುಮೋದನೆ',
      articleId: article.id,
      level: 'BREAKING',
      isActive: true,
      startsAt: new Date(),
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
