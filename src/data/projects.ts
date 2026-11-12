export interface Project {
  slug: string;
  n: string;
  brand: string;
  title: string;
  category: string;
  service: string; // service slug
  summary: string;
  plain: string; // one-sentence explanation for a non-technical reader
  before: string[]; // how the work runs without the product
  after: string[]; // the same work with it
  value: string[]; // what the business gains
  problem: string;
  solution: string;
  features: string[];
  builtWith: string[]; // what this demonstration actually runs on
  productionStack: string[]; // what a client build would likely use
  decisions: { title: string; body: string }[];
  measure: string[]; // what would be measured in a real engagement
  accent: string;
}

export const DEMO_LABEL = 'Concept Project';
export const DEMO_NOTE =
  'Self-initiated demonstration. The brand, people and all figures are fictional sample data created for this portfolio.';

export const projects: Project[] = [
  {
    slug: 'halden-objects',
    n: '01',
    brand: 'Halden Objects',
    title: 'Premium e-commerce storefront',
    category: 'E-commerce',
    service: 'digital-product-development',
    summary: 'A quiet, considered storefront for a fictional maker of desk objects — with a working cart, variants, checkout flow and an owner’s analytics view.',
    plain: 'An online shop where a customer can find a product, choose a colour and size, and pay — in under a minute, on a phone.',
    before: ['Customers message to ask what is in stock', 'Orders are typed out by hand', 'Nobody knows which products actually sell'],
    after: ['Customers browse and choose for themselves', 'Checkout collects the order and payment', 'The owner sees sales and best sellers in one view'],
    value: ['Sell at any hour without answering messages', 'Fewer abandoned orders from a shorter checkout', 'Stock and pricing decisions based on what sells'],
    problem: 'Small premium brands often inherit a theme built for discount retail: loud banners, crowded product pages, and a checkout that asks for too much. The product is careful; the shop is not.',
    solution: 'A storefront that gives each object room, keeps the buying decision on one screen, and takes the customer from product to confirmation in three calm steps. The owner gets a plain view of orders and what is selling.',
    features: ['Product grid with category filter', 'Product page with colour and size variants', 'Cart drawer with quantity editing', 'Three-step checkout demonstration', 'Owner analytics preview'],
    builtWith: ['React', 'TypeScript', 'CSS (no UI kit)', 'Local state — no payment is processed'],
    productionStack: ['Shopify', 'Liquid or Hydrogen storefront', 'Shopify Payments', 'Analytics events'],
    decisions: [
      { title: 'Variants change the price, not the page', body: 'Colour and size are chosen inline and the price updates in place, so the customer never loses their position or the image they were looking at.' },
      { title: 'The cart is a drawer, not a destination', body: 'Adding an item confirms it immediately and keeps the customer browsing. The full cart page was removed entirely.' },
      { title: 'Checkout asks only what fulfilment needs', body: 'Contact, delivery, payment. No account creation, no newsletter box ticked by default.' },
    ],
    measure: ['Add-to-cart rate per product page', 'Checkout completion by step', 'Mobile versus desktop conversion', 'Average order value'],
    accent: '#d9b382',
  },
  {
    slug: 'tillo',
    n: '02',
    brand: 'Tillo',
    title: 'Mobile business management app',
    category: 'Mobile app',
    service: 'digital-product-development',
    summary: 'A pocket back-office for a small shop: today’s numbers, open orders, customers, stock and settings — designed for one thumb and a busy counter.',
    plain: 'A phone app that lets a shop owner run the day — orders, stock and customers — without going back to a computer.',
    before: ['Orders live in a notebook and a chat app', 'Stock is checked by walking to the shelf', 'The day’s takings are a guess until closing'],
    after: ['Every order is a card you move with one tap', 'Low stock shows up before it runs out', 'Today’s numbers are on the first screen'],
    value: ['Less time on admin at the counter', 'Fewer missed or forgotten orders', 'A clear picture of the day, from anywhere'],
    problem: 'Owners of small shops run the day from a phone, between customers. Desktop dashboards squeezed onto a small screen make simple questions — what is open, what is low, who owes — slow to answer.',
    solution: 'A mobile-first app organised around the questions an owner asks during the day. Orders can be advanced with one tap, low stock is flagged before it runs out, and every screen is readable at arm’s length.',
    features: ['Daily dashboard', 'Orders with one-tap status changes', 'Customer list and detail', 'Products with stock alerts', 'Weekly analytics', 'Settings'],
    builtWith: ['React', 'TypeScript', 'CSS device frame', 'Local sample data'],
    productionStack: ['React Native or Flutter', 'Secure API backend', 'Push notifications', 'Offline cache'],
    decisions: [
      { title: 'One primary action per screen', body: 'Each order shows exactly one next step. There is no menu of statuses to choose from.' },
      { title: 'Numbers first, charts second', body: 'The dashboard opens with three figures in large type. Charts live one tap away for the moments there is time to look.' },
      { title: 'Bottom navigation, five items', body: 'Everything is reachable with the thumb of the hand holding the phone.' },
    ],
    measure: ['Time to complete a common task', 'Daily active use by the owner', 'Orders processed in-app', 'Stock-outs avoided'],
    accent: '#7fd1b9',
  },
  {
    slug: 'deskhand',
    n: '03',
    brand: 'Deskhand',
    title: 'AI business assistant interface',
    category: 'AI & automation',
    service: 'ai-business-systems',
    summary: 'An assistant that answers from a company’s own knowledge, proposes next actions and keeps a task list — demonstrated here with scripted local responses.',
    plain: 'A question box for your own company documents: ask in plain words, get an answer with its source, and turn it into a task.',
    before: ['Answers are buried in files and spreadsheets', 'The same questions interrupt the same people', 'Follow-ups are remembered, or not'],
    after: ['Ask a question and see which document answered it', 'Staff help themselves first', 'Suggested next steps become tasks in one click'],
    value: ['Less time spent searching for information', 'Answers that can be checked against a source', 'Fewer follow-ups that fall through'],
    problem: 'Teams lose time asking each other the same questions: what is the return policy, which orders are late, what did we agree with that supplier. The answers exist, scattered across documents and inboxes.',
    solution: 'A single conversation surface connected to a defined set of business knowledge. It answers with its source, suggests a concrete action, and can turn that action into a task — with a person approving anything that leaves the building.',
    features: ['Conversation interface', 'Business knowledge panel with sources', 'Suggested actions', 'Task list created from chat', 'Business insights summary'],
    builtWith: ['React', 'TypeScript', 'Scripted intent matching — no AI model is connected', 'Local sample knowledge base'],
    productionStack: ['A hosted language model (provider chosen with the client)', 'Retrieval over company documents', 'Role-based access', 'Human approval steps'],
    decisions: [
      { title: 'Every answer shows where it came from', body: 'An assistant that cannot cite its source inside the business should not be trusted with business questions.' },
      { title: 'Actions are suggested, never taken silently', body: 'The assistant proposes; a person confirms. Tasks are visible and editable.' },
      { title: 'Honest about being a demo', body: 'The interface states plainly that responses are scripted. A portfolio should not fake the hardest part.' },
    ],
    measure: ['Questions answered without escalation', 'Time saved on routine lookups', 'Answer accuracy in review samples', 'Tasks created and completed'],
    accent: '#8fb4ff',
  },
  {
    slug: 'linework-crm',
    n: '04',
    brand: 'Linework',
    title: 'CRM & workflow automation system',
    category: 'Business systems',
    service: 'ai-business-systems',
    summary: 'A lead pipeline, customer records, tasks and a visual automation builder for a fictional services firm — one place to see what is moving and what is stuck.',
    plain: 'One shared board that shows every lead, who owns it and what happens next — with reminders that send themselves.',
    before: ['Leads sit in personal inboxes and phones', 'Follow-ups depend on someone’s memory', 'Nobody can see what is stuck'],
    after: ['Every lead is a card on a shared pipeline', 'Follow-ups and reminders run automatically', 'Stalled deals are flagged after seven days'],
    value: ['Fewer enquiries lost between people', 'Faster replies to new leads', 'A pipeline the whole team can see'],
    problem: 'Leads arrive by form, phone and message. Without a shared pipeline, follow-ups depend on memory, and the owner cannot see which deals are stalled until they are already lost.',
    solution: 'A pipeline the whole team can read at a glance, with records that keep the history in one place and automations that handle the predictable steps: acknowledge, assign, remind.',
    features: ['Lead pipeline with stage movement', 'Customer records', 'Task management', 'Workflow visualiser', 'Automation on/off status', 'Pipeline analytics'],
    builtWith: ['React', 'TypeScript', 'CSS', 'Local sample data'],
    productionStack: ['Web application with database', 'Email and messaging integrations', 'Background job runner', 'Audit log'],
    decisions: [
      { title: 'The pipeline is the home screen', body: 'The first thing anyone sees is the state of every open deal, not a welcome message.' },
      { title: 'Automations are drawn, not hidden', body: 'Each workflow is shown as a sequence of steps so the team understands what the system does on their behalf.' },
      { title: 'A visible off switch', body: 'Every automation can be paused in one click. Trust in automation starts with being able to stop it.' },
    ],
    measure: ['Lead response time', 'Stage-to-stage conversion', 'Deals with no activity in 7 days', 'Hours of manual follow-up removed'],
    accent: '#c7a6ff',
  },
  {
    slug: 'ember-and-rye',
    n: '05',
    brand: 'Ember & Rye',
    title: 'Restaurant ordering & management platform',
    category: 'Hospitality',
    service: 'digital-product-development',
    summary: 'Customer menu and ordering on one side, kitchen and owner dashboard on the other — connected, so marking a dish unavailable removes it from the menu instantly.',
    plain: 'Guests order from a menu on their phone; the kitchen sees the ticket instantly and marks each stage as it cooks.',
    before: ['Orders are taken by phone and re-typed', 'Guests ask for dishes that have run out', 'Nobody knows when an order will be ready'],
    after: ['Guests order and pay from the live menu', 'Sold-out dishes disappear from the menu at once', 'Each order shows its stage, from received to ready'],
    value: ['Fewer mistakes between counter and kitchen', 'No orders for dishes that are finished', 'Guests who know where their order is'],
    problem: 'Independent restaurants pay heavy commission to delivery platforms and still take phone orders on paper. The menu online does not match the kitchen, and nobody knows the day’s numbers until closing.',
    solution: 'A direct ordering experience the restaurant owns, tied to a simple kitchen view. Orders flow from customer to kitchen to pickup with status visible to both sides, and the menu is managed from the same screen.',
    features: ['Customer menu with categories', 'Order builder and basket', 'Live order tracking demonstration', 'Kitchen order queue', 'Menu availability management', 'Sales overview'],
    builtWith: ['React', 'TypeScript', 'CSS', 'Shared local state between customer and admin views'],
    productionStack: ['Web app + kitchen tablet view', 'Payment provider', 'Receipt printer or KDS integration', 'SMS or push order updates'],
    decisions: [
      { title: 'Two views, one source of truth', body: 'Customer and kitchen read the same data. Switch a dish off in the admin and it disappears from the menu at once — try it.' },
      { title: 'Tracking that reflects the kitchen', body: 'Order status is advanced by the kitchen queue, not by an optimistic timer.' },
      { title: 'Built for a tablet near a stove', body: 'Large targets, high contrast, no hover-only controls.' },
    ],
    measure: ['Share of orders placed directly', 'Order accuracy', 'Average preparation time', 'Revenue by daypart'],
    accent: '#ff9d6b',
  },
  {
    slug: 'slowtide',
    n: '06',
    brand: 'Slowtide',
    title: 'Digital marketing & creative campaign',
    category: 'Marketing & creative',
    service: 'digital-growth-creative',
    summary: 'A launch campaign for a fictional cold-brew tea: concept, identity, ad creatives, social mockups, a landing page and a performance dashboard built on sample data.',
    plain: 'A complete launch kit for a new drink: the idea, the look, the adverts, a sign-up page and a way to see what worked.',
    before: ['A product with no story or look', 'Adverts made one at a time, each different', 'No way to tell which channel brought sign-ups'],
    after: ['One idea carried through every piece', 'One design system that adapts to each format', 'One dashboard comparing channels (sample data)'],
    value: ['A brand people recognise across channels', 'Faster production of new adverts', 'Budget moved toward what actually brings leads'],
    problem: 'A new drinks brand entering a crowded shelf has seconds to be understood. Most launches scatter effort across channels with a different look and promise on each.',
    solution: 'One idea — “Take the long afternoon” — carried through identity, creative, landing page and measurement, so every touchpoint says the same thing and every result can be traced back.',
    features: ['Campaign concept', 'Brand identity system', 'Advertising creatives', 'Social media mockups', 'Landing page', 'Campaign dashboard (fictional sample data)'],
    builtWith: ['React', 'TypeScript', 'CSS-drawn creatives', 'SVG charts with sample data'],
    productionStack: ['Meta and Google ad platforms', 'Landing page with analytics', 'Email capture and follow-up', 'Reporting dashboard'],
    decisions: [
      { title: 'One line, everywhere', body: 'The campaign line appears unchanged in every format. Recognition comes from repetition, not variety.' },
      { title: 'Creative designed as a system', body: 'A fixed palette, one typeface and a single graphic device make new formats quick to produce and impossible to mistake.' },
      { title: 'The dashboard reports cost first', body: 'Spend and cost per lead are shown before reach, because vanity numbers are easy to grow and hard to bank.' },
    ],
    measure: ['Cost per qualified lead', 'Landing page conversion rate', 'Creative-level click-through', 'Return on ad spend'],
    accent: '#9fd8c4',
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
