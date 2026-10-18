export type Language = 'kn' | 'en';

export interface Translations {
  common: {
    brandName: string;
    readMore: string;
    viewAll: string;
    share: string;
    copyLink: string;
    copied: string;
    bookmark: string;
    views: string;
    minRead: string;
    breaking: string;
    live: string;
    featured: string;
    editorPick: string;
    reporter: string;
    author: string;
    published: string;
    updated: string;
    ad: string;
    error: string;
    tryAgain: string;
    noImage: string;
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  };
  nav: {
    brandName: string;
    home: string;
    nelamangala: string;
    karnataka: string;
    bengaluru: string;
    politics: string;
    crime: string;
    sports: string;
    cinema: string;
    videos: string;
    signIn: string;
    getStarted: string;
    dashboard: string;
    profile: string;
    signOut: string;
    search: string;
    menu: string;
    close: string;
    switchLang: string;
    lightMode: string;
    darkMode: string;
  };
  home: {
    heroHeading: string;
    editorsPicks: string;
    editorsPicksDesc: string;
    breakingNews: string;
    latestNews: string;
    latestNewsDesc: string;
    trendingNow: string;
    mostRead: string;
    videoReports: string;
    videoReportsDesc: string;
    photoGalleries: string;
    photoGalleriesDesc: string;
    stayUpdated: string;
    newsletterDesc: string;
    emailPlaceholder: string;
    subscribe: string;
    subscribedSuccess: string;
    invalidEmail: string;
  };
  article: {
    language: string;
    fontSize: string;
    comments: string;
    leaveComment: string;
    commentPlaceholder: string;
    submitComment: string;
    submitting: string;
    commentSuccess: string;
    commentError: string;
    commentsClosed: string;
    previousArticle: string;
    nextArticle: string;
    relatedArticles: string;
    liveUpdates: string;
    photoGallery: string;
    media: string;
    images: string;
    videos: string;
    photosCount: string;
    reporterBioDefault: string;
  };
  footer: {
    company: string;
    editorial: string;
    legal: string;
    forYou: string;
    contactUs: string;
    aboutUs: string;
    contact: string;
    editorialPolicy: string;
    ethicsStandards: string;
    correctionsPolicy: string;
    lettersToEditor: string;
    privacyPolicy: string;
    termsOfService: string;
    advertiseWithUs: string;
    newsletter: string;
    photoGalleries: string;
    videos: string;
    rightsReserved: string;
    websiteDeveloper: string;
    webDeveloperTitle: string;
    designedAndDevelopedBy: string;
    privacy: string;
    terms: string;
    sitemap: string;
    followUsOn: string;
    subscribeOn: string;
    taglineDefault: string;
    addressDefault: string;
  };
  search: {
    title: string;
    subtitle: string;
    placeholder: string;
    searchBtn: string;
    popularTopics: string;
    resultsFor: string;
    noResultsFound: string;
    tryDifferentKeywords: string;
  };
  sort: {
    sortBy: string;
    latestFirst: string;
    mostViewed: string;
    shortestRead: string;
  };
  emptyState: {
    noNewsTitle: string;
    noNewsDesc: string;
    noArticlesTitle: string;
    noArticlesDesc: string;
    noResultsTitle: string;
    noResultsDesc: string;
    noPhotosTitle: string;
    noPhotosDesc: string;
    noVideosTitle: string;
    noVideosDesc: string;
    noDataTitle: string;
    noDataDesc: string;
  };
  theme: {
    theme: string;
    light: string;
    dark: string;
    system: string;
    selectTheme: string;
  };
  auth: {
    signIn: string;
    signInTitle: string;
    signInSubtitle: string;
    signInRoleDesc: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    rememberMe: string;
    forgotPassword: string;
    signInButton: string;
    signingIn: string;
    newUserPrompt: string;
    createAccount: string;
    forgotPasswordTitle: string;
    forgotPasswordSubtitle: string;
    sendResetLink: string;
    sendingResetLink: string;
    resetLinkSentTitle: string;
    resetLinkSentDesc: string;
    backToSignIn: string;
    resetPasswordTitle: string;
    resetPasswordSubtitle: string;
    newPassword: string;
    confirmPassword: string;
    saveNewPassword: string;
    savingNewPassword: string;
    passwordResetSuccessTitle: string;
    passwordResetSuccessDesc: string;
    signInWithNewPassword: string;
    invalidLinkTitle: string;
    invalidLinkDesc: string;
    requestNewLink: string;
    passwordsDoNotMatch: string;
    passwordTooShort: string;
    invalidEmail: string;
    connectionError: string;
    showPassword: string;
    hidePassword: string;
  };
}

