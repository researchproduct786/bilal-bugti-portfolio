const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export const site = {
  name: 'Bilal Bugti',
  role: 'Digital Entrepreneur',
  discipline: 'Technology & Business Solutions',
  tagline: 'I don’t just build projects. I build solutions to real-world problems.',
  statement:
    'I combine technology, creativity, and business thinking to turn ideas into digital products, intelligent systems, and solutions that make a meaningful difference.',
  description:
    'Bilal Bugti is a digital entrepreneur working across e-commerce, mobile and web development, AI and business systems, and digital growth — turning business problems into practical, technology-driven solutions.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || vercelUrl || 'http://localhost:3000').replace(/\/$/, ''),
  // Contact details are configuration, never invented. Empty string = "not configured yet".
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, ''),
  socials: [
    { label: 'LinkedIn', url: process.env.NEXT_PUBLIC_LINKEDIN_URL || '' },
    { label: 'Instagram', url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '' },
    { label: 'X', url: process.env.NEXT_PUBLIC_X_URL || '' },
  ].filter((s) => s.url),
};

export const nav = {
  primary: [
    { href: '/work', label: 'Work' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/process', label: 'Process' },
  ],
  index: [
    { href: '/', label: 'Home', note: 'The opening scene' },
    { href: '/work', label: 'Work', note: 'Six concept projects' },
    { href: '/services', label: 'Services', note: 'Three areas of practice' },
    { href: '/industries', label: 'Industries', note: 'Where the problems live' },
    { href: '/case-studies', label: 'Case Studies', note: 'Decisions behind the demos' },
    { href: '/process', label: 'Process', note: 'Seven steps, in order' },
    { href: '/results', label: 'Results', note: 'What gets measured' },
    { href: '/about', label: 'About', note: 'The journey so far' },
    { href: '/testimonials', label: 'Testimonials', note: 'Honest, or empty' },
    { href: '/insights', label: 'Insights', note: 'Working notes' },
    { href: '/lab', label: 'Creative Lab', note: 'Interactive experiments' },
    { href: '/contact', label: 'Contact', note: 'Start a project' },
  ],
};
