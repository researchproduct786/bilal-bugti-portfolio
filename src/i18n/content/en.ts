import type { SiteContent } from './types';

export const contentEn: SiteContent = {
  projects: [
    {
      slug: 'halden-objects',
      n: '01',
      brand: 'Halden Objects',
      what: 'An online shopping store for selling home and lifestyle products.',
      summary: 'A storefront where someone can find a product, choose a variant, pay and get a receipt — plus the owner dashboard behind it.',
      who: 'A small product brand selling online without a marketplace taking a cut of every order.',
      problem:
        'Products were being sold through messages and a marketplace. Nobody could see what stock was left, the same questions were answered all day, and the shop took a commission on every sale.',
      solution:
        'A storefront built around one product page that answers the questions before they are asked: colour and size chosen inline, price updates in place, a cart that confirms without leaving the page, and a three-field checkout.',
      features: ['Product page with variants', 'Cart drawer', 'Checkout', 'Order confirmation', 'Owner dashboard with orders and stock'],
      skills: ['Storefront design', 'Checkout flow', 'Dashboard interface', 'Product information structure'],
      decisions: [
        { title: 'A cart drawer, not a page', body: 'Adding an item confirms it immediately and keeps the shopper browsing. The separate cart page was removed entirely.' },
        { title: 'Variants change the price in place', body: 'Colour and size are chosen on the product page, so nobody loses their position or the image they were looking at.' },
        { title: 'Checkout asks only what delivery needs', body: 'Contact, address, payment. No account creation and no newsletter box ticked by default.' },
      ],
      measure: ['Add-to-cart rate per product', 'Checkout completion by step', 'Mobile versus desktop conversion', 'Average order value'],
      accent: '#d9b382',
      visual: 'store',
    },
    {
      slug: 'tillo',
      n: '02',
      brand: 'Tillo',
      what: 'A mobile app for running a small business from a phone.',
      summary: 'Orders, customers, products, stock and daily sales in one app, designed for one thumb and a busy counter.',
      who: 'A shop owner who works standing up, between customers, with the phone in one hand.',
      problem:
        'The day was being run from a paper notebook and a message thread. What is open, what is low on stock and who owes money took several minutes and three places to answer.',
      solution:
        'A mobile-first app organised around the questions an owner actually asks during the day. Each order shows exactly one next step, low stock is flagged before it runs out, and the dashboard opens with three large numbers.',
      features: ['Daily dashboard', 'Orders with one-tap status', 'Customer list and detail', 'Stock alerts', 'Weekly sales view'],
      skills: ['Mobile interaction design', 'State management', 'Information hierarchy', 'Data visualisation'],
      decisions: [
        { title: 'One primary action per screen', body: 'Each order shows exactly one next step. There is no menu of statuses to choose from.' },
        { title: 'Numbers first, charts second', body: 'The dashboard opens with three figures in large type. Charts are one tap away, for when there is time to look.' },
        { title: 'Five items at the bottom', body: 'Everything is reachable with the thumb of the hand holding the phone.' },
      ],
      measure: ['Time to complete a common task', 'Daily active use by the owner', 'Orders processed in-app', 'Stock-outs avoided'],
      accent: '#7fd1b9',
      visual: 'app',
    },
    {
      slug: 'deskhand',
      n: '03',
      brand: 'Deskhand',
      what: 'A business assistant that finds answers inside a company’s own documents.',
      summary: 'Ask a question in plain language, get an answer with the source it came from, and turn the answer into a task.',
      who: 'A small team that keeps re-asking the same questions about policies, orders and suppliers.',
      problem:
        'The answers existed — in a supplier agreement, a returns policy and an order sheet — but they lived in three files, and whoever knew them was often busy. New staff asked the same questions every week.',
      solution:
        'One question box connected to a defined set of company documents. Every answer shows the document and line it came from, offers a follow-up action, and never takes that action without a person confirming it.',
      features: ['Question and answer', 'Source document shown', 'Suggested follow-up action', 'Task created from an answer', 'Document library'],
      skills: ['Conversation interface design', 'Retrieval-based answer structure', 'Trust and citation design', 'Honest demo boundaries'],
      decisions: [
        { title: 'Every answer shows its source', body: 'An assistant that cannot cite the document inside the business should not be trusted with business questions.' },
        { title: 'Actions are suggested, never taken silently', body: 'The assistant proposes; a person confirms. Tasks stay visible and editable.' },
        { title: 'Honest about being a demo', body: 'The interface states plainly that responses are scripted. A portfolio should not fake the hardest part.' },
      ],
      measure: ['Questions answered without escalation', 'Time saved on routine lookups', 'Answer accuracy in review samples', 'Tasks created and completed'],
      accent: '#8fb4ff',
      visual: 'assistant',
    },
    {
      slug: 'linework-crm',
      n: '04',
      brand: 'Linework',
      what: 'A CRM for managing customers, sales leads and follow-ups.',
      summary: 'A lead pipeline, customer records, follow-up tasks and a visible automation builder for a small services firm.',
      who: 'A two-to-ten person sales team losing deals because follow-ups live in individual inboxes.',
      problem:
        'Leads arrived by form, phone and message. Without a shared pipeline, follow-ups depended on memory, and the owner could not see which deals were stalled until they were already lost.',
      solution:
        'A pipeline the whole team can read at a glance, records that keep the history in one place, and automations that handle the predictable steps: acknowledge, assign, remind — each one drawn out and switchable.',
      features: ['Lead pipeline with stages', 'Customer records', 'Follow-up tasks', 'Visible workflow builder', 'Automation on/off', 'Pipeline value report'],
      skills: ['Business process design', 'CRM interface architecture', 'Workflow visualisation', 'Data modelling'],
      decisions: [
        { title: 'The pipeline is the home screen', body: 'The first thing anyone sees is the state of every open deal, not a welcome message.' },
        { title: 'Automations are drawn, not hidden', body: 'Each workflow is shown as a sequence of steps so the team understands what the system does on their behalf.' },
        { title: 'A visible off switch', body: 'Every automation can be paused in one click. Trust in automation starts with being able to stop it.' },
      ],
      measure: ['Lead response time', 'Stage-to-stage conversion', 'Deals with no activity in 7 days', 'Manual follow-up hours removed'],
      accent: '#c7a6ff',
      visual: 'crm',
    },
    {
      slug: 'ember-and-rye',
      n: '05',
      brand: 'Ember & Rye',
      what: 'A restaurant ordering and operations system.',
      summary: 'The customer menu and order on one side, the kitchen screen and management dashboard on the other — connected.',
      who: 'An independent restaurant taking orders directly instead of paying commission on every delivery.',
      problem:
        'Orders came by phone and were written on paper. The menu online did not match the kitchen, and nobody knew the day’s numbers until closing.',
      solution:
        'A direct ordering experience the restaurant owns, tied to a kitchen view. Marking a dish unavailable removes it from the customer menu instantly, and orders advance on a kitchen screen both sides can see.',
      features: ['Customer menu by course', 'Basket and order', 'Kitchen order queue', 'Menu availability control', 'Order status for the customer', 'Sales overview'],
      skills: ['Two-sided product design', 'Shared-state interaction', 'Kitchen-tablet usability', 'Hospitality operations'],
      decisions: [
        { title: 'Two views, one source of truth', body: 'Customer and kitchen read the same data. Switch a dish off in the management view and it disappears from the menu at once — try it.' },
        { title: 'Tracking that reflects the kitchen', body: 'Order status is advanced by the kitchen queue, not by an optimistic timer.' },
        { title: 'Built for a tablet near a stove', body: 'Large targets, high contrast, and no control that only works on hover.' },
      ],
      measure: ['Share of orders placed directly', 'Order accuracy', 'Average preparation time', 'Revenue by daypart'],
      accent: '#ff9d6b',
      visual: 'restaurant',
    },
    {
      slug: 'slowtide',
      n: '06',
      brand: 'Slowtide',
      what: 'A digital marketing campaign and creative showcase.',
      summary: 'A launch campaign for a fictional cold-brew tea: concept, identity, ad creatives, a landing page and a campaign dashboard.',
      who: 'A new consumer brand entering a crowded shelf with a small budget and one opinion to leave behind.',
      problem:
        'A new drink has seconds to be understood. Most launches scatter effort across channels with a different look and promise on each, and then cannot tell which effort produced the sales.',
      solution:
        'One idea — “Take the long afternoon” — carried through identity, creative, landing page and measurement, so every touchpoint says the same thing and every result can be traced back.',
      features: ['Campaign concept', 'Identity system', 'Ad creatives', 'Landing page', 'Campaign dashboard', 'Creative testing plan'],
      skills: ['Art direction', 'Copywriting', 'Brand systems', 'Campaign measurement'],
      decisions: [
        { title: 'One line, everywhere', body: 'The campaign line appears unchanged in every format. Recognition comes from repetition, not variety.' },
        { title: 'Creative designed as a system', body: 'A fixed palette, one typeface and a single graphic device make new formats quick to produce and impossible to mistake.' },
        { title: 'The dashboard reports cost first', body: 'Spend and cost per lead come before reach, because vanity numbers are easy to grow and hard to bank.' },
      ],
      measure: ['Cost per qualified lead', 'Landing page conversion', 'Creative-level click-through', 'Return on ad spend'],
      accent: '#9fd8c4',
      visual: 'campaign',
    },
  ],

  services: [
    {
      slug: 'digital-product-development',
      letter: 'A',
      title: 'Digital Product Development',
      short: 'Stores, apps and websites people can use — and a business can run.',
      headline: 'A store, an app or a site that earns its place in the business.',
      capabilities: ['shopify', 'app', 'web'],
      problemTitle: 'Most digital products are built before the problem is understood.',
      problemBody:
        'A store launches without thinking about how orders get fulfilled. An app is designed for a pitch deck instead of for the person behind the counter. It looks finished and still does not help.',
      signs: [
        'Customers browse on their phones but abandon at checkout.',
        'The website exists, but nobody on the team can update it.',
        'Orders, stock and customer messages live in three different places.',
        'An app idea has been “almost started” for a year.',
      ],
      solutionTitle: 'Start from how the business works, then design the product around it.',
      solutionBody:
        'Before any screen is drawn, I map who uses the product, what they are trying to get done, and what happens after they tap the button. The build follows from that: a focused scope, a clear interface, and something the owner can keep running without me.',
      included: [
        { title: 'Shopify & e-commerce', items: ['Storefront design and theme build', 'Product, variant and collection structure', 'Cart and checkout flow', 'Payment, shipping and tax setup', 'Order reporting'] },
        { title: 'Mobile apps', items: ['Mobile-first product design', 'Cross-platform app development', 'Offline-tolerant data handling', 'Notifications and account flows', 'Store submission preparation'] },
        { title: 'Web & custom software', items: ['Marketing and business websites', 'Dashboards and internal tools', 'Third-party API integrations', 'Performance and accessibility', 'Handover documentation'] },
      ],
      steps: [
        { title: 'Scope', body: 'One conversation and a written brief: users, goals, constraints, what “done” means.' },
        { title: 'Prototype', body: 'Key screens designed and clickable before production code is written.' },
        { title: 'Build', body: 'Short, visible milestones. You see working software, not status reports.' },
        { title: 'Launch & handover', body: 'Testing on real devices, launch support, and documentation you can use.' },
      ],
      demos: ['halden-objects', 'tillo', 'ember-and-rye'],
      faqs: [
        { q: 'Do you only work with Shopify?', a: 'Shopify is what I reach for first for most stores, because a small team can run a serious shop without maintaining servers. If the business needs something Shopify handles badly, I will say so and suggest a custom build.' },
        { q: 'Can you improve an existing website or app?', a: 'Yes. I review what exists first and tell you honestly whether improving it or rebuilding part of it makes more sense.' },
        { q: 'How long does a project take?', a: 'It depends on scope, and I would rather give a real estimate after understanding the project than a number that sounds good. A focused store or site is usually measured in weeks; a custom app takes longer.' },
        { q: 'What do you need from me to start?', a: 'A description of the business, the problem you want solved, and any content or branding you already have. The project brief walks through it.' },
      ],
      visual: 'store',
    },
    {
      slug: 'ai-business-systems',
      letter: 'B',
      title: 'AI & Business Systems',
      short: 'Less repeated typing, fewer lost leads, and a clear view of the business.',
      headline: 'Give the repetitive work to the system. Keep the judgment for people.',
      capabilities: ['automation', 'crm', 'ai'],
      problemTitle: 'The business runs on memory, spreadsheets and chat threads.',
      problemBody:
        'It works while the team is small. Then a lead goes unanswered, an invoice is sent twice, and nobody can say how many orders are actually open. The problem is rarely effort — the process only exists in people’s heads.',
      signs: [
        'The same information is typed into more than one tool.',
        'Follow-ups depend on someone remembering.',
        'Reports take hours to assemble and are out of date on arrival.',
        'There is interest in AI, but no clear idea where it would genuinely help.',
      ],
      solutionTitle: 'Write the process down, then let software carry it.',
      solutionBody:
        'I begin by mapping the workflow as it really happens. Then we decide what should be a system of record, what can be automated safely, and where a model adds real value — summarising, drafting, sorting, answering from your own documents — and where it does not.',
      included: [
        { title: 'Systems of record', items: ['CRM setup or custom build', 'Management dashboards', 'Customer, order and task records', 'Roles and permissions'] },
        { title: 'Automation', items: ['Workflow mapping and redesign', 'Trigger-based automations', 'Tool-to-tool integrations', 'Monitoring and failure alerts'] },
        { title: 'Applied AI', items: ['Assistants grounded in your own documents', 'Drafting and summarising inside existing tools', 'Data clean-up and analysis', 'Clear limits, costs and human review points'] },
      ],
      steps: [
        { title: 'Map', body: 'Document the current workflow: who does what, with which tool, and where it breaks.' },
        { title: 'Decide', body: 'Pick the few changes that remove the most friction. Not everything should be automated.' },
        { title: 'Implement', body: 'Build or configure the system, connect the tools, migrate the data.' },
        { title: 'Stabilise', body: 'Train the team, watch it run on real work, and adjust.' },
      ],
      demos: ['linework-crm', 'deskhand', 'tillo'],
      faqs: [
        { q: 'Is the AI assistant on this website a real AI model?', a: 'No. The demonstrations run on scripted local logic so they cost nothing and work offline, and that is stated on each one. In a client project, a real model is connected only with your approval of the provider, the cost and the data handling.' },
        { q: 'Do I need AI at all?', a: 'Often the first win is ordinary automation and a clean system of record. I will tell you when AI is the right tool and when a simple rule does the job better.' },
        { q: 'Will this replace the tools we already use?', a: 'Not unless that is the goal. Most projects connect and tidy what you already have before introducing anything new.' },
        { q: 'What about running costs?', a: 'Any tool or API with a monthly cost is discussed up front, with free or cheaper alternatives where they exist. Nothing is subscribed to on your behalf without agreement.' },
      ],
      visual: 'crm',
    },
    {
      slug: 'digital-growth-creative',
      letter: 'C',
      title: 'Digital Growth & Creative',
      short: 'A clear message, creative that fits the brand, and a path to enquiry.',
      headline: 'Be found, be understood, and give people a reason to get in touch.',
      capabilities: ['marketing', 'branding', 'web'],
      problemTitle: 'Good businesses stay invisible because the message is unclear.',
      problemBody:
        'Money is spent on ads that lead to a page which does not answer the visitor’s question. The brand looks different on every channel. Leads arrive, but nobody knows which effort produced them.',
      signs: [
        'Ad spend goes out, but enquiries are inconsistent.',
        'The offer takes a paragraph to explain.',
        'Visuals are made one at a time with no shared identity.',
        'There is no simple way to see what is working.',
      ],
      solutionTitle: 'One message, one journey, measured honestly.',
      solutionBody:
        'I work backwards from the action you want a customer to take. That defines the offer, the landing page, the creative and the channels — in that order. Every campaign is set up so results can be read plainly, including when they are disappointing.',
      included: [
        { title: 'Strategy & funnel', items: ['Offer and audience definition', 'Landing page and lead capture', 'Sales funnel structure', 'Tracking and reporting setup'] },
        { title: 'Creative', items: ['Brand identity basics', 'Advertising creatives', 'Social media templates', 'Short-form video editing'] },
        { title: 'Campaigns', items: ['Paid advertising setup', 'Creative testing plan', 'Lead follow-up workflow', 'Plain-language performance reviews'] },
      ],
      steps: [
        { title: 'Position', body: 'Who it is for, what it solves, and why now — in one or two sentences.' },
        { title: 'Create', body: 'A landing page and a small set of creative built around that single message.' },
        { title: 'Run', body: 'Launch small, read the numbers, keep what works and cut what does not.' },
        { title: 'Report', body: 'Cost, enquiries and what changed — in a format a non-marketer can read.' },
      ],
      demos: ['slowtide', 'halden-objects'],
      faqs: [
        { q: 'Do you guarantee a number of leads?', a: 'No. Anyone guaranteeing leads before seeing the market is guessing. I can guarantee a clear offer, honest measurement and a plan to test it.' },
        { q: 'Is the campaign shown here a real client?', a: 'No. Slowtide is a fictional brand created to demonstrate campaign thinking end to end, and every figure in its dashboard is sample data.' },
        { q: 'Can you work with my existing brand?', a: 'Usually yes. If the identity is sound, the work is about consistency and one clear message rather than a new logo.' },
        { q: 'What budget do campaigns need?', a: 'It depends on the market and the cost of a lead in it. I would rather start small, learn, and scale what works than spend a large budget on an untested message.' },
      ],
      visual: 'marketing',
    },
  ],

  problems: [
    { id: 'store', statement: 'My business needs an online store.', why: 'Customers expect to browse and buy on their phone at any hour. Without a store you own, sales depend on walk-ins, marketplaces and message threads.', solution: 'A focused online store: clear product pages, a short checkout, payments and delivery set up for where you actually sell.', tech: ['Shopify', 'Payments', 'Delivery', 'Analytics'], help: 'I plan the catalogue, design and build the storefront, set up payments and delivery, and show you how to run it.', service: 'digital-product-development', project: 'halden-objects' },
    { id: 'app', statement: 'I need a mobile application.', why: 'Some jobs happen away from a desk — at a counter, on a delivery, in a customer’s hand. A good app meets people there; a bad one gets deleted.', solution: 'Define the two or three things the app must do well, prototype them, then build for both iPhone and Android from one codebase.', tech: ['React Native', 'API backend', 'Notifications', 'Store release'], help: 'I turn the idea into a scoped plan, design the screens, build the app and prepare it for release.', service: 'digital-product-development', project: 'tillo' },
    { id: 'manual', statement: 'My business processes are manual.', why: 'Manual work grows with headcount and stops when someone is away. Every re-typed order is a small cost and a possible mistake.', solution: 'Map the process as it really runs, remove the steps nobody needs, and put the rest into a system that does not forget.', tech: ['Workflow mapping', 'Dashboard', 'Integrations', 'Automation rules'], help: 'I document the current process with you, propose a simpler one, and build or configure the tools to run it.', service: 'ai-business-systems', project: 'linework-crm' },
    { id: 'crm', statement: 'I need a CRM or management system.', why: 'When customer history lives in individual phones and inboxes, the business cannot see its own pipeline — and loses it when someone leaves.', solution: 'One shared record for leads, customers and tasks, shaped around your sales process instead of a generic template.', tech: ['CRM setup', 'Database', 'Email & messaging', 'Reporting'], help: 'I help you choose between configuring an existing CRM and building a lighter custom one, then set it up and move your data across.', service: 'ai-business-systems', project: 'linework-crm' },
    { id: 'ai', statement: 'I want to use AI in my business.', why: 'AI is useful where there is repetitive reading, writing or sorting. Used without a clear job, it adds cost and risk instead of removing work.', solution: 'Find one or two tasks where a model saves real time, connect it to your own information, and keep a person in the loop.', tech: ['Language model', 'Document search', 'Review steps', 'Usage monitoring'], help: 'I identify the right first use case, build a small working version, and am clear about running costs before anything is switched on.', service: 'ai-business-systems', project: 'deskhand' },
    { id: 'leads', statement: 'I need more qualified leads.', why: 'More traffic is not more business. Leads that do not fit waste the time of whoever has to call them back.', solution: 'A sharper offer, a landing page that qualifies as it converts, and campaigns measured by cost per real enquiry.', tech: ['Landing page', 'Paid ads', 'Lead forms', 'CRM hand-off'], help: 'I define the offer with you, build the page and creative, run the campaign, and report what it cost and what came back.', service: 'digital-growth-creative', project: 'slowtide' },
    { id: 'presence', statement: 'I need a better digital presence.', why: 'People check before they call. An outdated site or inconsistent profiles quietly send them to a competitor.', solution: 'A clear, fast website and a consistent identity in the places customers actually look.', tech: ['Website', 'Brand identity', 'SEO basics', 'Social templates'], help: 'I audit what exists, tighten the message, and design and build a presence you can keep current yourself.', service: 'digital-growth-creative', project: 'slowtide' },
    { id: 'automate', statement: 'I want to automate repetitive work.', why: 'Repetitive tasks are where attention goes to die — and where small errors accumulate unnoticed.', solution: 'Automate the predictable steps between your tools, with alerts when something fails and an easy way to pause.', tech: ['Automation platform', 'APIs & webhooks', 'Scheduled jobs', 'Monitoring'], help: 'I list the repetitive tasks with you, rank them by time saved, and automate the top few properly.', service: 'ai-business-systems', project: 'linework-crm' },
  ],

  industries: [
    { name: 'E-commerce', note: 'Storefronts, checkout friction, fulfilment and repeat purchase.' },
    { name: 'Retail', note: 'Stock visibility, point-of-sale data and connecting the shop to online.' },
    { name: 'Restaurants', note: 'Direct ordering, menu accuracy and a kitchen that sees what was sold.' },
    { name: 'Professional services', note: 'Lead intake, proposals, scheduling and client records.' },
    { name: 'Healthcare', note: 'Appointment flow, patient communication and reducing front-desk load.' },
    { name: 'Education', note: 'Enrolment, course delivery and keeping learners and parents informed.' },
    { name: 'Real estate', note: 'Listing presentation, enquiry handling and follow-up discipline.' },
    { name: 'Hospitality', note: 'Direct bookings, guest messaging and day-to-day operations.' },
    { name: 'Logistics', note: 'Order tracking, dispatch coordination and status updates.' },
    { name: 'Manufacturing', note: 'Order-to-production visibility and replacing paper job sheets.' },
    { name: 'Finance & business services', note: 'Client onboarding, document handling and clear reporting.' },
    { name: 'Local businesses', note: 'Being found, being contacted, and looking as good online as in person.' },
  ],

  story: [
    { n: '01', title: 'Curiosity', body: 'It began with wanting to know how things work. Exploring technology, taking ideas apart, and looking for ways to make something a little better than it was.' },
    { n: '02', title: 'Learning', body: 'Six to seven years of exploring and teaching myself the digital world — software, online business, design, marketing — from the belief that technology will shape the future, and that it is better to prepare for it than fall behind.' },
    { n: '03', title: 'Building', body: 'Learning turned into practice: digital projects, business ideas, software, and helping other people understand and improve their own businesses.' },
    { n: '04', title: 'Constraints', body: 'A slow laptop. Limited hardware. Internet that could not be relied on. Those limits taught persistence, resourcefulness and how to get the most out of what is available.' },
    { n: '05', title: 'Vision', body: 'The ambition reaches past personal success: to one day build businesses and institutions that create opportunity, employment, education and access to healthcare for underserved communities.' },
  ],

  lessons: [
    { title: 'Time is the expensive resource', body: 'Tools can be replaced and money can be earned again. Hours cannot. Plan before building.' },
    { title: 'Mistakes are tuition', body: 'A mistake is only wasted if nothing changes afterwards. Write down what it taught.' },
    { title: 'Depth beats drift', body: 'Mastering one thing is worth more than touching ten. Finish, then move on.' },
    { title: 'Constraints are a teacher', body: 'Limited hardware and unreliable internet force efficient habits. Build for the slow connection first.' },
  ],

  pages: {
    industries: {
      title: 'Different businesses. Familiar problems.',
      lede: 'The business environments I want to work in, and the specific friction I would look for in each. This is a list of interest, not a claim of specialist credentials.',
      note: 'Every industry below maps onto one or more of the six concept projects. None of them are claimed as client work.',
    },
    insights: {
      title: 'Working notes.',
      lede: 'Short principles learned the slow way, from building under real constraints.',
      draft: 'Longer articles are in draft and will be published here when they are ready — not before.',
    },
    lab: {
      title: 'A place for the experiments.',
      lede: 'Small interactive pieces built while learning: type studies, interface sketches and prototypes. Some are rough on purpose.',
      note: 'Everything here is a personal experiment, not client work.',
    },
    caseStudies: {
      title: 'Why each demo was built the way it was.',
      lede: 'Every project page already includes its three key decisions. This is the index of those decisions in one place.',
      note: 'The six projects are self-initiated concept work with fictional brands and sample data.',
    },
    results: {
      title: 'What I would measure — not what I claim.',
      lede: 'There are no client results to report yet, and inventing them would make everything else on this site worthless. What follows is what I would ask a business to measure.',
      note: 'No figures on this page describe real business outcomes.',
    },
    testimonials: {
      title: 'Nothing invented — so for now it is mostly empty.',
      lede: 'Real reviews are published only with the client’s own words, their permission, and a link to the source.',
      note: 'The card below is a layout demonstration, clearly marked as such.',
    },
  },
};