export const translations: Record<Language, Translations> = {
  kn: {
    common: {
      brandName: 'ಗರ್ಜನೆ ನ್ಯೂಸ್',
      readMore: 'ಮತ್ತಷ್ಟು ಓದಿ',
      viewAll: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ',
      share: 'ಹಂಚಿಕೊಳ್ಳಿ:',
      copyLink: 'ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಿ',
      copied: 'ಕಾಪಿ ಮಾಡಲಾಗಿದೆ',
      bookmark: 'ಬುಕ್‌ಮಾರ್ಕ್',
      views: 'ವೀಕ್ಷಣೆಗಳು',
      minRead: 'ನಿಮಿಷ ಓದುವಿಕೆ',
      breaking: 'ಬ್ರೇಕಿಂಗ್',
      live: 'ನೇರ ಪ್ರಸಾರ',
      featured: 'ವಿಶೇಷ',
      editorPick: 'ಸಂಪಾದಕರ ಆಯ್ಕೆ',
      reporter: 'ವರದಿಗಾರ:',
      author: 'ಲೇಖಕರು:',
      published: 'ಪ್ರಕಟಣೆ:',
      updated: 'ಪರಿಷ್ಕೃತ:',
      ad: 'ಜಾಹೀರಾತು',
      error: 'ದೋಷ ಸಂಭವಿಸಿದೆ',
      tryAgain: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
      noImage: 'ಚಿತ್ರವಿಲ್ಲ',
      justNow: 'ಈಗಷ್ಟೇ',
      minutesAgo: 'ನಿಮಿಷಗಳ ಹಿಂದೆ',
      hoursAgo: 'ಗಂಟೆಗಳ ಹಿಂದೆ',
      daysAgo: 'ದಿನಗಳ ಹಿಂದೆ',
    },
    nav: {
      brandName: 'ಗರ್ಜನೆ ನ್ಯೂಸ್',
      home: 'ಮುಖಪುಟ',
      nelamangala: 'ನೆಲಮಂಗಲ',
      karnataka: 'ಕರ್ನಾಟಕ',
      bengaluru: 'ಬೆಂಗಳೂರು',
      politics: 'ರಾಜಕೀಯ',
      crime: 'ಅಪರಾಧ',
      sports: 'ಕ್ರೀಡೆ',
      cinema: 'ಸಿನೆಮಾ',
      videos: 'ವೀಡಿಯೋಗಳು',
      signIn: 'ಲಾಗಿನ್',
      getStarted: 'ಖಾತೆ ತೆರೆಯಿರಿ',
      dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      profile: 'ಪ್ರೊಫೈಲ್',
      signOut: 'ಲಾಗೌಟ್',
      search: 'ಹುಡುಕಾಟ',
      menu: 'ಮೆನು',
      close: 'ಮುಚ್ಚಿ',
      switchLang: 'ಭಾಷೆ ಬದಲಿಸಿ',
      lightMode: 'ಬೆಳಕಿನ ವಿನ್ಯಾಸಕ್ಕೆ ಬದಲಿಸಿ',
      darkMode: 'ಕತ್ತಲೆಯ ವಿನ್ಯಾಸಕ್ಕೆ ಬದಲಿಸಿ',
    },
    home: {
      heroHeading: 'ಪ್ರಮುಖ ಸುದ್ದಿ',
      editorsPicks: 'ಸಂಪಾದಕರ ಆಯ್ಕೆ',
      editorsPicksDesc: 'ಗರ್ಜನೆ ನ್ಯೂಸ್ ಸಂಪಾದಕೀಯ ಮಂಡಳಿಯ ಆಯ್ದ ಪ್ರಮುಖ ವರದಿಗಳು',
      breakingNews: 'ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್',
      latestNews: 'ತಾಜಾ ಸುದ್ದಿಗಳು',
      latestNewsDesc: 'ನೆಲಮಂಗಲ ಮತ್ತು ಕರ್ನಾಟಕದ ಇತ್ತೀಚಿನ ವಿದ್ಯಮಾನಗಳು',
      trendingNow: 'ಪ್ರಚಲಿತ ಸುದ್ದಿಗಳು',
      mostRead: 'ಹೆಚ್ಚು ಓದಲಾಗಿದೆ',
      videoReports: 'ವೀಡಿಯೋ ವರದಿಗಳು',
      videoReportsDesc: 'ನೆಲಮಂಗಲ ಹಾಗೂ ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಘಟನೆಗಳ ಗ್ರೌಂಡ್ ರಿಪೋರ್ಟ್',
      photoGalleries: 'ಚಿತ್ರಾವಳಿ',
      photoGalleriesDesc: 'ಸ್ಥಳೀಯ ಘಟನೆಗಳ ವಿಶೇಷ ಛಾಯಾಚಿತ್ರ ಸಂಗ್ರಹ',
      stayUpdated: 'ಅಪ್‌ಡೇಟ್ ಆಗಿರಿ',
      newsletterDesc: 'ಅತೀಹೊಸ ಸುದ್ದಿಗಳನ್ನು ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ ನೇರವಾಗಿ ಉಚಿತವಾಗಿ ಪಡೆಯಿರಿ.',
      emailPlaceholder: 'ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ',
      subscribe: 'ಚಂದಾದಾರರಾಗಿ',
      subscribedSuccess: 'ಯಶಸ್ವಿಯಾಗಿ ಚಂದಾದಾರರಾಗಿದ್ದೀರಿ!',
      invalidEmail: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ',
    },
    article: {
      language: 'ಭಾಷೆ:',
      fontSize: 'ಅಕ್ಷರ ಗಾತ್ರ:',
      comments: 'ಪ್ರತಿಕ್ರಿಯೆಗಳು',
      leaveComment: 'ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ ತಿಳಿಸಿ',
      commentPlaceholder: 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...',
      submitComment: 'ಪ್ರತಿಕ್ರಿಯೆ ಕಳುಹಿಸಿ',
      submitting: 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
      commentSuccess: 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಪರಿಶೀಲನೆಯ ನಂತರ ಪ್ರಕಟಿಸಲಾಗುವುದು.',
      commentError: 'ಪ್ರತಿಕ್ರಿಯೆ ಕಳುಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.',
      commentsClosed: 'ಈ ಲೇಖನಕ್ಕೆ ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಮುಚ್ಚಲಾಗಿದೆ.',
      previousArticle: 'ಹಿಂದಿನ ಲೇಖನ',
      nextArticle: 'ಮುಂದಿನ ಲೇಖನ',
      relatedArticles: 'ಸಂಬಂಧಿತ ಲೇಖನಗಳು',
      liveUpdates: 'ನೇರ ಅಪ್‌ಡೇಟ್ಸ್',
      photoGallery: 'ಚಿತ್ರಾವಳಿ',
      media: 'ಮಾಧ್ಯಮ ಸಂಗ್ರಹ',
      images: 'ಚಿತ್ರಗಳು',
      videos: 'ವೀಡಿಯೋಗಳು',
      photosCount: 'ಚಿತ್ರಗಳು',
      reporterBioDefault: 'ಗರ್ಜನೆ ನ್ಯೂಸ್ ಸ್ಥಳೀಯ ವರದಿಗಾರರು',
    },
    footer: {
      company: 'ಸಂಸ್ಥೆ',
      editorial: 'ಸಂಪಾದಕೀಯ',
      legal: 'ಕಾನೂನು',
      forYou: 'ನಿಮಗಾಗಿ',
      contactUs: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
      aboutUs: 'ನಮ್ಮ ಬಗ್ಗೆ',
      contact: 'ಸಂಪರ್ಕ',
      editorialPolicy: 'ಸಂಪಾದಕೀಯ ನೀತಿ',
      ethicsStandards: 'ನೈತಿಕತೆ ಮತ್ತು ಮಾನದಂಡ',
      correctionsPolicy: 'ತಿದ್ದುಪಡಿ ನೀತಿ',
      lettersToEditor: 'ಸಂಪಾದಕರಿಗೆ ಪತ್ರಗಳು',
      privacyPolicy: 'ಗೌಪ್ಯತಾ ನೀತಿ',
      termsOfService: 'ಸೇವಾ ಷರತ್ತುಗಳು',
      advertiseWithUs: 'ಜಾಹೀರಾತು ನೀಡಿ',
      newsletter: 'ನ್ಯೂಸ್‌ಲೆಟರ್',
      photoGalleries: 'ಚಿತ್ರಾವಳಿ',
      videos: 'ವೀಡಿಯೋಗಳು',
      rightsReserved: 'ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
      websiteDeveloper: 'ವೆಬ್‌ಸೈಟ್ ಡೆವಲಪರ್',
      webDeveloperTitle: 'ವೆಬ್ ಡೆವಲಪರ್ & ಡಿಸೈನರ್',
      designedAndDevelopedBy: 'ವಿನ್ಯಾಸ ಮತ್ತು ಅಭಿವೃದ್ಧಿ: ತೇಜಸ್',
      privacy: 'ಗೌಪ್ಯತೆ',
      terms: 'ಷರತ್ತುಗಳು',
      sitemap: 'ಸೈಟ್‌ಮ್ಯಾಪ್',
      followUsOn: 'ನಮ್ಮನ್ನು ಫಾಲೋ ಮಾಡಿ',
      subscribeOn: 'ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ',
      taglineDefault: 'ನಿಮ್ಮ ಊರಿನ ಸುದ್ದಿ, ನಿಮ್ಮ ಧ್ವನಿ',
      addressDefault: 'ನಂ. 1778, 1ನೇ ಮಹಡಿ, ರಾಯನ್ ನಗರ, ಬಿಎಸ್‌ಎನ್‌ಎಲ್ ಟೆಲಿ ಎಕ್ಸ್‌ಚೇಂಜ್ ಎದುರು, ಕುಣಿಗಲ್ ರಸ್ತೆ, ನೆಲಮಂಗಲ, ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ, 562123',
    },
    search: {
      title: 'ಸುದ್ದಿ ಹುಡುಕಾಟ',
      subtitle: 'ನೆಲಮಂಗಲ, ಕರ್ನಾಟಕ ಹಾಗೂ ತಾಜಾ ವಿದ್ಯಮಾನಗಳ ವರದಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
      placeholder: 'ಲೇಖನಗಳು, ಸ್ಥಳಗಳು ಅಥವಾ ವಿಷಯಗಳನ್ನು ಹುಡುಕಿ...',
      searchBtn: 'ಹುಡುಕಿ',
      popularTopics: 'ಜನಪ್ರಿಯ ವಿಷಯಗಳು:',
      resultsFor: 'ಹುಡುಕಾಟ ಫಲಿತಾಂಶ:',
      noResultsFound: 'ಯಾವುದೇ ಫಲಿತಾಂಶ ಕಂಡುಬಂದಿಲ್ಲ',
      tryDifferentKeywords: 'ದಯವಿಟ್ಟು ಬೇರೆ ಪದಗಳನ್ನು ಬಳಸಿ ಹುಡುಕಿ.',
    },
    sort: {
      sortBy: 'ವಿಂಗಡಿಸಿ:',
      latestFirst: 'ಇತ್ತೀಚಿನವು',
      mostViewed: 'ಹೆಚ್ಚು ವೀಕ್ಷಿಸಿದವು',
      shortestRead: 'ಕಡಿಮೆ ಓದುವಿಕೆ',
    },
    emptyState: {
      noNewsTitle: 'ಯಾವುದೇ ಸುದ್ದಿಗಳಿಲ್ಲ',
      noNewsDesc: 'ಹೊಸ ಸುದ್ದಿಗಳು ಪ್ರಕಟವಾದಾಗ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.',
      noArticlesTitle: 'ಯಾವುದೇ ಲೇಖನಗಳಿಲ್ಲ',
      noArticlesDesc: 'ಈ ವರ್ಗದಲ್ಲಿ ಹೊಸ ಲೇಖನಗಳು ಶೀಘ್ರದಲ್ಲೇ ಪ್ರಕಟವಾಗಲಿವೆ.',
      noResultsTitle: 'ಯಾವುದೇ ಫಲಿತಾಂಶ ಕಂಡುಬಂದಿಲ್ಲ',
      noResultsDesc: 'ದಯವಿಟ್ಟು ಬೇರೆ ಕೀವರ್ಡ್‌ಗಳನ್ನು ಬಳಸಿ ಪ್ರಯತ್ನಿಸಿ.',
      noPhotosTitle: 'ಫೋಟೋ ಗ್ಯಾಲರಿಗಳಿಲ್ಲ',
      noPhotosDesc: 'ಹೊಸ ಫೋಟೋ ಸಂಗ್ರಹಗಳು ಶೀಘ್ರದಲ್ಲೇ ಲಭ್ಯವಾಗಲಿವೆ.',
      noVideosTitle: 'ವೀಡಿಯೋಗಳಿಲ್ಲ',
      noVideosDesc: 'ಹೊಸ ವೀಡಿಯೋ ವರದಿಗಳು ಶೀಘ್ರದಲ್ಲೇ ಅಪ್‌ಲೋಡ್ ಆಗಲಿವೆ.',
      noDataTitle: 'ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ',
      noDataDesc: 'ವಿವರಗಳು ಲಭ್ಯವಾದಾಗ ಇಲ್ಲಿ ಪ್ರಕಟಿಸಲಾಗುತ್ತದೆ.',
    },
    theme: {
      theme: 'ಥೀಮ್',
      light: 'ಲೈಟ್',
      dark: 'ಡಾರ್ಕ್',
      system: 'ಸಿಸ್ಟಮ್',
      selectTheme: 'ಥೀಮ್ ಆಯ್ಕೆಮಾಡಿ',
    },
    auth: {
      signIn: 'ಲಾಗಿನ್',
      signInTitle: 'ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ',
      signInSubtitle: 'Sign In to Garjane News',
      signInRoleDesc: 'ವರದಿಗಾರರು, ಸಂಪಾದಕರು ಮತ್ತು ಚಂದಾದಾರರ ಆಡಳಿತ ತಾಣ',
      email: 'ಇಮೇಲ್ ವಿಳಾಸ',
      emailPlaceholder: 'name@example.com',
      password: 'ಪಾಸ್‌ವರ್ಡ್',
      passwordPlaceholder: '••••••••',
      rememberMe: 'ನನ್ನನ್ನು ನೆನಪಿಡಿ',
      forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?',
      signInButton: 'ಲಾಗಿನ್',
      signingIn: 'ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...',
      newUserPrompt: 'ಹೊಸ ಬಳಕೆದಾರರೇ?',
      createAccount: 'ಖಾತೆ ತೆರೆಯಿರಿ',
      forgotPasswordTitle: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ',
      forgotPasswordSubtitle: 'ನಿಮ್ಮ ನೋಂದಾಯಿತ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ. ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಲು ನಾವು ಲಿಂಕ್ ಕಳುಹಿಸುತ್ತೇವೆ.',
      sendResetLink: 'ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಿ',
      sendingResetLink: 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
      resetLinkSentTitle: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!',
      resetLinkSentDesc:
        'ನಿಮ್ಮ ಇಮೇಲ್ ಐಡಿಗೆ ನಾವು ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಿದ್ದೇವೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇನ್‌ಬಾಕ್ಸ್ ಪರಿಶೀಲಿಸಿ.',
      backToSignIn: 'ಲಾಗಿನ್‌ಗೆ ಹಿಂತಿರುಗಿ',
      resetPasswordTitle: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಸಿ',
      resetPasswordSubtitle: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಖಾತೆಗೆ ಹೊಸ ಬಲವಾದ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.',
      newPassword: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್',
      confirmPassword: 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ',
      saveNewPassword: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಉಳಿಸಿ',
      savingNewPassword: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
      passwordResetSuccessTitle: 'ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಗಿದೆ!',
      passwordResetSuccessDesc: 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಲಾಗಿದೆ. ಈಗ ನೀವು ಹೊಸ ಪಾಸ್‌ವರ್ಡ್‌ನೊಂದಿಗೆ ಲಾಗಿನ್ ಮಾಡಬಹುದು.',
      signInWithNewPassword: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್‌ನೊಂದಿಗೆ ಲಾಗಿನ್ ಮಾಡಿ',
      invalidLinkTitle: 'ಲಿಂಕ್ ಅಮಾನ್ಯವಾಗಿದೆ ಅಥವಾ ಅವಧಿ ಮೀರಿದೆ',
      invalidLinkDesc: 'ಈ ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಅಮಾನ್ಯವಾಗಿದೆ, ಈಗಾಗಲೇ ಬಳಸಲಾಗಿದೆ ಅಥವಾ ಅವಧಿ ಮೀರಿದೆ. ದಯವಿಟ್ಟು ಹೊಸ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ವಿನಂತಿಸಿ.',
      requestNewLink: 'ಹೊಸ ಲಿಂಕ್ ವಿನಂತಿಸಿ',
      passwordsDoNotMatch: 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ',
      passwordTooShort: 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳಾಗಿರಬೇಕು',
      invalidEmail: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ',
      connectionError: 'ಸಂಪರ್ಕ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.',
      showPassword: 'ಪಾಸ್‌ವರ್ಡ್ ತೋರಿಸಿ',
      hidePassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆಮಾಡಿ',
    },
  },

  en: {
    common: {
      brandName: 'Garjane News',
      readMore: 'Read More',
      viewAll: 'View All',
      share: 'Share:',
      copyLink: 'Copy Link',
      copied: 'Copied',
      bookmark: 'Bookmark',
      views: 'views',
      minRead: 'min read',
      breaking: 'Breaking',
      live: 'Live',
      featured: 'Featured',
      editorPick: "Editor's Pick",
      reporter: 'Reporter:',
      author: 'Author:',
      published: 'Published:',
      updated: 'Updated:',
      ad: 'Ad',
      error: 'An error occurred',
      tryAgain: 'Try Again',
      noImage: 'No Image',
      justNow: 'Just now',
      minutesAgo: 'm ago',
      hoursAgo: 'h ago',
      daysAgo: 'd ago',
    },
    nav: {
      brandName: 'Garjane News',
      home: 'Home',
      nelamangala: 'Nelamangala',
      karnataka: 'Karnataka',
      bengaluru: 'Bengaluru',
      politics: 'Politics',
      crime: 'Crime',
      sports: 'Sports',
      cinema: 'Cinema',
      videos: 'Videos',
      signIn: 'Sign In',
      getStarted: 'Get Started',
      dashboard: 'Dashboard',
      profile: 'Profile',
      signOut: 'Sign Out',
      search: 'Search',
      menu: 'Menu',
      close: 'Close',
      switchLang: 'Switch Language',
      lightMode: 'Switch to light mode',
      darkMode: 'Switch to dark mode',
    },
    home: {
      heroHeading: 'Top Story',
      editorsPicks: "Editor's Picks",
      editorsPicksDesc: 'Handpicked investigative reporting and top stories from our editorial team',
      breakingNews: 'Breaking News',
      latestNews: 'Latest News',
      latestNewsDesc: 'Stay updated with the latest happenings across Nelamangala and Karnataka',
      trendingNow: 'Trending Now',
      mostRead: 'Most Read',
      videoReports: 'Video Reports',
      videoReportsDesc: 'Ground reports, investigations, and video stories from Nelamangala & Karnataka',
      photoGalleries: 'Photo Galleries',
      photoGalleriesDesc: 'Visual highlights and curated photo essays of local events',
      stayUpdated: 'Stay Updated',
      newsletterDesc: 'Get the latest news and ground reports delivered straight to your inbox.',
      emailPlaceholder: 'Enter your email address',
      subscribe: 'Subscribe',
      subscribedSuccess: 'Successfully subscribed!',
      invalidEmail: 'Please enter a valid email address',
    },
    article: {
      language: 'Language:',
      fontSize: 'Text Size:',
      comments: 'Comments',
      leaveComment: 'Leave a comment',
      commentPlaceholder: 'Write your thoughts here...',
      submitComment: 'Post Comment',
      submitting: 'Posting...',
      commentSuccess: 'Your comment has been submitted and will appear after moderation.',
      commentError: 'Could not post comment. Please try again.',
      commentsClosed: 'Comments are closed for this article.',
      previousArticle: 'Previous Article',
      nextArticle: 'Next Article',
      relatedArticles: 'Related Articles',
      liveUpdates: 'Live Updates',
      photoGallery: 'Photo Gallery',
      media: 'Media',
      images: 'Images',
      videos: 'Videos',
      photosCount: 'photos',
      reporterBioDefault: 'Garjane News Local Reporter',
    },
    footer: {
      company: 'Company',
      editorial: 'Editorial',
      legal: 'Legal',
      forYou: 'For You',
      contactUs: 'Contact Us',
      aboutUs: 'About Us',
      contact: 'Contact',
      editorialPolicy: 'Editorial Policy',
      ethicsStandards: 'Ethics & Standards',
      correctionsPolicy: 'Corrections Policy',
      lettersToEditor: 'Letters to Editor',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      advertiseWithUs: 'Advertise with Us',
      newsletter: 'Newsletter',
      photoGalleries: 'Photo Galleries',
      videos: 'Videos',
      rightsReserved: 'All rights reserved.',
      websiteDeveloper: 'Website Developer',
      webDeveloperTitle: 'Web Developer & Designer',
      designedAndDevelopedBy: 'Designed & Developed by Thejas',
      privacy: 'Privacy',
      terms: 'Terms',
      sitemap: 'Sitemap',
      followUsOn: 'Follow us on',
      subscribeOn: 'Subscribe on',
      taglineDefault: 'Your Local News, Your Voice',
      addressDefault: 'Number 1778, 1st Floor, Rayan Nagara, Opp BSNL Tele Exchange, Kunigal Road, Nelamangala, Bengaluru Rural, 562123',
    },
    search: {
      title: 'Search News',
      subtitle: 'Discover reports from Nelamangala, Karnataka, and breaking developments',
      placeholder: 'Search articles, places, or topics...',
      searchBtn: 'Search',
      popularTopics: 'Popular Topics:',
      resultsFor: 'Search results for:',
      noResultsFound: 'No results found',
      tryDifferentKeywords: 'Please try searching with different keywords.',
    },
    sort: {
      sortBy: 'Sort by:',
      latestFirst: 'Latest First',
      mostViewed: 'Most Viewed',
      shortestRead: 'Shortest Read',
    },
    emptyState: {
      noNewsTitle: 'No news yet',
      noNewsDesc: 'New stories will appear here once published.',
      noArticlesTitle: 'No articles found',
      noArticlesDesc: 'New articles in this category will be published soon.',
      noResultsTitle: 'No results found',
      noResultsDesc: 'Please try different search keywords.',
      noPhotosTitle: 'No photos yet',
      noPhotosDesc: 'New photo galleries will be added soon.',
      noVideosTitle: 'No videos yet',
      noVideosDesc: 'New video reports will be uploaded soon.',
      noDataTitle: 'Nothing to show',
      noDataDesc: 'Information will appear here once available.',
    },
    theme: {
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      selectTheme: 'Select theme',
    },
    auth: {
      signIn: 'Sign In',
      signInTitle: 'Sign In to Your Account',
      signInSubtitle: 'Sign In to Garjane News',
      signInRoleDesc: 'Admin portal for reporters, editors, and subscribers',
      email: 'Email Address',
      emailPlaceholder: 'name@example.com',
      password: 'Password',
      passwordPlaceholder: '••••••••',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot Password?',
      signInButton: 'Sign In',
      signingIn: 'Signing In...',
      newUserPrompt: 'New user?',
      createAccount: 'Create Account',
      forgotPasswordTitle: 'Reset Your Password',
      forgotPasswordSubtitle: 'Enter your registered email address and we will send you a password reset link.',
      sendResetLink: 'Send Reset Link',
      sendingResetLink: 'Sending Reset Link...',
      resetLinkSentTitle: 'Password Reset Link Sent Successfully!',
      resetLinkSentDesc:
        "We've sent a password reset link to your Email ID. Please check your inbox.",
      backToSignIn: 'Back to Sign In',
      resetPasswordTitle: 'Set New Password',
      resetPasswordSubtitle: 'Please enter a new strong password for your account.',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      saveNewPassword: 'Save New Password',
      savingNewPassword: 'Saving New Password...',
      passwordResetSuccessTitle: 'Password Reset Successful!',
      passwordResetSuccessDesc: 'Your password has been updated. You can now sign in with your new password.',
      signInWithNewPassword: 'Sign In with New Password',
      invalidLinkTitle: 'Invalid or Expired Link',
      invalidLinkDesc: 'This password reset link is invalid, has already been used, or has expired. Please request a new reset link.',
      requestNewLink: 'Request a New Link',
      passwordsDoNotMatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 8 characters',
      invalidEmail: 'Please enter a valid email address',
      connectionError: 'Connection error occurred. Please try again.',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
    },
  },
};
