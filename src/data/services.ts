export interface Service {
  slug: string;
  letter: string;
  title: string;
  short: string;
  headline: string;
  lead: string[]; // capabilities to emphasise
  supporting: string[];
  problem: { title: string; body: string; signs: string[] };
  solution: { title: string; body: string };
  included: { title: string; items: string[] }[];
  steps: { title: string; body: string }[];
  demos: string[]; // project slugs
  faqs: { q: string; a: string }[];
}

export const services: Service[] = [
  {
    slug: 'digital-product-development',
    letter: 'A',
    title: 'Digital Product Development',
    short: 'Stores, apps and websites that people can actually use — and that a business can actually run.',
    headline: 'A store, an app or a site that earns its place in the business.',
    lead: ['Shopify & E-commerce', 'Mobile App Development', 'Web Development'],
    supporting: ['Custom software', 'UI/UX design', 'API integrations'],
    problem: {
      title: 'Most digital products are built before the problem is understood.',
      body: 'A storefront gets launched without thinking about how orders will be fulfilled. An app gets designed for a pitch deck instead of for the person standing behind the counter. The result looks finished and still does not help.',
      signs: [
        'Customers browse on their phones but abandon at checkout.',
        'The website exists, but nobody on the team can update it.',
        'Orders, stock and customer messages live in three different places.',
        'An app idea has been “almost started” for a year.',
      ],
    },
    solution: {
      title: 'Start from how the business works, then design the product around it.',
      body: 'Before any screen is drawn, I map who uses the product, what they are trying to get done, and what happens after they tap the button. The build follows from that: a focused scope, a clear interface, and a product the owner can keep running without me.',
    },
    included: [
      { title: 'Shopify & e-commerce', items: ['Storefront design and theme build', 'Product, variant and collection structure', 'Cart and checkout flow', 'Payment, shipping and tax setup', 'Analytics and order reporting'] },
      { title: 'Mobile apps', items: ['Mobile-first product design', 'Cross-platform app development', 'Offline-tolerant data handling', 'Push notifications and account flows', 'Store submission preparation'] },
      { title: 'Web & custom software', items: ['Marketing and business websites', 'Dashboards and internal tools', 'Third-party API integrations', 'Performance and accessibility work', 'Handover documentation'] },
    ],
    steps: [
      { title: 'Scope', body: 'One conversation and a written brief: users, goals, constraints, what “done” means.' },
      { title: 'Prototype', body: 'Key screens designed and clickable before any production code is written.' },
      { title: 'Build', body: 'Short, visible milestones. You see working software, not status reports.' },
      { title: 'Launch & handover', body: 'Testing on real devices, launch support, and documentation you can use.' },
    ],
    demos: ['halden-objects', 'tillo', 'ember-and-rye'],
    faqs: [
      { q: 'Do you only work with Shopify?', a: 'Shopify is the platform I reach for first for most stores, because it lets a small team run a serious shop without maintaining servers. If the business needs something Shopify handles badly, I will say so and suggest a custom build instead.' },
      { q: 'Can you work with an existing website or app?', a: 'Yes. I will review what exists first and tell you honestly whether it makes more sense to improve it or to rebuild part of it.' },
      { q: 'How long does a project take?', a: 'It depends on scope, and I would rather give you a real estimate after understanding the project than a number that sounds good. A focused store or website is usually measured in weeks; a custom app takes longer.' },
      { q: 'What do you need from me to start?', a: 'A description of the business, the problem you want solved, and any content or branding you already have. The project inquiry form walks through it.' },
    ],
  },
  {
    slug: 'ai-business-systems',
    letter: 'B',
    title: 'AI & Business Systems',
    short: 'Less repeated typing, fewer lost leads, and a clear view of what is happening in the business.',
    headline: 'Give the repetitive work to the system. Keep the judgment for people.',
    lead: ['Business automation', 'CRM & management systems', 'AI-powered applications'],
    supporting: ['AI agents', 'Workflow automation', 'Process optimization', 'Data analysis'],
    problem: {
      title: 'The business runs on memory, spreadsheets and chat threads.',
      body: 'It works while the team is small. Then a lead goes unanswered, an invoice is sent twice, and nobody can say how many orders are actually open. The problem is rarely effort — it is that the process only exists in people’s heads.',
      signs: [
        'The same information is typed into more than one tool.',
        'Follow-ups depend on someone remembering.',
        'Reports take hours to assemble and are out of date on arrival.',
        'There is interest in AI, but no clear idea where it would genuinely help.',
      ],
    },
    solution: {
      title: 'Write the process down, then let software carry it.',
      body: 'I begin by mapping the workflow as it really happens. From there we decide what should be a system of record (a CRM or management tool), what can be automated safely, and where an AI model adds real value — summarising, drafting, sorting, answering from your own documents — and where it does not.',
    },
    included: [
      { title: 'Systems of record', items: ['CRM setup or custom build', 'Business management dashboards', 'Customer, order and task records', 'Roles and permissions'] },
      { title: 'Automation', items: ['Workflow mapping and redesign', 'Trigger-based automations', 'Tool-to-tool integrations', 'Monitoring and failure alerts'] },
      { title: 'Applied AI', items: ['Assistants grounded in your own knowledge', 'Drafting and summarising inside existing tools', 'Data clean-up and analysis', 'Clear limits, costs and human review points'] },
    ],
    steps: [
      { title: 'Map', body: 'Document the current workflow: who does what, with which tool, and where it breaks.' },
      { title: 'Decide', body: 'Pick the few changes that remove the most friction. Not everything should be automated.' },
      { title: 'Implement', body: 'Build or configure the system, connect the tools, migrate the data.' },
      { title: 'Stabilise', body: 'Train the team, watch it run on real work, and adjust.' },
    ],
    demos: ['linework-crm', 'deskhand', 'tillo'],
    faqs: [
      { q: 'Is the AI assistant on this website a real AI model?', a: 'No. The demonstrations here run on scripted, local logic so they cost nothing and work offline. That is stated on each demo. In a client project, a real model is connected only with your approval of the provider, the cost and the data handling.' },
      { q: 'Do I need AI at all?', a: 'Often the first win is ordinary automation and a clean system of record. I will tell you when AI is the right tool and when a simple rule does the job better.' },
      { q: 'Will this replace the tools we already use?', a: 'Not unless that is the goal. Most projects connect and tidy what you already have before introducing anything new.' },
      { q: 'What about paid subscriptions?', a: 'Any tool or API with a running cost is discussed up front, with free or cheaper alternatives where they exist. Nothing gets subscribed to on your behalf without agreement.' },
    ],
  },
  {
    slug: 'digital-growth-creative',
    letter: 'C',
    title: 'Digital Growth & Creative Solutions',
    short: 'A clear message, creative that fits the brand, and a path from attention to enquiry.',
    headline: 'Be found, be understood, and give people a reason to get in touch.',
    lead: ['Digital marketing', 'Sales funnels & lead generation', 'Branding & ad creatives'],
    supporting: ['Paid advertising', 'Graphic design', 'Video editing', 'AI video production', 'Business consulting'],
    problem: {
      title: 'Good businesses stay invisible because the message is unclear.',
      body: 'Money is spent on ads that lead to a page which does not answer the visitor’s question. The brand looks different on every channel. Leads arrive, but nobody knows which effort produced them.',
      signs: [
        'Ad spend goes out, but enquiries are inconsistent.',
        'The offer takes a paragraph to explain.',
        'Visuals are made one at a time with no shared identity.',
        'There is no simple way to see what is working.',
      ],
    },
    solution: {
      title: 'One message, one journey, measured honestly.',
      body: 'I work backwards from the action you want a customer to take. That defines the offer, the landing page, the creative and the channels — in that order. Every campaign is set up so results can be read plainly, including when they are disappointing.',
    },
    included: [
      { title: 'Strategy & funnel', items: ['Offer and audience definition', 'Landing page and lead capture', 'Sales funnel structure', 'Tracking and reporting setup'] },
      { title: 'Creative', items: ['Brand identity basics', 'Advertising creatives', 'Social media templates', 'Short-form video editing', 'AI-assisted video production'] },
      { title: 'Campaigns', items: ['Paid advertising setup', 'Creative testing plan', 'Lead follow-up workflow', 'Plain-language performance reviews'] },
    ],
    steps: [
      { title: 'Position', body: 'Who it is for, what it solves, and why now — in one or two sentences.' },
      { title: 'Create', body: 'Landing page and a small set of creative built around that single message.' },
      { title: 'Run', body: 'Launch small, read the numbers, keep what works.' },
      { title: 'Review', body: 'A simple report: what was spent, what came back, what to change.' },
    ],
    demos: ['slowtide', 'halden-objects'],
    faqs: [
      { q: 'Can you guarantee results?', a: 'No, and I would be cautious of anyone who does. What I can commit to is a clear plan, honest measurement, and changing course when the numbers say so.' },
      { q: 'Is ad spend included?', a: 'No. Advertising budgets are paid directly to the platforms by you and are always agreed in advance.' },
      { q: 'Do you use AI for creative work?', a: 'Where it helps — for drafts, variations and some video production. Anything AI-generated is reviewed, edited and disclosed to you.' },
      { q: 'I only need a logo or a few creatives. Is that fine?', a: 'Yes. Small, well-defined creative jobs are welcome.' },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
