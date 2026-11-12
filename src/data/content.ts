export interface Problem {
  id: string;
  statement: string;
  why: string;
  solution: string;
  tech: string[];
  help: string;
  service: string;
  project: string;
}

export const problems: Problem[] = [
  { id: 'store', statement: 'My business needs an e-commerce store.', why: 'Customers expect to browse and buy on their phone, at any hour. Without a store you own, sales depend on walk-ins, marketplaces and message threads.', solution: 'A focused online store: clear product pages, a short checkout, payments and shipping configured for where you actually sell.', tech: ['Shopify', 'Payment gateway', 'Analytics', 'Email receipts'], help: 'I plan the catalogue structure, design and build the storefront, set up payments and delivery, and show you how to run it day to day.', service: 'digital-product-development', project: 'halden-objects' },
  { id: 'app', statement: 'I need a mobile application.', why: 'Some jobs happen away from a desk — at a counter, on a delivery, in a customer’s hand. A good app meets people there; a bad one gets deleted.', solution: 'Define the two or three things the app must do well, prototype them, then build for both iOS and Android from one codebase.', tech: ['React Native / Flutter', 'API backend', 'Push notifications', 'App store release'], help: 'I turn the idea into a scoped plan, design the screens, build the app and prepare it for release.', service: 'digital-product-development', project: 'tillo' },
  { id: 'manual', statement: 'My business processes are manual.', why: 'Manual work scales with headcount and breaks with absence. Every re-typed order is a small cost and a possible mistake.', solution: 'Map the process as it really runs, remove the steps nobody needs, and put the rest into a system that does not forget.', tech: ['Workflow mapping', 'Management dashboard', 'Integrations', 'Automation rules'], help: 'I document the current process with you, propose a simpler one, and build or configure the tools to run it.', service: 'ai-business-systems', project: 'linework-crm' },
  { id: 'crm', statement: 'I need a CRM or management system.', why: 'When customer history lives in individual phones and inboxes, the business cannot see its own pipeline — and loses it when someone leaves.', solution: 'One shared record for leads, customers and tasks, shaped around your sales process rather than a generic template.', tech: ['CRM platform or custom build', 'Database', 'Email / messaging integration', 'Reporting'], help: 'I help you choose between configuring an existing CRM and building a lighter custom one, then set it up and migrate your data.', service: 'ai-business-systems', project: 'linework-crm' },
  { id: 'ai', statement: 'I want to use AI in my business.', why: 'AI is useful where there is repetitive reading, writing or sorting. Used without a clear job, it adds cost and risk instead of removing work.', solution: 'Find one or two tasks where a model saves real time, connect it to your own information, and keep a person in the loop.', tech: ['Language model API', 'Document retrieval', 'Guardrails & review', 'Usage monitoring'], help: 'I identify the right first use case, build a small working version, and am clear about running costs before anything is switched on.', service: 'ai-business-systems', project: 'deskhand' },
  { id: 'leads', statement: 'I need more qualified leads.', why: 'More traffic is not more business. Leads that do not fit waste the time of whoever has to call them back.', solution: 'A sharper offer, a landing page that qualifies as it converts, and campaigns measured by cost per real enquiry.', tech: ['Landing page', 'Paid ads', 'Lead forms', 'Tracking & CRM hand-off'], help: 'I define the offer with you, build the page and creative, run the campaign and report what it cost and what came back.', service: 'digital-growth-creative', project: 'slowtide' },
  { id: 'presence', statement: 'I need a better digital presence.', why: 'People check before they call. An outdated site or inconsistent profiles quietly send them to a competitor.', solution: 'A clear, fast website and a consistent identity across the places customers look.', tech: ['Website', 'Brand identity', 'SEO basics', 'Social templates'], help: 'I audit what exists, tighten the message, and design and build a presence you can keep current yourself.', service: 'digital-growth-creative', project: 'slowtide' },
  { id: 'automate', statement: 'I want to automate repetitive work.', why: 'Repetitive tasks are where attention goes to die — and where small errors accumulate unnoticed.', solution: 'Automate the predictable steps between your tools, with alerts when something fails and an easy way to pause.', tech: ['Automation platform or scripts', 'APIs & webhooks', 'Scheduled jobs', 'Monitoring'], help: 'I list the repetitive tasks with you, rank them by time saved, and automate the top few properly.', service: 'ai-business-systems', project: 'linework-crm' },
];

