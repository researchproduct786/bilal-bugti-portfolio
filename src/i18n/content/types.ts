/**
 * Localised content model.
 *
 * All visitor-facing copy is here, in every language. Strings are deliberately short:
 * the layout is mobile-first and a visitor should never have to scroll through a wall of
 * text to understand what a product does.
 *
 * Technology names (React, Shopify, WhatsApp) are proper nouns and stay as they are in
 * every language; everything a business owner reads is translated.
 */

export interface ContentProject {
  slug: string;
  n: string;
  brand: string;
  /** Plain-language answer to "what is it?" */
  what: string;
  /** One line a business owner would recognise. */
  summary: string;
  who: string;
  problem: string;
  solution: string;
  features: string[];
  skills: string[];
  decisions: { title: string; body: string }[];
  measure: string[];
  accent: string;
  /** Which screenshot/interface concept to render for this project. */
  visual: 'store' | 'app' | 'assistant' | 'crm' | 'restaurant' | 'campaign';
}

export interface ContentService {
  slug: string;
  letter: string;
  title: string;
  short: string;
  headline: string;
  /** Which capability cards map to this practice area. */
  capabilities: string[];
  problemTitle: string;
  problemBody: string;
  signs: string[];
  solutionTitle: string;
  solutionBody: string;
  included: { title: string; items: string[] }[];
  steps: { title: string; body: string }[];
  demos: string[];
  faqs: { q: string; a: string }[];
  visual: 'store' | 'app' | 'web' | 'automation' | 'crm' | 'ai' | 'marketing';
}

export interface ContentProblem {
  id: string;
  statement: string;
  why: string;
  solution: string;
  tech: string[];
  help: string;
  service: string;
  project: string;
}

export interface ContentIndustry {
  name: string;
  note: string;
}

export interface SiteContent {
  projects: ContentProject[];
  services: ContentService[];
  problems: ContentProblem[];
  industries: ContentIndustry[];
  story: { n: string; title: string; body: string }[];
  lessons: { title: string; body: string }[];
  /** Short page-level copy for the secondary routes. */
  pages: {
    industries: { title: string; lede: string; note: string };
    insights: { title: string; lede: string; draft: string };
    lab: { title: string; lede: string; note: string };
    caseStudies: { title: string; lede: string; note: string };
    results: { title: string; lede: string; note: string };
    testimonials: { title: string; lede: string; note: string };
  };
}

export const categoryLabels: Record<string, string> = {
  store: 'E-commerce',
  app: 'Mobile app',
  assistant: 'AI & automation',
  crm: 'Business systems',
  restaurant: 'Hospitality',
  campaign: 'Marketing & creative',
};
