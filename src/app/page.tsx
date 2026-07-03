import Link from 'next/link';

type Icon = 'fish' | 'leaf' | 'beaker' | 'box' | 'arrows' | 'gauge' | 'check' | 'book';

function IconPath({ name }: { name: Icon }) {
  const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'fish':
      return (
        <svg {...common}><path d="M6.5 12c0-3 2.5-6 7.5-6 4 0 7 2 7 2l3-2-1 4 1 4-3-2s-3 2-7 2c-5 0-7.5-3-7.5-6Z" /><path d="M16 12h.01" /></svg>
      );
    case 'leaf':
      return (
        <svg {...common}><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 12-4 16-9 16Z" /><path d="M4 20 11 13" /></svg>
      );
    case 'beaker':
      return (
        <svg {...common}><path d="M4 4h10l-1 6 4 7c1 2 0 3-2 3H6c-2 0-3-1-2-3l4-7-1-6Z" /><path d="M5 13h10" /></svg>
      );
    case 'box':
      return (
        <svg {...common}><path d="M3 7 12 3 21 7 12 11 3 7Z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></svg>
      );
    case 'arrows':
      return (
        <svg {...common}><path d="M7 11 4 8l3-3" /><path d="M4 8h8a4 4 0 0 1 0 8H8" /><path d="m17 13 3 3-3 3" /><path d="M20 16h-4a4 4 0 0 1 0-8h0" /></svg>
      );
    case 'gauge':
      return (
        <svg {...common}><path d="M12 14a6 6 0 0 0 0-12 6 6 0 0 0 0 12Z" /><path d="M12 8 15 5" /><path d="M3 20h18M6 16l2 1M18 16l-2 1" /></svg>
      );
    case 'check':
      return (
        <svg {...common}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8 12 3 3 5-6" /></svg>
      );
    case 'book':
      return (
        <svg {...common}><path d="M4 4 12 4 20 4 20 20 12 20 4 20 4 4Z" /><path d="M12 4v16" /></svg>
      );
  }
}

type Feature = {
  href: string;
  title: string;
  description: string;
  icon: Icon;
  accent: 'teal' | 'green' | 'accent';
  cta: string;
};

const planFeatures: Feature[] = [
  { href: '/builder', title: 'Tank Builder', description: 'Design your setup with compatibility checking. Get tailored recommendations, then save your builds.', icon: 'beaker', accent: 'teal', cta: 'Start building' },
  { href: '/compatibility', title: 'Compatibility Checker', description: 'Pair up any two animals to see if they can live together based on temperament, size, and water needs.', icon: 'arrows', accent: 'teal', cta: 'Check pairings' },
  { href: '/setup-checklist', title: 'Setup Checklist', description: 'Walk through a step-by-step interactive checklist for planning, building, and stocking a tank.', icon: 'check', accent: 'teal', cta: 'Start checklist' },
];

const exploreFeatures: Feature[] = [
  { href: '/animals', title: 'Animal Database', description: 'Browse fish, invertebrates, amphibians, and reptiles with accurate care requirements.', icon: 'fish', accent: 'green', cta: 'Browse animals' },
  { href: '/plants', title: 'Plant Database', description: 'Aquatic and terrestrial plants with light needs, growth rates, and placement guidance.', icon: 'leaf', accent: 'green', cta: 'Browse plants' },
  { href: '/products', title: 'Product Guide', description: 'Curated equipment recommendations by budget tier — filters, heaters, lighting, and more.', icon: 'box', accent: 'green', cta: 'View products' },
];

const trackFeatures: Feature[] = [
  { href: '/tracking', title: 'My Tanks', description: 'Log water parameters, maintenance, feeding, and livestock health over time.', icon: 'gauge', accent: 'accent', cta: 'View my tanks' },
];

const learnFeatures: Feature[] = [
  { href: '/guides', title: 'Beginner Guides', description: 'New to the hobby? Start here with step-by-step articles on the nitrogen cycle, water testing, fish diseases, and more.', icon: 'book', accent: 'teal', cta: 'Read guides' },
];

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Link href={feature.href} className="feature-card">
      <span className={`feature-icon ${feature.accent === 'teal' ? '' : feature.accent}`}>
        <IconPath name={feature.icon} />
      </span>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
      <span className="feature-arrow">
        {feature.cta}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
      </span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <>
      <div className="hero">
        <h1>Aquascape</h1>
        <p>Plan, build, and track your aquariums and vivariums</p>
      </div>

      <section className="section">
        <div className="feature-subheading-row">
          <h2 className="feature-subheading">Plan</h2>
        </div>
        <div className="feature-grid">
          {planFeatures.map((f) => (
            <FeatureCard key={f.href} feature={f} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="feature-subheading-row">
          <h2 className="feature-subheading">Explore</h2>
        </div>
        <div className="feature-grid">
          {exploreFeatures.map((f) => (
            <FeatureCard key={f.href} feature={f} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="feature-subheading-row">
          <h2 className="feature-subheading">Track</h2>
        </div>
        <div className="feature-grid">
          {trackFeatures.map((f) => (
            <FeatureCard key={f.href} feature={f} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="feature-subheading-row">
          <h2 className="feature-subheading">Learn</h2>
        </div>
        <div className="feature-grid">
          {learnFeatures.map((f) => (
            <FeatureCard key={f.href} feature={f} />
          ))}
        </div>
      </section>
    </>
  );
}