export interface Industry { name: string; note: string }
export const industries: Industry[] = [
  { name: 'E-commerce', note: 'Storefronts, checkout friction, fulfilment and repeat purchase.' },
  { name: 'Retail', note: 'Stock visibility, point-of-sale data and connecting the shop floor to online.' },
  { name: 'Healthcare', note: 'Appointment flow, patient communication and reducing front-desk load.' },
  { name: 'Education', note: 'Enrolment, course delivery and keeping learners and parents informed.' },
  { name: 'Real estate', note: 'Listing presentation, enquiry handling and follow-up discipline.' },
  { name: 'Hospitality', note: 'Direct bookings, guest messaging and day-to-day operations.' },
  { name: 'Restaurants', note: 'Direct ordering, menu accuracy and a kitchen that sees what was sold.' },
  { name: 'Professional services', note: 'Lead intake, proposals, scheduling and client records.' },
  { name: 'Finance & business services', note: 'Client onboarding, document handling and clear reporting.' },
  { name: 'Logistics', note: 'Order tracking, dispatch coordination and status updates.' },
  { name: 'Manufacturing', note: 'Order-to-production visibility and replacing paper job sheets.' },
  { name: 'Startups', note: 'Getting a first version in front of users without overbuilding.' },
  { name: 'Agencies', note: 'Delivery capacity, white-label builds and internal tooling.' },
  { name: 'Local businesses', note: 'Being found, being contacted, and looking as good online as in person.' },
];

export const processSteps = [
  { title: 'Understand the business', body: 'Before talking about features, I learn how the business makes money, who its customers are and what a normal day looks like.', output: 'A short written summary you can correct.' },
  { title: 'Identify the real problem', body: 'The first request is often a symptom. We look for the cause — the step that is slow, the information that is missing, the customer who gives up.', output: 'A one-paragraph problem statement.' },
  { title: 'Plan the solution', body: 'Scope, priorities, tools and costs are agreed in plain language. What is not included is written down as clearly as what is.', output: 'Scope, milestones and running costs.' },
  { title: 'Design the experience', body: 'Key screens and flows are designed and made clickable, so decisions are made on something real rather than on descriptions.', output: 'A prototype of the important paths.' },
  { title: 'Build the product', body: 'Development happens in short milestones with something working to review at each one.', output: 'Working software, shown regularly.' },
  { title: 'Test and improve', body: 'Real devices, real content, real edge cases. Problems found here are cheap; problems found by customers are not.', output: 'A tested release and a fix list closed.' },
  { title: 'Deliver and support', body: 'Launch, handover and documentation — followed by a period of support while the product meets real use.', output: 'Launch, documentation, agreed support.' },
];

export const story = [
  { n: '01', title: 'Curiosity', body: 'It began with wanting to know how things work. Exploring technology, taking ideas apart, and looking for ways to make something a little better than it was.' },
  { n: '02', title: 'Learning', body: 'Six to seven years of exploring and teaching himself the digital world — software, online business, design, marketing — driven by the belief that technology will shape the future, and that it is better to prepare for it than fall behind.' },
  { n: '03', title: 'Building', body: 'Learning turned into practice: digital projects, business ideas, software, and helping other people understand and improve their own businesses.' },
  { n: '04', title: 'Challenges', body: 'A slow laptop. Limited hardware. Internet that could not be relied on. Those limits taught persistence, resourcefulness and how to get the most out of what is available.' },
  { n: '05', title: 'Vision', body: 'The ambition reaches past personal success: to one day build businesses and institutions that create opportunity, employment, education and access to healthcare for underserved communities.' },
];

export const lessons = [
  { title: 'Time is the expensive resource', body: 'Tools can be replaced and money can be earned again. Hours cannot. Plan before building.' },
  { title: 'Mistakes are tuition', body: 'A mistake is only wasted if nothing changes afterwards. Write down what it taught.' },
  { title: 'Depth beats drift', body: 'Mastering one thing is worth more than touching ten. Finish, then move on.' },
  { title: 'Constraints are a teacher', body: 'Limited hardware and unreliable internet force efficient habits. Build for the slow connection first.' },
];
