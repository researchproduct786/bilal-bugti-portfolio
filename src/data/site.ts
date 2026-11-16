const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export const site = {
  name: 'Bilal Bugti',
  // Contact details are configuration, never invented. Empty string = "not configured yet".
  url: (process.env.NEXT_PUBLIC_SITE_URL || vercelUrl || 'http://localhost:3000').replace(/\/$/, ''),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, ''),
  socials: [
    { label: 'LinkedIn', url: process.env.NEXT_PUBLIC_LINKEDIN_URL || '' },
    { label: 'Instagram', url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '' },
    { label: 'X', url: process.env.NEXT_PUBLIC_X_URL || '' },
  ].filter((s) => s.url),
};
